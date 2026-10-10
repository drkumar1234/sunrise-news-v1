import 'server-only';
import type { Article } from '@/types';
import { getArticles as readArticles, getArticleBySlug as readArticleBySlug } from './db';
import type { GetArticlesOptions } from './db';

export { getCategories, getCategoryBySlug, getAuthors, getAuthorBySlug, getActiveAd, getSettings } from './db';

/** Remove newsroom-only fields before data enters a public response or client component. */
export function publicArticle(article: Article): Article {
  const { internalNotes, reviewerId, ...publicFields } = article;
  return publicFields;
}

export async function getArticles(options: GetArticlesOptions = {}) {
  const result = await readArticles({ ...options, status: 'published' });
  return { ...result, articles: result.articles.filter(article => article.status === 'published').map(publicArticle) };
}

export async function getArticleBySlug(slug: string) {
  const article = await readArticleBySlug(slug);
  return article?.status === 'published' ? publicArticle(article) : undefined;
}
