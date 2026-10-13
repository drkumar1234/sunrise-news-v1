import { requireAdmin, json, apiError } from '@/lib/auth';
import { readJson } from '@/lib/validation';
import { staffInput, saveStaff, removeStaff } from '@/lib/staff';
export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: Request, context: Context) {
  try { await requireAdmin(request); return json({ member: await saveStaff(await staffInput(await readJson(request, 10000)), (await context.params).id) }); }
  catch (error) { return apiError(error); }
}
export async function DELETE(request: Request, context: Context) {
  try { await requireAdmin(request); await removeStaff((await context.params).id); return json({ success: true }); }
  catch (error) { return apiError(error); }
}
