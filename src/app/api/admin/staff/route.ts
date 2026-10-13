import { requireAdmin, json, apiError } from '@/lib/auth';
import { readJson } from '@/lib/validation';
import { getStaff, staffInput, saveStaff } from '@/lib/staff';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try { await requireAdmin(request); return json({ staff: await getStaff() }); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try { await requireAdmin(request); return json({ member: await saveStaff(await staffInput(await readJson(request, 10000))) }, 201); }
  catch (error) { return apiError(error); }
}
