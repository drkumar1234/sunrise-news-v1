import React from 'react';
import { SearchCheck, FileText } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function InvestigationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [{ articles }, categories, authors] = await Promise.all([
    getArticles({ format: 'investigation', status: 'published' }),
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg border-l-8 border-brand-orange">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
          <SearchCheck className="w-5 h-5" />
          <span>{isTelugu ? 'జవాబుదారీ జర్నలిజం' : 'ACCOUNTABILITY & INVESTIGATIVE DESK'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          {isTelugu ? 'పరిశోధనాత్మక కథనాలు (Investigations)' : 'Investigations & Exposés'}
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl">
          {isTelugu
            ? 'ప్రజా సంపద పరిరక్షణ, పర్యావరణ పరిరక్షణ మరియు పాలనా పారదర్శకత లక్ష్యంగా సన్‌రైజ్ న్యూస్ దర్యాప్తు కథనాలు.'
            : 'Fearless, evidence-based reporting holding public institutions, corporations, and power centers accountable.'}
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
