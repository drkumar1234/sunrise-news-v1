import { getArticleById, updateArticle, deleteArticle, getArticleRevisions, getCategories, getAuthors } from '@/lib/db';
import { requireAdmin, getSession, json, apiError, ApiError } from '@/lib/auth';
import { articleInput, readJson, string } from '@/lib/validation';
import { publicArticle } from '@/lib/public-articles';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  try {
    const params = await context.params;
    const user = await getSession(request);
    const article = await getArticleById(params.id);
    if (!article || (!user && article.status !== 'published')) throw new ApiError(404, 'Article not found.');
    return json(user ? { article, revisions: await getArticleRevisions(params.id) } : { article: publicArticle(article) });
  } catch (error) { return apiError(error); }
}
export async function PUT(request: Request, context: Context) {
  try {
    const params = await context.params;
    const user = await requireAdmin(request);
    const raw = await readJson(request);
    const updates = articleInput(raw, true);
    const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);
    if ((updates.categoryId && !categories.some(c => c.id === updates.categoryId)) || (updates.authorId && !authors.some(a => a.id === updates.authorId))) throw new ApiError(400, 'Select a valid category and author.');
    const article = await updateArticle(params.id, updates, user, raw.changeNote === undefined ? undefined : string(raw.changeNote, 'change note', 2000));
    if (!article) throw new ApiError(404, 'Article not found.');
    return json({ article });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    const params = await context.params;
    const user = await requireAdmin(request);
    if (!(await deleteArticle(params.id, user))) throw new ApiError(404, 'Article not found.');
    return json({ success: true });
  } catch (error) { return apiError(error); }
}
