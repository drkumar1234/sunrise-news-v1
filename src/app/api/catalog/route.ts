import { getCategories, getTags, getAuthors } from '@/lib/db';
import { json, apiError } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const [categories, tags, authors] = await Promise.all([getCategories(), getTags(), getAuthors()]);
    return json({ categories, tags, authors });
  } catch (error) { return apiError(error); }
}
