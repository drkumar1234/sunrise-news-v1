import { authenticate, createSession, SESSION_COOKIE, sessionCookieOptions, json, apiError } from '@/lib/auth';
import { readJson, string, onlyKeys } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const input = await readJson(request, 8192);
    onlyKeys(input, ['email', 'password']);
    const email = string(input.email, 'email', 254, true);
    // Preserve password whitespace exactly.
    if (typeof input.password !== 'string') return json({ error: 'Email and password are required.' }, 400);
    string(input.password, 'password', 1024, true);
    const user = await authenticate(request, email, input.password);
    const response = json({ user });
    response.cookies.set(SESSION_COOKIE, await createSession(), sessionCookieOptions());
    return response;
  } catch (error) { return apiError(error); }
}
