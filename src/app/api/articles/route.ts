import { getArticles, createArticle, getCategories, getAuthors } from '@/lib/db';
import { requireAdmin, getSession, json, apiError, ApiError } from '@/lib/auth';
import { articleInput, readJson, STATUSES } from '@/lib/validation';
import { publicArticle } from '@/lib/public-articles';
import type { Article, ArticleStatus } from '@/types';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const status = params.get('status') || 'published';
    if (status !== 'all' && !STATUSES.includes(status as ArticleStatus)) throw new ApiError(400, 'Invalid article status.');
    const user = await getSession(request);
    if (status !== 'published' && !user) throw new ApiError(401, 'Please sign in to the newsroom.');
    const limit = Math.max(1, Math.min(Number(params.get('limit')) || (user ? 500 : 60), user ? 500 : 100));
    const offset = Math.max(0, Math.min(Number(params.get('offset')) || 0, 100000));
    const result = await getArticles({ status: status as ArticleStatus | 'all', categorySlug: params.get('category') || undefined, tagSlug: params.get('tag') || undefined, authorId: params.get('author') || undefined, format: params.get('format') || undefined, search: (params.get('q') || '').slice(0, 200), limit, offset });
    return json({ articles: user ? result.articles : result.articles.map(publicArticle), total: result.total });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    const user = await requireAdmin(request);
    const { autoSlug, ...input } = articleInput(await readJson(request));
    const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);
    if (!categories.some(c => c.id === input.categoryId) || !authors.some(a => a.id === input.authorId)) throw new ApiError(400, 'Select a valid category and author.');
    const article = await createArticle(input as Omit<Article, 'id' | 'publishedAt' | 'updatedAt' | 'readingTimeMinutes'>, user, { autoSlug });
    return json({ article }, 201);
  } catch (error) { return apiError(error); }
}
