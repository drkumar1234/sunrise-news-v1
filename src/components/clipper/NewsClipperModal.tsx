'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Sparkles, Sliders, Move, 
  Layers, Check, Eye, Maximize2 
} from 'lucide-react';
import { Article, Language } from '@/types';
import { DashedClipIcon } from './DashedClipIcon';
import { NewsClipResultModal, ClipData } from './NewsClipResultModal';

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

  // Crop Preset mode: 'custom' | 'story' | 'headline' | 'photo'
  const [cropPreset, setCropPreset] = useState<'custom' | 'story' | 'headline' | 'photo'>('story');

  // Interactive crop box coordinates (percentage 0-100)
  const [cropBox, setCropBox] = useState<{ top: number; left: number; width: number; height: number }>({
    top: 15,
    left: 10,
    width: 80,
    height: 70,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialBox, setInitialBox] = useState(cropBox);

  // Result modal state
  const [showResult, setShowResult] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync preset changes with crop box coordinates
  useEffect(() => {
    if (cropPreset === 'headline') {
      setCropBox({ top: 8, left: 8, width: 84, height: 35 });
    } else if (cropPreset === 'photo') {
      setCropBox({ top: 22, left: 10, width: 80, height: 50 });
    } else if (cropPreset === 'story') {
      setCropBox({ top: 5, left: 5, width: 90, height: 90 });
    }
  }, [cropPreset]);

  // Dragging handlers
  const handleMouseDownBox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialBox(cropBox);
  };

  const handleMouseDownHandle = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setIsResizing(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialBox(cropBox);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    if (isDragging) {
      const deltaXPercent = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStart.y) / rect.height) * 100;

      const newLeft = Math.max(0, Math.min(100 - initialBox.width, initialBox.left + deltaXPercent));
      const newTop = Math.max(0, Math.min(100 - initialBox.height, initialBox.top + deltaYPercent));

      setCropBox(prev => ({
        ...prev,
        left: newLeft,
        top: newTop,
      }));
    } else if (isResizing) {
      const deltaXPercent = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStart.y) / rect.height) * 100;

      let { top, left, width, height } = initialBox;

      if (isResizing.includes('s')) {
        height = Math.max(15, Math.min(100 - top, initialBox.height + deltaYPercent));
      }
      if (isResizing.includes('e')) {
        width = Math.max(20, Math.min(100 - left, initialBox.width + deltaXPercent));
      }
      if (isResizing.includes('n')) {
        const potentialTop = Math.max(0, initialBox.top + deltaYPercent);
        const actualDelta = potentialTop - initialBox.top;
        if (initialBox.height - actualDelta >= 15) {
          top = potentialTop;
          height = initialBox.height - actualDelta;
        }
      }
      if (isResizing.includes('w')) {
        const potentialLeft = Math.max(0, initialBox.left + deltaXPercent);
        const actualDelta = potentialLeft - initialBox.left;
        if (initialBox.width - actualDelta >= 20) {
          left = potentialLeft;
          width = initialBox.width - actualDelta;
        }
      }

      setCropBox({ top, left, width, height });
    }
  }, [isDragging, isResizing, dragStart, initialBox]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  const handleCancel = () => {
    onClose();
  };

  const handleCreateClip = () => {
    setShowResult(true);
  };

  const clipData: ClipData = {
    headline,
    summary,
    bodySnippet: body,
    featuredImage,
    imageCaption,
    categoryName,
    authorName,
    location,
    dateStr: new Date().toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    url: typeof window !== 'undefined' ? window.location.href : 'https://sunrisenews.in',
    lang: propLang,
    preset: cropPreset === 'photo' ? 'photo' : cropPreset === 'headline' ? 'headline' : 'story',
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between overflow-hidden select-none animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-label="Crop news clip"
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
                ? 'మీరు క్లిప్ చేయాలనుకుంటున్న భాగాన్ని ఎంచుకోండి లేదా రీసైజ్ చేయండి.' 
                : 'Select crop frame area, then click Create Clip'}
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
              {isTelugu ? 'పూర్తి కథనం' : 'Full Story'}
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
            <button
              type="button"
              onClick={() => setCropPreset('custom')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                cropPreset === 'custom' ? 'bg-[#990000] text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isTelugu ? 'కస్టమ్ సైజ్' : 'Custom Drag'}
            </button>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ml-2"
            aria-label="Close cropper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. MAIN NEWSPAPER CROP CANVAS (Interactively cropped) */}
        <div className="flex-1 overflow-auto relative p-4 md:p-8 flex items-center justify-center bg-neutral-900/80">
          <div 
            ref={containerRef}
            className="relative max-w-3xl w-full bg-[#FAF8F3] text-neutral-900 shadow-2xl rounded-sm p-6 md:p-10 border-4 border-neutral-800 overflow-hidden font-serif select-none"
            style={{ minHeight: '580px' }}
          >
            {/* Broadsheet Authentic Newsprint Background Layout */}
            <div className="opacity-95 pointer-events-none">
              {/* Top Broadsheet Masthead */}
              <div className="border-b-2 border-neutral-900 pb-2 mb-4 text-center">
                <div className="text-[10px] tracking-widest uppercase font-sans font-bold text-neutral-600 mb-1 flex items-center justify-between">
                  <span>Vol. 14 • Issue 289</span>
                  <span>Andhra Pradesh • Telangana • National</span>
                  <span>Price: ₹5.00</span>
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
                <span>By Special Correspondent: <strong>{authorName}</strong></span>
                <span>Verified Desk Report</span>
              </div>

              {/* Lead Image (if present) */}
              {featuredImage && (
                <div className="my-4 border border-neutral-400 p-1 bg-white">
                  <img
                    src={featuredImage}
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
                    {summary}
                  </p>
                  <p className="text-xs text-neutral-700 leading-normal">
                    {body.slice(0, 350).replace(/#{1,6}\s+/g, '')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-700 leading-normal mb-3">
                    {body.slice(350, 750).replace(/#{1,6}\s+/g, '') ||
                      'Officials highlighted the strategic importance of sustained infrastructural oversight and transparent administrative governance across all regional districts.'}
                  </p>
                  <div className="p-2 border-l-2 border-neutral-800 bg-neutral-200/50 text-[11px] italic font-sans">
                    &ldquo;This step marks an imperative transformation towards accountable public reporting and ground verification.&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* DARK DIMMING OVERLAY WITH ACTIVE CROP BOX */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Semi-transparent dark curtain outside the crop box */}
              <div
                className="absolute inset-0 bg-neutral-950/50 transition-all pointer-events-none"
                style={{
                  clipPath: `polygon(
                    0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
                    ${cropBox.left}% ${cropBox.top}%,
                    ${cropBox.left + cropBox.width}% ${cropBox.top}%,
                    ${cropBox.left + cropBox.width}% ${cropBox.top + cropBox.height}%,
                    ${cropBox.left}% ${cropBox.top + cropBox.height}%,
                    ${cropBox.left}% ${cropBox.top}%
                  )`,
                }}
              />
            </div>

            {/* THE INTERACTIVE MOVABLE / RESIZABLE CROP VIEWFINDER BOX */}
            <div
              className="absolute pointer-events-auto cursor-move z-10 transition-shadow"
              style={{
                top: `${cropBox.top}%`,
                left: `${cropBox.left}%`,
                width: `${cropBox.width}%`,
                height: `${cropBox.height}%`,
              }}
              onMouseDown={handleMouseDownBox}
            >
              {/* Crop box border: Distinctive dashed red / white outline */}
              <div className="w-full h-full border-2 border-dashed border-red-600 bg-red-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative">
                {/* Center Move Indicator */}
                <div className="absolute top-2 left-2 bg-black/75 text-white px-2 py-0.5 rounded text-[10px] font-sans font-bold flex items-center gap-1.5 shadow">
                  <DashedClipIcon className="w-3.5 h-3.5 text-red-500" />
                  <span>{isTelugu ? 'ఎంచుకున్న క్లిప్' : 'Selected Clip Area'}</span>
                </div>

                {/* 8 Resize Handles (Corners and Edges) */}
                {/* Top-Left */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'nw')}
                  className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-red-700 rounded-sm cursor-nwse-resize shadow-md"
                />
                {/* Top-Right */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'ne')}
                  className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-red-700 rounded-sm cursor-nesw-resize shadow-md"
                />
                {/* Bottom-Right */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'se')}
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-red-700 rounded-sm cursor-nwse-resize shadow-md"
                />
                {/* Bottom-Left */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'sw')}
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-red-700 rounded-sm cursor-nesw-resize shadow-md"
                />
                {/* Top Center */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'n')}
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-red-700 rounded-sm cursor-ns-resize"
                />
                {/* Bottom Center */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 's')}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-2 bg-white border border-red-700 rounded-sm cursor-ns-resize"
                />
                {/* Left Center */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'w')}
                  className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-4 bg-white border border-red-700 rounded-sm cursor-ew-resize"
                />
                {/* Right Center */}
                <div
                  onMouseDown={(e) => handleMouseDownHandle(e, 'e')}
                  className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-4 bg-white border border-red-700 rounded-sm cursor-ew-resize"
                />

                {/* Crosshair grid lines for rule of thirds */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                  <div className="border-r border-b border-red-300" />
                  <div className="border-r border-b border-red-300" />
                  <div className="border-b border-red-300" />
                  <div className="border-r border-b border-red-300" />
                  <div className="border-r border-b border-red-300" />
                  <div className="border-b border-red-300" />
                  <div className="border-r border-red-300" />
                  <div className="border-r border-red-300" />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. THE BOTTOM CONTROL BAR — EXACT MATCH TO USER'S SCREENSHOT! */}
        <div className="bg-black text-white py-4 px-6 border-t border-neutral-900 flex items-center justify-center gap-4 shadow-2xl z-40">
          {/* Cancel Button (White button, dashed square icon, bold 'Cancel') */}
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-sm md:text-base flex items-center gap-2.5 transition-all shadow-md hover:shadow-lg active:scale-95"
            title="Cancel cropping"
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
