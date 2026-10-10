import { requireSameOrigin, SESSION_COOKIE, sessionCookieOptions, json, apiError } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const response = json({ success: true });
    response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 });
    return response;
  } catch (error) { return apiError(error); }
}
