import { getArticles } from '@/lib/db';
import { json, apiError } from '@/lib/auth';
import { publicArticle } from '@/lib/public-articles';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const result = await getArticles({ status: 'published', search: (params.get('q') || '').slice(0, 200), categorySlug: params.get('category') || undefined, tagSlug: params.get('tag') || undefined, authorId: params.get('author') || undefined, limit: 100 });
    return json({ articles: result.articles.map(publicArticle), total: result.total });
  } catch (error) { return apiError(error); }
}
