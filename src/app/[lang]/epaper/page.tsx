'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Download, Share2, Layers, BookOpen, MapPin, CheckCircle2, RotateCcw 
} from 'lucide-react';
import { DashedClipIcon } from '@/components/clipper/DashedClipIcon';
import { NewsClipperModal } from '@/components/clipper/NewsClipperModal';
import { Language } from '@/types';
import { getArticles } from '@/lib/db';

export default function EPaperPage({ params }: { params: { lang: string } }) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  // Editions
  const editions = [
    { id: 'amaravati', nameEn: 'Amaravati Main Edition', nameTe: 'అమరావతి ప్రధాన సంచిక' },
    { id: 'hyderabad', nameEn: 'Hyderabad Metro Edition', nameTe: 'హైదరాబాద్ మెట్రో సంచిక' },
    { id: 'visakhapatnam', nameEn: 'Visakhapatnam City Edition', nameTe: 'విశాఖపట్నం నగర సంచిక' },
    { id: 'national', nameEn: 'National Broadsheet Edition', nameTe: 'జాతీయ దినపత్రిక సంచిక' },
  ];

  const [selectedEdition, setSelectedEdition] = useState(editions[0].id);
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
  const { articles } = getArticles({ status: 'published' });
  const leadStory = articles[0];
  const secondaryStory1 = articles[1];
  const secondaryStory2 = articles[2];
  const regionalStory = articles[3];
  const factCheckStory = articles[4];

  // Trigger clip for a specific story or entire page
  const handleStartClip = (story?: typeof leadStory) => {
    if (story) {
      setActiveStoryForClip({
        headline: isTelugu && story.headlineTe ? story.headlineTe : story.headline,
        summary: isTelugu && story.summaryTe ? story.summaryTe : story.summary,
        body: isTelugu && story.bodyTe ? story.bodyTe : story.body,
        featuredImage: story.featuredImage,
        imageCaption: story.imageCaption,
        categoryName: isTelugu ? 'ప్రధాన వార్త' : 'Lead Story',
        authorName: 'Sunrise News Bureau',
        location: isTelugu && story.locationTe ? story.locationTe : story.location,
      });
    } else {
      setActiveStoryForClip({
        headline: isTelugu 
          ? 'అమరావతి నిర్మాణ పనుల్లో వేగం: కోర్ క్యాపిటల్ మౌలిక వసతుల టెండర్ల ఖరారు'
          : 'Amaravati Capital Works Gain Momentum as Core Infrastructure Tenders Finalized',
        summary: isTelugu
          ? 'ఆంధ్రప్రదేశ్ రాజధాని అమరావతిలో సచివాలయం, అసెంబ్లీ, హైకోర్టు అనుసంధాన ప్రధాన రహదారుల నిర్మాణానికి సీఆర్‌డీఏ తుది రూపునిచ్చింది.'
          : 'The Andhra Pradesh Capital Region Development Authority has approved engineering layouts for the government complex.',
        body: 'In a major milestone for Andhra Pradesh riverfront capital, Phase 2 infrastructure works have received technical clearances.',
        featuredImage: leadStory?.featuredImage,
        categoryName: 'AMARAVATI SPECIAL',
        authorName: 'K. Satyanarayana',
        location: 'Amaravati',
      });
    }
    setClipperOpen(true);
  };

  const todayFormatted = new Date().toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
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

            {/* Edition Switcher */}
            <select
              value={selectedEdition}
              onChange={(e) => setSelectedEdition(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-orange"
            >
              {editions.map((ed) => (
                <option key={ed.id} value={ed.id}>
                  {isTelugu ? ed.nameTe : ed.nameEn}
                </option>
              ))}
            </select>
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
                {isTelugu ? `పేజీ ${currentPage} / 4` : `Page ${currentPage} of 4`}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(4, currentPage + 1))}
                disabled={currentPage === 4}
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
              className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 border border-red-700"
              title={isTelugu ? 'వార్తలను క్రాప్ చేసి క్లిప్ తీయండి' : 'Crop & Create News Clip'}
            >
              <DashedClipIcon className="w-4 h-4 text-white" />
              <span>{isTelugu ? 'వార్త క్లిప్ తీయండి' : 'Crop News Clip'}</span>
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
              <span>{isTelugu ? 'ధర: ₹5.00' : 'Price: ₹5.00'}</span>
            </div>

            <div className="py-2.5 flex flex-col items-center justify-center">
              <img
                src="/brand/sunrise-news-logo.jpg"
                alt="SUNRISE NEWS TELUGU DAILY | సన్‌రైజ్ న్యూస్"
                className="h-16 md:h-24 object-contain mx-auto transition-transform hover:scale-105"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-sans font-semibold text-slate-700 border-t-2 border-slate-900 pt-1.5 mt-1">
              <span>{selectedEdition.toUpperCase()} EDITION</span>
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
                  <span>{isTelugu ? 'అమరావతి బ్యూరో — ప్రత్యేక ప్రతినిధి' : 'Amaravati Bureau — Special Correspondent'}</span>
                  <span>•</span>
                  <span>{todayFormatted}</span>
                </div>

                {leadStory?.featuredImage && (
                  <div className="my-3 border border-slate-300 p-1 bg-white">
                    <img
                      src={leadStory.featuredImage}
                      alt={leadStory.headline}
                      className="w-full aspect-[16/9] object-cover grayscale contrast-125"
                    />
                    <p className="text-[11px] font-sans text-slate-600 italic p-1 bg-slate-50">
                      {leadStory.imageCaption || 'Overview of regional capital construction works.'}
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
                      {leadStory?.body.slice(0, 320).replace(/#{1,6}\s+/g, '')}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-700 mb-2">
                      {leadStory?.body.slice(320, 750).replace(/#{1,6}\s+/g, '')}
                    </p>
                    <div className="border-l-2 border-slate-800 pl-2 text-[11px] font-serif italic text-slate-900 bg-slate-100 p-1.5 rounded-sm">
                      &ldquo;The priority is transparent execution and citizen trust across regional governance.&rdquo;
                    </div>
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
                      {isTelugu ? 'నిజనిర్ధారణ డెస్క్' : 'FACT CHECK'}
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
                    : 'Crop any newspaper section and share formatted image to WhatsApp.'}
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
            <span>Published on behalf of Sharon Media Publications. Press Council of India standards.</span>
            <span>https://sunrisenews.in • Official Digital E-Paper</span>
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
