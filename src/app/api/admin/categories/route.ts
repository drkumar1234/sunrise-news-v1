import { getCategories, saveCategory } from '@/lib/db';
import { requireAdmin, json, apiError, ApiError } from '@/lib/auth';
import { categoryInput, readJson } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try { await requireAdmin(request); return json({ categories: await getCategories() }); }
  catch (error) { return apiError(error); }
}
export async function PUT(request: Request) {
  try {
    const user = await requireAdmin(request);
    const category = categoryInput(await readJson(request, 20000));
    const categories = await getCategories();
    if (categories.some(c => c.slug === category.slug && c.id !== category.id)) throw new ApiError(409, 'That category slug already exists.');
    if (category.parentId && (category.parentId === category.id || !categories.some(c => c.id === category.parentId && !c.parentId))) throw new ApiError(400, 'Select a valid parent category.');
    return json({ category: await saveCategory(category, user) });
  } catch (error) { return apiError(error); }
}
