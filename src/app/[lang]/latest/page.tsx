import React from 'react';
import Link from 'next/link';
import { Clock, Filter, ChevronRight } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function LatestNewsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [{ articles }, categories, authors] = await Promise.all([
    getArticles({ status: 'published' }),
    getCategories(),
    getAuthors(),
  ]);

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
