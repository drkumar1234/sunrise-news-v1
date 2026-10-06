import React from 'react';
import Link from 'next/link';
import { TrendingUp, Flame, Eye } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/db';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export default function TrendingPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const { articles } = getArticles({ isTrending: true, status: 'published' });
  const categories = getCategories();
  const authors = getAuthors();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-brand-navy to-slate-900 text-white p-8 rounded-2xl shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 fill-current" />
            <span>{isTelugu ? 'ట్రెండింగ్' : 'READER METRICS'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            {isTelugu ? 'ట్రెండింగ్ న్యూస్ — పాఠకులు ఎక్కువగా ఆసక్తి చూపినవి' : 'Trending Stories'}
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            {isTelugu
              ? 'గడచిన 24 గంటల్లో ప్రజలు విస్తృతంగా చదివిన మరియు పంచుకున్న ముఖ్యమైన కథనాలు.'
              : 'Stories generating active engagement, reading depth, and public discussion.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <div key={art.id} className="relative">
            <div className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-brand-orange text-white font-black text-xs flex items-center justify-center shadow-lg">
              #{idx + 1}
            </div>
            <NewsCard
              article={art}
              category={categories.find(c => c.id === art.categoryId)}
              author={authors.find(a => a.id === art.authorId)}
              lang={lang}
              variant="grid"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
