import React from 'react';
import { safeUrl } from '@/lib/content-safety';
import Link from 'next/link';
import { PenTool, Quote } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function EditorialOpinionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [{ articles }, authors] = await Promise.all([
    getArticles({ format: 'opinion', status: 'published' }),
    getAuthors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <PenTool className="w-4 h-4" />
          <span>{isTelugu ? 'ఆలోచనా వేదిక' : 'PERSPECTIVES & ESSAYS'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సంపాదకీయం & నిపుణుల అభిప్రాయాలు' : 'Editorial & Opinion'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'రాజకీయ, ఆర్థిక, పర్యావరణ, సామాజిక పరిణామాలపై సంపాదకుల విశ్లేషణలు మరియు ప్రత్యేక వ్యాసాలు.'
            : 'Unvarnished analysis, thoughtful debate, and institutional viewpoints on the defining choices of our time.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => {
          const author = authors.find(a => a.id === art.authorId);
          const headline = isTelugu && art.headlineTe ? art.headlineTe : art.headline;
          const summary = isTelugu && art.summaryTe ? art.summaryTe : art.summary;

          return (
            <article
              key={art.id}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <Quote className="w-8 h-8 text-brand-orange/40 mb-3" />
                <Link href={`/${lang}/article/${encodeURIComponent(art.slug)}`}>
                  <h2 className="text-xl font-bold font-serif text-slate-900 hover:text-brand-orange transition-colors leading-snug">
                    "{headline}"
                  </h2>
                </Link>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {summary}
                </p>
              </div>

              {author && (
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
                  <img
                    src={safeUrl(author.avatar, '/brand/sunrise-news-logo.jpg')}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {isTelugu && author.nameTe ? author.nameTe : author.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isTelugu && author.roleTe ? author.roleTe : author.role}
                    </p>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
