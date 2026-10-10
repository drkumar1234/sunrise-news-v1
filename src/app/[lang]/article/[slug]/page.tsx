import React from 'react';
import { notFound } from 'next/navigation';
import { 
  getArticleBySlug, getCategories, getAuthors, 
  getArticles, getActiveAd 
} from '@/lib/public-articles';
import { Language } from '@/types';
import { ArticleViewClient } from '@/components/article/ArticleViewClient';
import { getSiteUrl } from '@/lib/site-url';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  let decodedSlug = resolvedParams.slug;
  try {
    decodedSlug = decodeURIComponent(resolvedParams.slug);
  } catch {}

  const article = await getArticleBySlug(decodedSlug) || await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);
  const category = categories.find(c => c.id === article.categoryId);
  const author = authors.find(a => a.id === article.authorId);
  const [sidebarAd, midArticleAd] = await Promise.all([
    getActiveAd('sidebar'),
    getActiveAd('mid_content'),
  ]);

  // Related articles from same category or tags
  const { articles: relatedCandidates } = await getArticles({
    categoryId: article.categoryId,
    status: 'published',
  });
  const relatedArticles = relatedCandidates
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  return (
    <ArticleViewClient
      article={article}
      category={category}
      author={author}
      relatedArticles={relatedArticles}
      sidebarAd={sidebarAd}
      midArticleAd={midArticleAd}
      lang={lang}
      siteUrl={getSiteUrl()}
    />
  );
}
