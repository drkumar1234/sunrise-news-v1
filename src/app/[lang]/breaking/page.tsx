import React from 'react';
import { AlertCircle, Radio } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function BreakingNewsFeedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  // Articles marked breaking or most recent urgent stories
  const { articles: all } = await getArticles({ status: 'published' });
  const breakingArticles = all.filter(a => a.isBreaking || a.isLeadStory).slice(0, 6);
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-brand-red text-white p-6 md:p-8 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2 bg-white/20 px-2.5 py-1 rounded w-fit">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{isTelugu ? 'ప్రత్యక్ష హెచ్చరికలు' : 'LIVE URGENT ALERTS'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            {isTelugu ? 'బ్రేకింగ్ న్యూస్ — తాజా పరిణామాలు' : 'Breaking News & Developing Stories'}
          </h1>
          <p className="text-red-100 text-sm mt-1">
            {isTelugu
              ? 'నిజనిర్ధారణ పూర్తయిన అత్యవసర వార్తా పరిణామాలు మాత్రమే ఇక్కడ ప్రచురించబడతాయి.'
              : 'Verified urgent reports and rapid developing dispatches from our reporters.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breakingArticles.map((art) => (
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
