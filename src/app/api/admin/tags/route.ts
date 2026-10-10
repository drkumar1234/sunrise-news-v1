import { getTags, saveTag } from '@/lib/db';
import { requireAdmin, json, apiError, ApiError } from '@/lib/auth';
import { tagInput, readJson } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try { await requireAdmin(request); return json({ tags: await getTags() }); }
  catch (error) { return apiError(error); }
}
export async function PUT(request: Request) {
  try {
    const user = await requireAdmin(request);
    const tag = tagInput(await readJson(request, 20000));
    const tags = await getTags();
    if (tags.some(t => t.slug === tag.slug && t.id !== tag.id)) throw new ApiError(409, 'That tag slug already exists.');
    return json({ tag: await saveTag(tag, user) });
  } catch (error) { return apiError(error); }
}
