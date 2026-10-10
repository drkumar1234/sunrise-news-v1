import { getAuditLogs } from '@/lib/db';
import { requireAdmin, json, apiError } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try { await requireAdmin(request); return json({ logs: (await getAuditLogs()).slice(0, 1000) }); }
  catch (error) { return apiError(error); }
}
