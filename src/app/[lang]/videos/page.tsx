import React from 'react';
import { safeUrl } from '@/lib/content-safety';
import { Play, Video, Clock } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function VideosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const { articles } = await getArticles({ status: 'published' });
  // Include video format articles and lead video
  const videoArticles = articles.filter(a => a.format === 'video' || a.tags.includes('amaravati') || a.tags.includes('visakhapatnam'));
  const featuredVideo = videoArticles[0];
  const otherVideos = videoArticles.slice(1);
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Video className="w-4 h-4" />
          <span>{isTelugu ? 'వీడియో జర్నలిజం' : 'AUDIO-VISUAL BROADCASTS'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ వీడియో న్యూస్' : 'Sunrise Video Bulletins & Ground Reports'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'క్షేత్రస్థాయి ప్రత్యక్ష నివేదికలు, నిపుణుల ఇంటర్వ్యూలు మరియు తాజా వార్తా వీడియో బులెటిన్లు.'
            : 'Watch our field correspondents report live from key news centers across Andhra Pradesh and Telangana.'}
        </p>
      </div>

      {/* Featured Video Player Embed */}
      {featuredVideo && (
        <div className="bg-slate-950 text-white rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 aspect-video rounded-xl overflow-hidden bg-black shadow-lg relative group">
              <img
                src={safeUrl(featuredVideo.featuredImage, '/brand/sunrise-news-logo.jpg')}
                alt={featuredVideo.headline}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <a
                  href={`/${lang}/article/${encodeURIComponent(featuredVideo.slug)}`}
                  className="w-16 h-16 rounded-full bg-brand-orange hover:bg-brand-orange-dark text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110"
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-3">
              <span className="px-3 py-1 rounded bg-brand-orange text-white text-xs font-bold uppercase tracking-wider inline-block">
                {isTelugu ? 'ప్రత్యేక వీడియో ఫీచర్' : 'FEATURED VIDEO'}
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                {isTelugu && featuredVideo.headlineTe ? featuredVideo.headlineTe : featuredVideo.headline}
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                {isTelugu && featuredVideo.summaryTe ? featuredVideo.summaryTe : featuredVideo.summary}
              </p>
              <div className="pt-2 text-xs text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(featuredVideo.publishedAt).toLocaleDateString()}</span>
                </span>
                <span>•</span>
                <span>{featuredVideo.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Videos Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-6">
          {isTelugu ? 'ఇతర వీడియో కథనాలు' : 'More Video Bulletins'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherVideos.map((art) => (
            <NewsCard
              key={art.id}
              article={art}
              category={categories.find(c => c.id === art.categoryId)}
              author={authors.find(a => a.id === art.authorId)}
              lang={lang}
              variant="media"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
