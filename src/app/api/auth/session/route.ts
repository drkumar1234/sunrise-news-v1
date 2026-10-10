import { requireAdmin, json, apiError } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try { return json({ user: await requireAdmin(request) }); }
  catch (error) { return apiError(error); }
}
