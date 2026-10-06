import React from 'react';
import { Bookmark, Award } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/db';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export default function SpecialReportsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const { articles } = getArticles({ format: 'investigation', status: 'published' });
  const categories = getCategories();
  const authors = getAuthors();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>{isTelugu ? 'లోతైన పరిశోధన' : 'LONGFORM JOURNALISM'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'ప్రత్యేక కథనాలు (Special Reports)' : 'Special Reports & In-Depth Features'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'క్షేత్రస్థాయి అధ్యయనాలు, గణాంకాల పరిశీలన మరియు నిపుణుల సలహాలతో రూపొందించిన సమగ్ర ప్రత్యేక కథనాలు.'
            : 'Meticulously reported deep-dives covering policy shifts, ecological trends, and human stories.'}
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
