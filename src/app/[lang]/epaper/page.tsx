'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { safeUrl } from '@/lib/content-safety';
import Link from 'next/link';
import { 
  Calendar, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Download, Share2, Layers, BookOpen, MapPin, CheckCircle2, RotateCcw 
} from 'lucide-react';
import { DashedClipIcon } from '@/components/clipper/DashedClipIcon';
import { NewsClipperModal } from '@/components/clipper/NewsClipperModal';
import { Article, Language } from '@/types';
import { getSiteUrl } from '@/lib/site-url';
import { DailyEpaperArchive } from '@/components/epaper/DailyEpaperArchive';

export default function EPaperPage() {
  const params = useParams<{ lang: string }>();
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  // News Clipper state
  const [clipperOpen, setClipperOpen] = useState(false);
  const [activeStoryForClip, setActiveStoryForClip] = useState<{
    headline: string;
    summary: string;
    body: string;
    featuredImage?: string;
    imageCaption?: string;
    categoryName: string;
    authorName: string;
    location: string;
  } | null>(null);

  // Fetch articles to populate newspaper columns
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteUrl, setSiteUrl] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setSiteUrl(getSiteUrl());
    fetch('/api/articles?limit=100', { signal: controller.signal, cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('Unable to load articles');
        return response.json();
      })
      .then(data => setArticles(data.articles || []))
      .catch(err => { if (err.name !== 'AbortError') setLoadError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  const pageCount = Math.max(1, Math.ceil(articles.length / 4));
  const currentArticles = articles.slice((currentPage - 1) * 4, currentPage * 4);
  const leadStory = currentArticles[0];
  const secondaryStory1 = currentArticles[1];
  const secondaryStory2 = currentArticles[2];
  const factCheckStory = currentArticles[3];
  const leadBody = isTelugu && leadStory?.bodyTe ? leadStory.bodyTe : leadStory?.body || '';

  // Create a clipping only from a published story shown on this page.
  const handleStartClip = (story: Article | undefined = leadStory) => {
    if (!story) return;
    setActiveStoryForClip({
      headline: isTelugu && story.headlineTe ? story.headlineTe : story.headline,
      summary: isTelugu && story.summaryTe ? story.summaryTe : story.summary,
      body: isTelugu && story.bodyTe ? story.bodyTe : story.body,
      featuredImage: story.featuredImage,
      imageCaption: story.imageCaption,
      categoryName: isTelugu ? 'వార్త' : 'News',
      authorName: 'Sunrise News',
      location: isTelugu && story.locationTe ? story.locationTe : story.location,
    });
    setClipperOpen(true);
  };

  const todayFormatted = new Date().toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <DailyEpaperArchive lang={lang} />
      {loadError && <p role="alert" className="p-4 bg-red-950 text-white">{isTelugu ? 'వార్తలు లోడ్ కాలేదు. మళ్లీ ప్రయత్నించండి.' : 'Articles could not be loaded. Please refresh to try again.'}</p>}
      {loading && <p role="status" className="p-4">{isTelugu ? 'వార్తలు లోడ్ అవుతున్నాయి...' : 'Loading published stories...'}</p>}
      {!loading && !loadError && articles.length === 0 && <p className="p-4">{isTelugu ? 'ప్రచురిత వార్తలు ఇంకా లేవు.' : 'No published stories are available yet.'}</p>}
      {/* 1. TOP EPAPER CONTROL TOOLBAR */}
      <div className="sticky top-0 z-30 bg-slate-950 border-b border-slate-800 px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Edition Selector */}
          <div className="flex items-center gap-3">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-brand-orange flex items-center justify-center font-bold text-white text-base">
                ☀
              </span>
              <div>
                <span className="font-extrabold text-white text-sm tracking-tight block">
                  SUNRISE E-PAPER
                </span>
                <span className="text-[10px] text-brand-orange font-semibold block">
                  {isTelugu ? 'సన్‌రైజ్ డిజిటల్ ఈ-పేపర్' : 'Digital Broadsheet'}
                </span>
              </div>
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <span className="text-xs text-slate-300">{isTelugu ? 'తాజా ప్రచురిత వార్తలు' : 'Latest Published Stories'}</span>
          </div>

          {/* Date & Page Navigation */}
          <div className="flex items-center gap-2 text-xs">
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 mr-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-brand-orange" />
              <span>{todayFormatted}</span>
            </div>

            {/* Page Navigator */}
            <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-40 transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-xs text-white">
                {isTelugu ? `పేజీ ${currentPage} / ${pageCount}` : `Page ${currentPage} of ${pageCount}`}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage >= pageCount}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-40 transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Zoom & CROP THE NEWS CLIP BUTTON */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-800 text-slate-300">
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
                className="p-1 rounded hover:bg-slate-800"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-semibold px-1">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(130, zoomLevel + 15))}
                className="p-1 rounded hover:bg-slate-800"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* PRIMARY CROP NEWS CLIP ACTION BUTTON */}
            <button
              type="button"
              onClick={() => handleStartClip(leadStory)}
              disabled={!leadStory}
              className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 border border-red-700"
              title={isTelugu ? 'వార్తలను క్రాప్ చేసి క్లిప్ తీయండి' : 'Create News Clip'}
            >
              <DashedClipIcon className="w-4 h-4 text-white" />
              <span>{isTelugu ? 'వార్త క్లిప్ తీయండి' : 'Create News Clip'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN EPAPER BROADSHEET VIEWPORT */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-slate-950/90">
        <div
          className="bg-[#FBF9F4] text-slate-950 shadow-2xl rounded-sm border-4 border-slate-900 transition-transform duration-200 font-serif"
          style={{
            width: `${Math.round(920 * (zoomLevel / 100))}px`,
            maxWidth: '100%',
          }}
        >
          {/* Broadsheet Newspaper Header Banner */}
          <div className="border-b-4 border-double border-slate-900 p-4 md:p-6 pb-3 text-center bg-[#FAF7EE]">
            <div className="flex items-center justify-between text-[11px] font-sans font-bold text-slate-700 uppercase tracking-widest pb-1 border-b border-slate-300">
              <span>{isTelugu ? 'తెలుగు రాష్ట్రాల నంబర్ 1 దినపత్రిక' : 'AP & Telangana Premier Broadsheet'}</span>
              <span>{todayFormatted}</span>
              <span>{isTelugu ? 'ఉచిత డిజిటల్ పఠనం' : 'Free Digital Reading'}</span>
            </div>

            <div className="py-2.5 flex flex-col items-center justify-center">
              <img
                src="/brand/sunrise-news-logo.jpg"
                alt="SUNRISE NEWS TELUGU DAILY | సన్‌రైజ్ న్యూస్"
                className="h-16 md:h-24 object-contain mx-auto transition-transform hover:scale-105"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-sans font-semibold text-slate-700 border-t-2 border-slate-900 pt-1.5 mt-1">
              <span>{isTelugu ? 'తాజా వార్తలు' : 'LATEST STORIES'}</span>
              <span className="text-red-800 uppercase font-black tracking-wider">
                {isTelugu ? 'రైతు, అభివృద్ధి, పాలన ప్రత్యేక వార్తలు' : 'DEVELOPMENT & DEMOCRACY SPECIAL'}
              </span>
              <span>{isTelugu ? `పేజీ ${currentPage}` : `PAGE ${currentPage}`}</span>
            </div>
          </div>

          {/* Broadsheet Columns Layout */}
          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FCFBF7]">
            {/* Main Lead Story Column (8 Cols) */}
            <div className="md:col-span-8 border-b md:border-b-0 md:border-r border-slate-300 pr-0 md:pr-6 pb-6 md:pb-0">
              {/* Story 1: Lead Headline */}
              <div className="group relative">
                {/* Floating Quick Clip Trigger */}
                <button
                  type="button"
                  onClick={() => handleStartClip(leadStory)}
              disabled={!leadStory}
                  className="absolute top-0 right-0 bg-[#990000] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow flex items-center gap-1.5 hover:bg-red-800 transition-all opacity-90 group-hover:opacity-100"
                  title="Crop this story"
                >
                  <DashedClipIcon className="w-3.5 h-3.5 text-white" />
                  <span>{isTelugu ? 'క్లిప్ తీయండి' : 'Clip'}</span>
                </button>

                <span className="text-[11px] font-sans font-black text-red-700 uppercase tracking-wider block mb-1">
                  {isTelugu ? 'ప్రధాన శీర్షిక' : 'LEAD STORY'}
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-slate-950 leading-tight mb-2 pr-16 font-serif">
                  {isTelugu && leadStory?.headlineTe ? leadStory.headlineTe : leadStory?.headline}
                </h2>
                <div className="text-xs font-sans text-slate-600 italic mb-3 flex items-center gap-2">
                  <span>{isTelugu && leadStory?.locationTe ? leadStory.locationTe : leadStory?.location}</span>
                  <span>•</span>
                  <span>{todayFormatted}</span>
                </div>

                {leadStory?.featuredImage && (
                  <div className="my-3 border border-slate-300 p-1 bg-white">
                    <img
                      src={safeUrl(leadStory.featuredImage, '/brand/sunrise-news-logo.jpg')}
                      alt={leadStory.headline}
                      className="w-full aspect-[16/9] object-cover grayscale contrast-125"
                    />
                    <p className="text-[11px] font-sans text-slate-600 italic p-1 bg-slate-50">
                      {leadStory.imageCaption}
                    </p>
                  </div>
                )}

                {/* Body in 2 Newspaper Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-slate-800 leading-relaxed text-justify mt-3 font-sans">
                  <div>
                    <p className="font-bold text-slate-950 mb-2 first-letter:text-3xl first-letter:font-black first-letter:float-left first-letter:mr-2">
                      {isTelugu && leadStory?.summaryTe ? leadStory.summaryTe : leadStory?.summary}
                    </p>
                    <p className="text-slate-700">
                      {leadBody.slice(0, 320).replace(/#{1,6}\s+/g, '')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-700 mb-2">
                      {leadBody.slice(320, 750).replace(/#{1,6}\s+/g, '')}
                    </p>

                  </div>
                </div>
              </div>

              {/* Sub-Story Below Lead */}
              {secondaryStory1 && (
                <div className="mt-6 pt-6 border-t-2 border-slate-300 group relative">
                  <button
                    type="button"
                    onClick={() => handleStartClip(secondaryStory1)}
                    className="absolute top-6 right-0 bg-[#990000] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 hover:bg-red-800 transition-all opacity-80 group-hover:opacity-100"
                    title="Crop this story"
                  >
                    <DashedClipIcon className="w-3 h-3 text-white" />
                    <span>{isTelugu ? 'క్లిప్' : 'Clip'}</span>
                  </button>

                  <h3 className="text-lg md:text-xl font-bold text-slate-950 mb-1 pr-14 font-serif">
                    {isTelugu && secondaryStory1.headlineTe ? secondaryStory1.headlineTe : secondaryStory1.headline}
                  </h3>
                  <p className="text-xs text-slate-700 font-sans leading-relaxed line-clamp-3">
                    {isTelugu && secondaryStory1.summaryTe ? secondaryStory1.summaryTe : secondaryStory1.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Column (4 Cols) */}
            <div className="md:col-span-4 flex flex-col justify-between">
              <div>
                {/* Secondary Story 2 */}
                {secondaryStory2 && (
                  <div className="pb-4 mb-4 border-b border-slate-300 group relative">
                    <button
                      type="button"
                      onClick={() => handleStartClip(secondaryStory2)}
                      className="absolute top-0 right-0 bg-[#990000] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 hover:bg-red-800 transition-all opacity-80 group-hover:opacity-100"
                      title="Crop this story"
                    >
                      <DashedClipIcon className="w-3 h-3 text-white" />
                      <span>{isTelugu ? 'క్లిప్' : 'Clip'}</span>
                    </button>

                    <span className="text-[10px] font-sans font-bold text-brand-orange uppercase block mb-1">
                      {isTelugu ? 'ప్రత్యేక కథనం' : 'SPECIAL REPORT'}
                    </span>
                    <h3 className="text-base font-bold text-slate-950 mb-1 pr-12 font-serif">
                      {isTelugu && secondaryStory2.headlineTe ? secondaryStory2.headlineTe : secondaryStory2.headline}
                    </h3>
                    {secondaryStory2.featuredImage && (
                      <img
                        src={secondaryStory2.featuredImage}
                        alt="Photo"
                        className="w-full h-32 object-cover my-2 grayscale border border-slate-300"
                      />
                    )}
                    <p className="text-xs text-slate-700 font-sans line-clamp-3">
                      {isTelugu && secondaryStory2.summaryTe ? secondaryStory2.summaryTe : secondaryStory2.summary}
                    </p>
                  </div>
                )}

                {/* Fact Check / Regional Column */}
                {factCheckStory && (
                  <div className="pb-4 mb-4 border-b border-slate-300 bg-amber-50/60 p-3 rounded border border-amber-200 group relative">
                    <button
                      type="button"
                      onClick={() => handleStartClip(factCheckStory)}
                      className="absolute top-2 right-2 bg-[#990000] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 hover:bg-red-800 transition-all opacity-80 group-hover:opacity-100"
                      title="Crop this fact check"
                    >
                      <DashedClipIcon className="w-3 h-3 text-white" />
                      <span>{isTelugu ? 'క్లిప్' : 'Clip'}</span>
                    </button>

                    <span className="text-[10px] font-sans font-black text-red-700 uppercase block mb-1">
                      {factCheckStory.format === 'fact-check' ? (isTelugu ? 'నిజనిర్ధారణ' : 'FACT CHECK') : (isTelugu ? 'మరిన్ని వార్తలు' : 'MORE NEWS')}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mb-1 font-serif pr-12">
                      {isTelugu && factCheckStory.headlineTe ? factCheckStory.headlineTe : factCheckStory.headline}
                    </h4>
                    <p className="text-xs text-slate-700 font-sans line-clamp-3">
                      {isTelugu && factCheckStory.summaryTe ? factCheckStory.summaryTe : factCheckStory.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Call to Action for E-Paper Clipping */}
              <div className="bg-[#0B192C] text-white p-4 rounded-lg text-center mt-4">
                <DashedClipIcon className="w-6 h-6 text-brand-orange mx-auto mb-2" />
                <h4 className="font-bold text-sm text-white font-sans">
                  {isTelugu ? 'వార్త క్లిప్ తీయండి' : 'Create Custom News Clip'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  {isTelugu
                    ? 'ఏదైనా వార్తపై క్లిక్ చేసి లేదా క్రాప్ బటన్ నొక్కి వాట్సాప్ మరియు సోషల్ మీడియాలో షేర్ చేయండి.'
                    : 'Create a formatted image of a published story to download or share.'}
                </p>
                <button
                  type="button"
                  onClick={() => handleStartClip()}
                  className="mt-3 w-full py-2 bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs rounded-md shadow flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <DashedClipIcon className="w-3.5 h-3.5" />
                  <span>{isTelugu ? 'ఇప్పుడే క్లిప్ చేయండి' : 'Launch Clipper'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Broadsheet Footer */}
          <div className="border-t-2 border-slate-900 p-3 bg-[#FAF7EE] text-[11px] font-sans text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Sunrise News — Published stories in a newspaper layout.</span>
            <span>{siteUrl} • Digital Reading Edition</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE NEWS CLIPPER MODAL */}
      {clipperOpen && (
        <NewsClipperModal
          isOpen={clipperOpen}
          onClose={() => setClipperOpen(false)}
          headline={activeStoryForClip?.headline}
          summary={activeStoryForClip?.summary}
          body={activeStoryForClip?.body}
          featuredImage={activeStoryForClip?.featuredImage}
          imageCaption={activeStoryForClip?.imageCaption}
          categoryName={activeStoryForClip?.categoryName}
          authorName={activeStoryForClip?.authorName}
          location={activeStoryForClip?.location}
          lang={lang}
        />
      )}
    </div>
  );
}
