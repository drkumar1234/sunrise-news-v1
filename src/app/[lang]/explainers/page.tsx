import React from 'react';
import { HelpCircle, BookOpen } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ExplainersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const { articles } = await getArticles({ status: 'published' });
  // Curated explainers like Amaravati, Polavaram, Economy
  const explainers = articles.filter(a => a.tags.includes('amaravati') || a.tags.includes('polavaram') || a.tags.includes('agriculture'));
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>{isTelugu ? 'వివరణాత్మక జర్నలిజం' : 'CONTEXT & EXPLAINERS'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'విశ్లేషణలు & వివరణలు (Explainers)' : 'Understanding the Issue: News Explainers'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'సంక్లిష్టమైన ప్రభుత్వ విధానాలు, ఆర్థిక చట్టాలు, నదీ జలాల ఒప్పందాలను సులభశైలిలో అర్థం చేసుకునే వివరణాత్మక కథనాలు.'
            : 'Deconstructing complex policy debates, legislative bills, and economic mechanisms into clear, lucid insights.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {explainers.map((art) => (
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
