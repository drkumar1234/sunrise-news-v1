'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Play, Camera, ShieldCheck, MapPin, Eye } from 'lucide-react';
import { Article, Category, Author, Language } from '@/types';
import { DashedClipIcon } from '@/components/clipper/DashedClipIcon';
import { NewsClipperModal } from '@/components/clipper/NewsClipperModal';

interface NewsCardProps {
  article: Article;
  category?: Category;
  author?: Author;
  lang: Language;
  variant?: 'hero' | 'horizontal' | 'grid' | 'compact' | 'media';
  showSummary?: boolean;
  priority?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  category,
  author,
  lang,
  variant = 'grid',
  showSummary = true,
}) => {
  const [clipperOpen, setClipperOpen] = useState(false);
  const isTelugu = lang === 'te';
  const headline = isTelugu && article.headlineTe ? article.headlineTe : article.headline;
  const summary = isTelugu && article.summaryTe ? article.summaryTe : article.summary;
  const location = isTelugu && article.locationTe ? article.locationTe : article.location;
  const catName = category ? (isTelugu ? category.nameTe : category.nameEn) : 'News';
  const authorName = author ? (isTelugu && author.nameTe ? author.nameTe : author.name) : 'Staff Reporter';

  // Article URL
  const articleUrl = `/${lang}/article/${encodeURIComponent(article.slug || article.id)}`;

  // Time format
  const formattedTime = new Date(article.publishedAt).toLocaleDateString(
    isTelugu ? 'te-IN' : 'en-IN',
    { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  // 1. HERO LEAD STORY
  if (variant === 'hero') {
    return (
      <article className="group relative rounded-xl overflow-hidden bg-slate-900 text-white shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
          <img
            src={article.featuredImage}
            alt={headline}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          {/* Subtle multi-stop gradient for readable text */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded bg-brand-orange text-white text-xs font-bold uppercase tracking-wider">
              {catName}
            </span>
            {article.isLeadStory && (
              <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                {isTelugu ? 'ప్రధాన వార్త' : 'LEAD STORY'}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              <span>{location}</span>
            </span>
          </div>

          <Link href={articleUrl}>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight hover:text-amber-300 transition-colors">
              {headline}
            </h2>
          </Link>

          {showSummary && summary && (
            <p className="text-slate-300 text-sm md:text-base line-clamp-2 mt-2 max-w-4xl">
              {summary}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            {author && (
              <span className="font-semibold text-slate-200">{authorName}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedTime}</span>
            </span>
            <span>•</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </article>
    );
  }

  // 2. HORIZONTAL CARD
  if (variant === 'horizontal') {
    return (
      <article className="group flex flex-col sm:flex-row gap-4 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
        <Link href={articleUrl} className="sm:w-1/3 flex-shrink-0 relative overflow-hidden rounded-md aspect-[16/10]">
          <img
            src={article.featuredImage}
            alt={headline}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {article.format === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center shadow">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          )}
        </Link>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">
                {catName}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">{location}</span>
            </div>

            <Link href={articleUrl}>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors leading-snug line-clamp-2">
                {headline}
              </h3>
            </Link>

            {showSummary && summary && (
              <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                {summary}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
            <span>{formattedTime}</span>
            <span>•</span>
            <span>{article.readingTimeMinutes} min</span>
          </div>
        </div>
      </article>
    );
  }

  // 3. COMPACT CARD (List / Sidebar)
  if (variant === 'compact') {
    return (
      <article className="group py-2.5 border-b border-slate-100 last:border-b-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">
            {catName}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[10px] text-slate-400">{location}</span>
        </div>
        <Link href={articleUrl}>
          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-brand-orange transition-colors leading-snug line-clamp-2">
            {headline}
          </h4>
        </Link>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
          <Clock className="w-3 h-3" />
          <span>{formattedTime}</span>
        </div>
      </article>
    );
  }

  // 4. MEDIA CARD (Video / Photos)
  if (variant === 'media') {
    return (
      <article className="group relative rounded-lg overflow-hidden bg-slate-900 text-white shadow hover:shadow-lg transition-all">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={article.featuredImage}
            alt={headline}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            {article.format === 'video' ? (
              <div className="w-12 h-12 rounded-full bg-brand-orange/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center shadow">
                <Camera className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        <div className="p-3.5">
          <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">
            {article.format === 'video' ? (isTelugu ? 'వీడియో న్యూస్' : 'VIDEO') : (isTelugu ? 'ఫోటో స్టోరీ' : 'PHOTO STORY')}
          </span>
          <Link href={articleUrl}>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mt-1 leading-snug">
              {headline}
            </h3>
          </Link>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>{location}</span>
            <span>{formattedTime}</span>
          </div>
        </div>
      </article>
    );
  }

  // 5. STANDARD GRID CARD (Default)
  return (
    <article className="group flex flex-col bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <Link href={articleUrl} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={article.featuredImage}
          alt={headline}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-brand-navy/90 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {catName}
          </span>
          {article.format === 'fact-check' && (
            <span className="px-2 py-0.5 rounded bg-brand-red text-white text-[10px] font-bold flex items-center gap-1 shadow">
              <ShieldCheck className="w-3 h-3" />
              <span>{isTelugu ? 'నిజనిర్ధారణ' : 'FACT CHECK'}</span>
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
            <span>{location}</span>
          </div>

          <Link href={articleUrl}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors leading-snug line-clamp-2">
              {headline}
            </h3>
          </Link>

          {showSummary && summary && (
            <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
              {summary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedTime}</span>
          </span>
          <div className="flex items-center gap-3">
            <span>{article.readingTimeMinutes} min</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setClipperOpen(true);
              }}
              className="text-slate-500 hover:text-[#990000] p-1 rounded hover:bg-red-50 flex items-center gap-1 transition-colors font-medium text-[11px]"
              title={isTelugu ? 'వార్తను క్లిప్ చేయండి' : 'Clip News Story'}
            >
              <DashedClipIcon className="w-3.5 h-3.5" />
              <span>{isTelugu ? 'క్లిప్' : 'Clip'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive News Clipper Modal */}
      <NewsClipperModal
        isOpen={clipperOpen}
        onClose={() => setClipperOpen(false)}
        headline={headline}
        summary={summary}
        body={article.body}
        featuredImage={article.featuredImage}
        imageCaption={article.imageCaption}
        categoryName={catName}
        authorName={authorName}
        location={location}
        lang={lang}
      />
    </article>
  );
};
