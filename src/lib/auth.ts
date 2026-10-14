import 'server-only';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { consumeRateLimit, readJSON, mutateJSON, StorageConflictError, usesNetlifyStorage } from './storage';
import { authenticateEmployee, employeeRecords } from './employees';

export type AdminUser = { id: string; name: string; role: 'super_admin' | 'editor' };
export const SESSION_COOKIE = 'sunrise_admin';
export const SESSION_SECONDS = 8 * 60 * 60;

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } });
}

export function apiError(error: unknown) {
  if (error instanceof ApiError) return json({ error: error.message }, error.status);
  if (error instanceof StorageConflictError) return json({ error: error.message }, 409);
  if (error instanceof Error && error.name === 'DatabaseValidationError' && 'status' in error) {
    return json({ error: error.message }, error.status === 409 ? 409 : 400);
  }
  console.error('CMS request failed:', error instanceof Error ? error.name : 'Unknown error');
  return json({ error: 'The request could not be completed. Please try again.' }, 500);
}

async function signingSecret(): Promise<string> {
  if (process.env.SESSION_SECRET) {
    if (process.env.SESSION_SECRET.length < 32) throw new ApiError(503, 'The session signing secret must contain at least 32 characters.');
    return process.env.SESSION_SECRET;
  }
  const existing = await readJSON<{ secret?: string }>('sunrise-auth', 'signing-key-v1', () => ({}));
  if (existing.secret && existing.secret.length >= 32) return existing.secret;
  const candidate = randomBytes(48).toString('base64url');
  return mutateJSON<{ secret?: string }, string>('sunrise-auth', 'signing-key-v1', () => ({}), data => {
    if (!data.secret) data.secret = candidate;
    if (data.secret.length < 32) throw new ApiError(503, 'The stored session signing secret is invalid.');
    return data.secret;
  });
}

async function configuration() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new ApiError(503, 'Administrator sign-in is not configured. Contact the site owner.');
  }
  return { email, password, secret: await signingSecret() };
}

function equal(a: string, b: string) {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}

function credentialVersion(email: string, password: string, secret: string) {
  return createHmac('sha256', secret).update(`${email}\0${password}`).digest('base64url');
}

function owner(): AdminUser {
  return { id: 'site-owner', name: 'Sunrise News Owner', role: 'super_admin' };
}

export async function createSession(now = Date.now(), user: AdminUser = owner()) {
  const { email, password, secret } = await configuration();
  const employee = user.id === 'site-owner' ? null : (await employeeRecords()).find(item => item.id === user.id && !item.removedAt);
  if (user.id !== 'site-owner' && !employee) throw new ApiError(401, 'Employee access has been removed.');
  const payload = Buffer.from(JSON.stringify({
    sub: user.id, iat: Math.floor(now / 1000), exp: Math.floor(now / 1000) + SESSION_SECONDS,
    version: employee ? credentialVersion(employee.email, employee.passwordHash, secret) : credentialVersion(email, password, secret),
  })).toString('base64url');
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`;
}

export async function verifySession(token: string, now = Date.now()): Promise<AdminUser | null> {
  if (token.length > 2048) return null;
  const { email, password, secret } = await configuration();
  const parts = token.split('.');
  if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0])) return null;
  const expected = createHmac('sha256', secret).update(parts[0]).digest('base64url');
  if (!equal(parts[1], expected)) return null;
  try {
    const claims = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const seconds = Math.floor(now / 1000);
    if (!Number.isInteger(claims.exp) || !Number.isInteger(claims.iat)
      || claims.exp <= seconds || claims.iat > seconds + 30 || claims.exp - claims.iat !== SESSION_SECONDS
      ) return null;
    if (claims.sub === 'site-owner') return equal(String(claims.version), credentialVersion(email, password, secret)) ? owner() : null;
    const employee = (await employeeRecords()).find(item => item.id === claims.sub && !item.removedAt);
    if (!employee || !equal(String(claims.version), credentialVersion(employee.email, employee.passwordHash, secret))) return null;
    return { id: employee.id, name: employee.name, role: employee.role };
  } catch { return null; }
}

export async function getSession(request: Request): Promise<AdminUser | null> {
  const cookie = request.headers.get('cookie')?.split(';').map(part => part.trim())
    .find(part => part.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) return null;
  try { return await verifySession(cookie.slice(SESSION_COOKIE.length + 1)); }
  catch { return null; }
}

export function requireSameOrigin(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') throw new ApiError(403, 'Cross-site request rejected.');
  const origin = request.headers.get('origin');
  if (!origin) throw new ApiError(403, 'A same-origin browser request is required.');
  const allowed = [new URL(request.url).origin];
  for (const value of [process.env.SITE_URL, process.env.URL, process.env.DEPLOY_PRIME_URL]) {
    if (value) { try { allowed.push(new URL(value).origin); } catch { /* Ignore invalid deployment metadata. */ } }
  }
  if (!allowed.includes(origin)) throw new ApiError(403, 'Cross-site request rejected.');
}

export async function requireAdmin(request: Request): Promise<AdminUser> {
  const user = await getSession(request);
  if (!user) throw new ApiError(401, 'Please sign in to the newsroom.');
  if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) requireSameOrigin(request);
  return user;
}

export function sessionCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, path: '/', maxAge: SESSION_SECONDS };
}

export async function requireOwner(request: Request) {
  const user = await requireAdmin(request);
  if (user.role !== 'super_admin') throw new ApiError(403, 'Only the site owner can manage employees.');
  return user;
}

export async function authenticate(request: Request, email: string, password: string) {
  requireSameOrigin(request);
  const config = await configuration();
  // Netlify supplies this header at its edge. Unknown clients share a bucket.
  const address = process.env.SUNRISE_STORAGE === 'cloudflare'
    ? (request.headers.get('cf-connecting-ip') || 'unknown')
    : usesNetlifyStorage() ? (request.headers.get('x-nf-client-connection-ip') || 'unknown') : 'local';
  const key = createHmac('sha256', config.secret).update(address).digest('hex');
  if (!(await consumeRateLimit(`login-ip-${key}`, 8, 15 * 60_000))
    || !(await consumeRateLimit('login-global', 60, 60 * 60_000))) {
    throw new ApiError(429, 'Too many sign-in attempts. Please try again later.');
  }
  const emailMatches = equal(email.trim().toLowerCase(), config.email);
  const passwordMatches = equal(password, config.password);
  if (emailMatches && passwordMatches) return owner();
  const employee = await authenticateEmployee(email, password);
  if (!employee || emailMatches) throw new ApiError(401, 'Email or password is incorrect.');
  return { id: employee.id, name: employee.name, role: employee.role } satisfies AdminUser;
}
