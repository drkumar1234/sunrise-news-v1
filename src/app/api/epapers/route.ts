import { getEpaperEditions } from '@/lib/db';
import { apiError, json } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET() {
  try { return json({ editions: await getEpaperEditions() }); }
  catch (error) { return apiError(error); }
}
