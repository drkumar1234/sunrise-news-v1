import { getSettings, updateSettings } from '@/lib/db';
import { requireAdmin, json, apiError } from '@/lib/auth';
import { settingsInput, readJson } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET() {
  try { return json({ settings: await getSettings() }); }
  catch (error) { return apiError(error); }
}
export async function PUT(request: Request) {
  try {
    const user = await requireAdmin(request);
    return json({ settings: await updateSettings(settingsInput(await readJson(request, 40000)), user) });
  } catch (error) { return apiError(error); }
}
