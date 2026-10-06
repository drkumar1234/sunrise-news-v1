import React from 'react';
import { notFound } from 'next/navigation';
import { 
  getArticleBySlug, getCategories, getAuthors, 
  getArticles, getActiveAd 
} from '@/lib/db';
import { Language } from '@/types';
import { ArticleViewClient } from '@/components/article/ArticleViewClient';

export default function ArticlePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  let decodedSlug = params.slug;
  try {
    decodedSlug = decodeURIComponent(params.slug);
  } catch {}

  const article = getArticleBySlug(decodedSlug) || getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const categories = getCategories();
  const authors = getAuthors();
  const category = categories.find(c => c.id === article.categoryId);
  const author = authors.find(a => a.id === article.authorId);
  const sidebarAd = getActiveAd('sidebar');
  const midArticleAd = getActiveAd('mid_content');

  // Related articles from same category or tags
  const { articles: relatedCandidates } = getArticles({
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
    />
  );
}
