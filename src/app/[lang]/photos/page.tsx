import React from 'react';
import { safeUrl } from '@/lib/content-safety';
import Link from 'next/link';
import { Camera, Eye, MapPin } from 'lucide-react';
import { getArticles, getCategories } from '@/lib/public-articles';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function PhotosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const { articles } = await getArticles({ status: 'published' });
  const photoArticles = articles.filter(a => a.format === 'photo' || a.galleryImages);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Camera className="w-4 h-4" />
          <span>{isTelugu ? 'దృశ్యరూప కథనాలు' : 'PHOTO ESSAYS'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ ఫోటో గ్యాలరీ' : 'Photo Stories & Visual Journalism'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'చిత్రాల ద్వారా తెలుగు సంస్కృతి, జీవన విధానం, కళాకారులు మరియు గ్రామీణ నేపథ్యాల దృశ్యరూపం.'
            : 'Evocative photo essays documenting cultural traditions, craftsmanship, and ecological landscapes.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photoArticles.map((art) => {
          const headline = isTelugu && art.headlineTe ? art.headlineTe : art.headline;
          const summary = isTelugu && art.summaryTe ? art.summaryTe : art.summary;

          return (
            <div
              key={art.id}
              className="group bg-slate-900 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={safeUrl(art.featuredImage, '/brand/sunrise-news-logo.jpg')}
                  alt={headline}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm text-xs font-bold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-brand-orange" />
                  <span>{art.galleryImages?.length || 4} {isTelugu ? 'చిత్రాలు' : 'Photos'}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-brand-orange flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{art.location}</span>
                  </span>
                  <Link href={`/${lang}/article/${encodeURIComponent(art.slug)}`}>
                    <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {headline}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Photo: {art.imageCredit}</span>
                  <Link
                    href={`/${lang}/article/${encodeURIComponent(art.slug)}`}
                    className="text-brand-orange font-semibold hover:underline"
                  >
                    {isTelugu ? 'గ్యాలరీ చూడండి' : 'Open Gallery'}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
