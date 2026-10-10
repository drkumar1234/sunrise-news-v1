import React from 'react';
import Link from 'next/link';
import { Radio, Clock } from 'lucide-react';
import { getArticles } from '@/lib/public-articles';

export const dynamic = 'force-dynamic';

export default async function LiveUpdatesPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';
  const { articles } = await getArticles({ format: 'live', limit: 50 });
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-brand-navy-dark text-white p-8 rounded-2xl shadow-xl border-b-4 border-brand-red">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-3"><Radio className="w-4 h-4" />{isTelugu ? 'తాజా పరిణామాలు' : 'News Updates'}</div>
        <h1 className="text-3xl md:text-4xl font-black">{isTelugu ? 'ప్రత్యక్ష వార్తా పరిణామాలు' : 'Live Dispatches'}</h1>
        <p className="text-slate-300 text-sm mt-2">{isTelugu ? 'మా సంపాదక విభాగం ప్రచురించిన తాజా సమాచారం.' : 'Updates published by the editorial desk. Refresh this page for the latest dispatches.'}</p>
      </div>
      {articles.length === 0 ? <p className="p-6 bg-slate-50 rounded-xl border text-slate-600">{isTelugu ? 'ప్రస్తుతం ప్రత్యక్ష వార్తా కథనాలు లేవు.' : 'No live dispatches are currently published.'}</p> : (
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
          {articles.map(article => (
            <div key={article.id} className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm space-y-2">
              <span className="flex gap-2 items-center text-xs text-slate-500"><Clock className="w-4 h-4" />{new Date(article.updatedAt).toLocaleString(isTelugu ? 'te-IN' : 'en-IN', { timeZone: 'Asia/Kolkata' })}</span>
              <Link href={`/${lang}/article/${encodeURIComponent(article.slug)}`} className="text-lg font-bold text-slate-950 hover:text-brand-orange">{isTelugu && article.headlineTe ? article.headlineTe : article.headline}</Link>
              <p className="text-sm text-slate-700">{isTelugu && article.summaryTe ? article.summaryTe : article.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
