import React from 'react';
import { Star, Shield } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function TopStoriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [{ articles }, categories, authors] = await Promise.all([
    getArticles({ isEditorPick: true, status: 'published' }),
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Star className="w-4 h-4 fill-current" />
          <span>{isTelugu ? 'ఎడిటర్స్ ఛాయిస్' : 'EDITORIAL CURATION'}</span>
        </div>
        <h1 className="text-3xl font-black text-brand-navy">
          {isTelugu ? 'టాప్ స్టోరీస్ (Top Stories)' : 'Top Stories of the Day'}
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          {isTelugu
            ? 'ప్రజా ప్రయోజనాలకు అత్యంత ప్రాధాన్యమిస్తూ మా సంపాదక బృందం ఎంపిక చేసిన ప్రధాన వార్తలు.'
            : 'Carefully curated journalism that defines today’s public discourse.'}
        </p>
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
