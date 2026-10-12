import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { getAuthors, getArticles } from '@/lib/public-articles';
import { AuthorAvatar } from '@/components/article/AuthorAvatar';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AuthorsDirectoryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [authors, { articles }] = await Promise.all([
    getAuthors(),
    getArticles({ status: 'published' }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>{isTelugu ? 'పాత్రికేయ బృందం' : 'EDITORIAL DIRECTORY'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'రిపోర్టర్లు మరియు సంపాదకులు' : 'Authors, Reporters & Editors'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'సన్‌రైజ్ న్యూస్ రచయితలు మరియు వారి ప్రచురిత కథనాలను చూడండి.'
            : 'Meet the Sunrise News contributors and explore their published articles.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => {
          const authorName = isTelugu && author.nameTe ? author.nameTe : author.name;
          const authorRole = (isTelugu && author.roleTe ? author.roleTe : author.role).trim();
          const authorBio = (isTelugu && author.bioTe ? author.bioTe : author.bioEn).trim();
          const reportingBeats = author.reportingBeats.filter(beat => beat.trim());
          const articleCount = articles.filter(a => a.authorId === author.id).length;

          return (
            <div
              key={author.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <AuthorAvatar
                    author={author}
                    lang={lang}
                    className="w-16 h-16 border-2 border-brand-orange"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-lg font-bold text-slate-950">{authorName}</h2>
                      {author.verified && (
                        <ShieldCheck className="w-4 h-4 text-brand-orange" />
                      )}
                    </div>
                    {authorRole && <p className="text-xs text-brand-orange font-semibold">{authorRole}</p>}
                  </div>
                </div>

                {authorBio && (
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {authorBio}
                  </p>
                )}

                <div className="text-xs text-slate-400 space-y-1">
                  {reportingBeats.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-600">{isTelugu ? 'బీట్స్: ' : 'Beats: '}</span>
                      <span>{reportingBeats.join(', ')}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-slate-600">{isTelugu ? 'ప్రచురిత కథనాలు: ' : 'Articles: '}</span>
                    <strong className="text-slate-900">{articleCount}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {author.twitter?.trim() && (
                    <span className="text-xs text-slate-500">{author.twitter}</span>
                  )}
                </div>
                <Link
                  href={`/${lang}/authors/${encodeURIComponent(author.slug)}`}
                  className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                >
                  <span>{isTelugu ? 'కథనాలు చూడండి' : 'View Articles'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
