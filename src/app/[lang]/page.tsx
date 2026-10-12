import React from 'react';
import { safeUrl } from '@/lib/content-safety';
import Link from 'next/link';
import { 
  TrendingUp, Clock, ChevronRight, ShieldCheck, 
  Play, Camera, Sparkles, Flame, Bookmark, ArrowRight 
} from 'lucide-react';
import { 
  getArticles, getCategories, getAuthors, 
  getActiveAd, getSettings 
} from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { AuthorAvatar } from '@/components/article/AuthorAvatar';
import { AdBanner } from '@/components/ui/AdBanner';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  // Fetch categorized articles
  const [{ articles: allPublished }, categories, authors, leaderboardAd, sidebarAd, midContentAd] = await Promise.all([
    getArticles({ status: 'published' }),
    getCategories(),
    getAuthors(),
    getActiveAd('leaderboard'),
    getActiveAd('sidebar'),
    getActiveAd('mid_content'),
  ]);

  // Lead story
  const leadStory = allPublished.find(a => a.isLeadStory) || allPublished[0];
  const secondaryStories = allPublished.filter(a => a.id !== leadStory?.id).slice(0, 4);

  // Regional news
  const apArticles = allPublished.filter(a => a.tags.includes('andhra-pradesh') || a.categoryId === 'cat-ap').slice(0, 4);
  const tgArticles = allPublished.filter(a => a.tags.includes('telangana') || a.categoryId === 'cat-tg').slice(0, 4);

  // Formats
  const factCheckArticles = allPublished.filter(a => a.format === 'fact-check').slice(0, 3);
  const multimediaArticles = allPublished.filter(a => a.format === 'video' || a.format === 'photo').slice(0, 4);
  const opinionArticles = allPublished.filter(a => a.format === 'opinion' || a.categoryId === 'cat-editorial').slice(0, 3);
  const trendingArticles = allPublished.filter(a => a.isTrending).slice(0, 5);

  const getAuthor = (id: string) => authors.find(a => a.id === id);
  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* 1. TOP LEADERBOARD AD */}
      {leaderboardAd && (
        <AdBanner ad={leaderboardAd} slotKey="leaderboard" lang={lang} />
      )}

      {/* 2. HERO LEAD STORY GRID (2/3 Lead + 1/3 Curated Stack) */}
      <section aria-label="Lead Stories" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Big Lead Story */}
        <div className="lg:col-span-8">
          {leadStory && (
            <NewsCard
              article={leadStory}
              category={getCategory(leadStory.categoryId)}
              author={getAuthor(leadStory.authorId)}
              lang={lang}
              variant="hero"
              priority={true}
            />
          )}
        </div>

        {/* Right 4 cols: Top Stories Stack */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-navy flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-brand-orange" />
              <span>{isTelugu ? 'టాప్ స్టోరీస్' : 'Top Stories'}</span>
            </h2>
            <Link
              href={`/${lang}/top-stories`}
              className="text-xs font-semibold text-brand-orange hover:underline flex items-center"
            >
              <span>{isTelugu ? 'మరిన్ని' : 'View All'}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-200/80">
            {secondaryStories.map((story) => (
              <NewsCard
                key={story.id}
                article={story}
                category={getCategory(story.categoryId)}
                author={getAuthor(story.authorId)}
                lang={lang}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. ANDHRA PRADESH REGIONAL SPOTLIGHT */}
      <section aria-label="Andhra Pradesh News" className="border-t-2 border-brand-navy pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
              {isTelugu ? 'ప్రాంతీయ సమాచారం' : 'Regional Journalism'}
            </span>
            <h2 className="text-2xl font-black text-brand-navy">
              {isTelugu ? 'ఆంధ్రప్రదేశ్ ప్రత్యేకం (Amaravati & Vizag)' : 'Andhra Pradesh Spotlight'}
            </h2>
          </div>
          <Link
            href={`/${lang}/category/andhra-pradesh`}
            className="text-xs font-bold text-brand-navy hover:text-brand-orange transition-colors flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-300 hover:border-brand-orange"
          >
            <span>{isTelugu ? 'పూర్తి ఏపీ వార్తలు' : 'Explore AP'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {apArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              category={getCategory(article.categoryId)}
              author={getAuthor(article.authorId)}
              lang={lang}
              variant="grid"
            />
          ))}
        </div>
      </section>

      {/* 4. MID-PAGE PROMO / AD */}
      {midContentAd && (
        <AdBanner ad={midContentAd} slotKey="mid_content" lang={lang} />
      )}

      {/* 5. TELANGANA & HYDERABAD + TRENDING SIDEBAR */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 cols: Telangana & Technology */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
                {isTelugu ? 'ఐటీ & రాజధాని వార్తలు' : 'Capital & Innovation'}
              </span>
              <h2 className="text-2xl font-black text-brand-navy">
                {isTelugu ? 'తెలంగాణ & హైదరాబాద్ పరిణామాలు' : 'Telangana & Hyderabad Hub'}
              </h2>
            </div>
            <Link
              href={`/${lang}/category/telangana`}
              className="text-xs font-bold text-slate-600 hover:text-brand-orange flex items-center gap-1"
            >
              <span>{isTelugu ? 'మరిన్ని' : 'View Section'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {tgArticles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                category={getCategory(article.categoryId)}
                author={getAuthor(article.authorId)}
                lang={lang}
                variant="horizontal"
              />
            ))}
          </div>
        </div>

        {/* Right 4 cols: Trending Ranking & Sidebar Ad */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base tracking-wide">
                {isTelugu ? 'పాఠకులు ఎక్కువగా చదివినవి' : 'Trending Now'}
              </h3>
            </div>

            <ol className="space-y-4">
              {trendingArticles.map((art, index) => (
                <li key={art.id} className="flex items-start gap-3 group">
                  <span className="text-2xl font-black text-slate-600 group-hover:text-brand-orange transition-colors">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <Link
                      href={`/${lang}/article/${encodeURIComponent(art.slug || art.id)}`}
                      className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug"
                    >
                      {isTelugu && art.headlineTe ? art.headlineTe : art.headline}
                    </Link>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {art.location} • {art.readingTimeMinutes} min read
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {sidebarAd && (
            <AdBanner ad={sidebarAd} slotKey="sidebar" lang={lang} />
          )}
        </div>
      </section>

      {/* 6. FACT CHECK SPOTLIGHT */}
      <section className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{isTelugu ? 'నిజనిర్ధారణ డెస్క్' : 'SUNRISE FACT-CHECK UNIT'}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {isTelugu ? 'సోషల్ మీడియా వైరల్ ప్రచారాలు — నిజాలేమిటి?' : 'Combating Digital Misinformation'}
            </h2>
          </div>
          <Link
            href={`/${lang}/fact-checks`}
            className="px-4 py-2 rounded-lg bg-brand-red text-white text-xs font-bold hover:bg-brand-red-dark transition-colors shadow-sm whitespace-nowrap"
          >
            {isTelugu ? 'అన్ని ఫ్యాక్ట్ చెక్‌లు చూడండి' : 'Browse All Fact Checks'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {factCheckArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              category={getCategory(article.categoryId)}
              author={getAuthor(article.authorId)}
              lang={lang}
              variant="grid"
            />
          ))}
        </div>
      </section>

      {/* 7. MULTIMEDIA HUB (Videos & Photo Stories) */}
      <section className="bg-slate-950 text-white rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-orange flex items-center justify-center text-white">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider block">
                {isTelugu ? 'దృశ్య శ్రవణ మాధ్యమం' : 'Visual Storytelling'}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white">
                {isTelugu ? 'వీడియోలు & ఫోటో స్టోరీలు' : 'Videos & Photo Stories'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${lang}/videos`}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500"
            >
              {isTelugu ? 'వీడియోలు' : 'Videos'}
            </Link>
            <Link
              href={`/${lang}/photos`}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500"
            >
              {isTelugu ? 'ఫోటోలు' : 'Photos'}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {multimediaArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              category={getCategory(article.categoryId)}
              author={getAuthor(article.authorId)}
              lang={lang}
              variant="media"
            />
          ))}
        </div>
      </section>

      {/* 8. EDITORIAL & OPINION COLUMNS */}
      <section className="border-t border-slate-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
              {isTelugu ? 'విశ్లేషణ & ఆలోచన' : 'Ideas & Perspectives'}
            </span>
            <h2 className="text-2xl font-black text-brand-navy">
              {isTelugu ? 'సంపాదకీయం & నిపుణుల వ్యాసాలు' : 'Editorial & Opinion'}
            </h2>
          </div>
          <Link
            href={`/${lang}/editorial-opinion`}
            className="text-xs font-bold text-brand-navy hover:text-brand-orange flex items-center gap-1"
          >
            <span>{isTelugu ? 'అన్ని వ్యాసాలు' : 'All Opinions'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opinionArticles.map((article) => {
            const author = getAuthor(article.authorId);
            return (
              <div
                key={article.id}
                className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between hover:bg-slate-100 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-2 block">
                    {isTelugu ? 'సంపాదకీయ వ్యాసం' : 'OPINION COLUMN'}
                  </span>
                  <Link href={`/${lang}/article/${encodeURIComponent(article.slug || article.id)}`}>
                    <h3 className="font-serif font-bold text-lg text-slate-900 hover:text-brand-orange transition-colors leading-snug">
                      "{isTelugu && article.headlineTe ? article.headlineTe : article.headline}"
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                    {isTelugu && article.summaryTe ? article.summaryTe : article.summary}
                  </p>
                </div>

                {author && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
                    <AuthorAvatar
                      author={author}
                      lang={lang}
                      className="w-10 h-10 border border-slate-300"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {isTelugu && author.nameTe ? author.nameTe : author.name}
                      </h4>
                      {(isTelugu && author.roleTe ? author.roleTe : author.role).trim() && (
                        <p className="text-[10px] text-slate-500">
                          {isTelugu && author.roleTe ? author.roleTe : author.role}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
