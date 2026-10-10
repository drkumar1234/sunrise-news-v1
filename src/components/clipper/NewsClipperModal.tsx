'use client';

import React, { useState } from 'react';
import { safeUrl } from '@/lib/content-safety';
import { X } from 'lucide-react';
import { Article, Language } from '@/types';
import { DashedClipIcon } from './DashedClipIcon';
import { NewsClipResultModal, ClipData } from './NewsClipResultModal';
import { getSiteUrl } from '@/lib/site-url';

interface NewsClipperModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: Article;
  headline?: string;
  summary?: string;
  body?: string;
  featuredImage?: string;
  imageCaption?: string;
  categoryName?: string;
  authorName?: string;
  location?: string;
  lang?: Language;
}

export const NewsClipperModal: React.FC<NewsClipperModalProps> = ({
  isOpen,
  onClose,
  article,
  headline: propHeadline,
  summary: propSummary,
  body: propBody,
  featuredImage: propImage,
  imageCaption: propCaption,
  categoryName: propCat,
  authorName: propAuthor,
  location: propLocation,
  lang: propLang = 'en',
}) => {
  const isTelugu = propLang === 'te';

  // Derived content
  const headline = propHeadline || (isTelugu && article?.headlineTe ? article.headlineTe : article?.headline) || 'Sunrise News Report';
  const summary = propSummary || (isTelugu && article?.summaryTe ? article.summaryTe : article?.summary) || '';
  const body = propBody || (isTelugu && article?.bodyTe ? article.bodyTe : article?.body) || '';
  const featuredImage = propImage || article?.featuredImage;
  const imageCaption = propCaption || article?.imageCaption;
  const categoryName = propCat || (isTelugu ? 'ముఖ్య వార్తలు' : 'Top News');
  const authorName = propAuthor || 'Sunrise News Staff';
  const location = propLocation || (isTelugu && article?.locationTe ? article.locationTe : article?.location) || 'Amaravati';

  const [cropPreset, setCropPreset] = useState<'story' | 'headline' | 'photo'>('story');
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
  };

  const handleCreateClip = () => {
    setShowResult(true);
  };

  const clipData: ClipData = {
    headline,
    summary: cropPreset === 'photo' ? '' : summary,
    bodySnippet: cropPreset === 'story' ? body : '',
    featuredImage: cropPreset === 'headline' ? undefined : featuredImage,
    imageCaption,
    categoryName,
    authorName,
    location,
    dateStr: new Date().toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    url: typeof window !== 'undefined' ? window.location.href : getSiteUrl(),
    lang: propLang,
    preset: cropPreset === 'photo' ? 'photo' : cropPreset === 'headline' ? 'headline' : 'story',
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between overflow-hidden select-none animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-label="Create news clip"
      >
        {/* 1. TOP VIEWFINDER BAR */}
        <div className="bg-neutral-950/90 text-white px-4 py-3 border-b border-neutral-800 flex items-center justify-between z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-brand-orange font-bold text-sm">
              <DashedClipIcon className="w-5 h-5 text-brand-orange" />
              <span className="text-white font-extrabold tracking-wide">
                {isTelugu ? 'వార్తా క్లిప్పింగ్ టూల్' : 'News Clip Studio'}
              </span>
            </div>
            <span className="hidden md:inline text-neutral-600">|</span>
            <span className="hidden md:inline text-xs text-neutral-400">
              {isTelugu
                ? 'క్లిప్ రకాన్ని ఎంచుకుని క్రియేట్ క్లిప్ నొక్కండి.'
                : 'Choose a card format, then click Create Clip'}
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
            <button
              type="button"
              onClick={() => setCropPreset('story')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                cropPreset === 'story' ? 'bg-[#990000] text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isTelugu ? 'పూర్తి కథనం' : 'Story Card'}
            </button>
            <button
              type="button"
              onClick={() => setCropPreset('headline')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                cropPreset === 'headline' ? 'bg-[#990000] text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isTelugu ? 'హెడ్‌లైన్ & సారాంశం' : 'Headline Card'}
            </button>
            {featuredImage && (
              <button
                type="button"
                onClick={() => setCropPreset('photo')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  cropPreset === 'photo' ? 'bg-[#990000] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isTelugu ? 'ఫోటో క్లిప్' : 'Photo Clip'}
              </button>
            )}

          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-2"
            aria-label="Close clip studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. MAIN NEWSPAPER CROP CANVAS (Interactively cropped) */}
        <div className="flex-1 overflow-auto relative p-4 md:p-8 flex items-center justify-center bg-neutral-900/80">
          <div
            className="relative max-w-3xl w-full bg-[#FAF8F3] text-neutral-900 shadow-2xl rounded-sm p-6 md:p-10 border-4 border-neutral-800 overflow-hidden font-serif select-none"
            style={{ minHeight: '580px' }}
          >
            {/* Broadsheet Authentic Newsprint Background Layout */}
            <div className="opacity-95 pointer-events-none">
              {/* Top Broadsheet Masthead */}
              <div className="border-b-2 border-neutral-900 pb-2 mb-4 text-center">
                <div className="text-[10px] tracking-widest uppercase font-sans font-bold text-neutral-600 mb-1 flex items-center justify-between">
                  <span>Sunrise News</span>
                  <span>Andhra Pradesh • Telangana • National</span>
                  <span>Digital Story Card</span>
                </div>
                <div className="py-1 flex justify-center">
                  <img
                    src="/brand/sunrise-news-logo.jpg"
                    alt="SUNRISE NEWS TELUGU DAILY | సన్‌రైజ్ న్యూస్"
                    className="h-14 md:h-16 object-contain mx-auto"
                  />
                </div>
                <div className="border-t border-neutral-400 mt-2 pt-1 text-[11px] font-sans flex items-center justify-between text-neutral-700">
                  <span>{location} Bureau</span>
                  <span>{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
                  <span className="font-bold text-red-800 uppercase">{categoryName}</span>
                </div>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl md:text-3xl font-black text-neutral-950 leading-tight mb-3">
                {headline}
              </h2>

              {/* Author / Byline */}
              <div className="text-xs font-sans text-neutral-600 italic mb-4 pb-2 border-b border-neutral-300 flex items-center justify-between">
                <span>By <strong>{authorName}</strong></span>
                <span>Published Story</span>
              </div>

              {/* Lead Image (if present) */}
              {featuredImage && cropPreset !== 'headline' && (
                <div className="my-4 border border-neutral-400 p-1 bg-white">
                  <img
                    src={safeUrl(featuredImage, '/brand/sunrise-news-logo.jpg')}
                    alt={headline}
                    className="w-full h-56 md:h-72 object-cover grayscale contrast-125"
                  />
                  {imageCaption && (
                    <p className="text-[11px] font-sans text-neutral-600 italic mt-1 px-1">
                      {imageCaption}
                    </p>
                  )}
                </div>
              )}

              {/* Multi-column Body Text (Authentic Telugu & English Newspaper Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-neutral-800 leading-relaxed text-justify mt-3">
                <div>
                  <p className="font-bold mb-2 text-neutral-900 first-letter:text-4xl first-letter:font-black first-letter:mr-2 first-letter:float-left first-letter:text-red-900">
                    {cropPreset !== 'photo' ? summary : ''}
                  </p>
                  <p className="text-xs text-neutral-700 leading-normal">
                    {cropPreset === 'story' ? body.slice(0, 350).replace(/#{1,6}\s+/g, '') : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-700 leading-normal mb-3">
                    {cropPreset === 'story' ? body.slice(350, 750).replace(/#{1,6}\s+/g, '') : ''}
                  </p>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Clip actions */}
        <div className="bg-black text-white py-4 px-6 border-t border-neutral-900 flex items-center justify-center gap-4 shadow-2xl z-40">
          {/* Cancel Button (White button, dashed square icon, bold 'Cancel') */}
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-sm md:text-base flex items-center gap-2.5 transition-all shadow-md hover:shadow-lg active:scale-95"
            title="Cancel clip"
          >
            <DashedClipIcon className="w-4 h-4 text-slate-900" />
            <span>Cancel</span>
          </button>

          {/* Create Clip Button (Deep red button #990000, dashed square icon, bold 'Create Clip') */}
          <button
            type="button"
            onClick={handleCreateClip}
            className="px-6 py-2.5 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold text-sm md:text-base flex items-center gap-2.5 transition-all shadow-md hover:shadow-lg active:scale-95"
            title="Create and render news clip"
          >
            <DashedClipIcon className="w-4 h-4 text-white" />
            <span>Create Clip</span>
          </button>
        </div>
      </div>

      {/* 4. RESULT MODAL (Opens when 'Create Clip' is clicked) */}
      <NewsClipResultModal
        isOpen={showResult}
        onClose={() => {
          setShowResult(false);
          onClose();
        }}
        onRecrop={() => setShowResult(false)}
        clipData={clipData}
      />
    </>
  );
};
