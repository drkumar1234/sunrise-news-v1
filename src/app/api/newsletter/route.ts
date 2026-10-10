import { createHash } from 'node:crypto';
import { addSubscriber, getSubscribers } from '@/lib/db';
import { consumeRateLimit, usesNetlifyStorage } from '@/lib/storage';
import { requireAdmin, requireSameOrigin, json, apiError, ApiError } from '@/lib/auth';
import { readJson, string, onlyKeys } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const input = await readJson(request, 8192);
    onlyKeys(input, ['email', 'language', 'editions']);
    const email = string(input.email, 'email', 254, true).toLowerCase();
    if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(email)) throw new ApiError(400, 'A valid email is required.');
    const language = input.language ?? 'en';
    if (language !== 'en' && language !== 'te') throw new ApiError(400, 'Invalid language.');
    const editions = input.editions ?? ['morning_briefing'];
    if (!Array.isArray(editions) || editions.length < 1 || editions.length > 3 || editions.some(edition => !['morning_briefing', 'ap_telangana', 'sunday_special'].includes(edition))) throw new ApiError(400, 'Choose valid newsletter editions.');
    const address = usesNetlifyStorage() ? (request.headers.get('x-nf-client-connection-ip') || 'unknown') : 'local';
    if (!(await consumeRateLimit(`newsletter-${createHash('sha256').update(address).digest('hex')}`, 10, 60 * 60_000))) throw new ApiError(429, 'Too many requests. Please try again later.');
    await addSubscriber(email, language, editions);
    return json({ success: true, message: 'Thank you. Your newsletter preferences have been saved.' });
  } catch (error) { return apiError(error); }
}
export async function GET(request: Request) {
  try { await requireAdmin(request); return json({ subscribers: await getSubscribers() }); }
  catch (error) { return apiError(error); }
}
