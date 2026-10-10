import { getAdPlacements, saveAdPlacement } from '@/lib/db';
import { requireAdmin, json, apiError } from '@/lib/auth';
import { adInput, readJson } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try { await requireAdmin(request); return json({ ads: await getAdPlacements() }); }
  catch (error) { return apiError(error); }
}
export async function PUT(request: Request) {
  try { const user = await requireAdmin(request); return json({ ad: await saveAdPlacement(adInput(await readJson(request, 20000)), user) }); }
  catch (error) { return apiError(error); }
}
