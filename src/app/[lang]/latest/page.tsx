import React from 'react';
import Link from 'next/link';
import { Clock, Filter, ChevronRight } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/db';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export default function LatestNewsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const { articles } = getArticles({ status: 'published' });
  const categories = getCategories();
  const authors = getAuthors();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b-2 border-brand-navy pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
            {isTelugu ? 'నిరంతర వార్తా ప్రవాహం' : 'Real-time News Feed'}
          </span>
          <h1 className="text-3xl font-black text-brand-navy">
            {isTelugu ? 'తాజా వార్తలు (Latest News)' : 'Latest News & Updates'}
          </h1>
        </div>
        <span className="text-xs text-slate-500 font-semibold">
          {isTelugu ? 'కథనాల సంఖ్య: ' : 'Total: '} {articles.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <NewsCard
            key={art.id}
            article={art}
            category={categories.find(c => c.id === art.categoryId)}
            author={authors.find(a => a.id === art.authorId)}
            lang={lang}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
}
