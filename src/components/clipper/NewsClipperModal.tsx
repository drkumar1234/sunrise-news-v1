'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { safeUrl } from '@/lib/content-safety';
import { cropPixels, FULL_CROP, type CropRect } from '@/lib/clip-crop';
import { getSiteUrl } from '@/lib/site-url';
import { Article, Language } from '@/types';
import { CropSelection } from './CropSelection';
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
  publishedAt?: string;
  lang?: Language;
}

export const NewsClipperModal: React.FC<NewsClipperModalProps> = ({
  isOpen, onClose, article, headline: propHeadline, summary: propSummary, body: propBody,
  featuredImage: propImage, imageCaption: propCaption, categoryName: propCat,
  authorName: propAuthor, location: propLocation, publishedAt, lang = 'en',
}) => {
  const isTelugu = lang === 'te';
  const headline = propHeadline || (isTelugu && article?.headlineTe ? article.headlineTe : article?.headline) || 'Sunrise News Report';
  const summary = propSummary || (isTelugu && article?.summaryTe ? article.summaryTe : article?.summary) || '';
  const body = propBody || (isTelugu && article?.bodyTe ? article.bodyTe : article?.body) || '';
  const featuredImage = propImage || article?.featuredImage;
  const imageCaption = propCaption || article?.imageCaption;
  const categoryName = propCat || (isTelugu ? 'ముఖ్య వార్తలు' : 'Top News');
  const authorName = propAuthor || 'Sunrise News Staff';
  const location = propLocation || (isTelugu && article?.locationTe ? article.locationTe : article?.location) || 'Amaravati';
  const publicationDate = new Date(publishedAt || article?.publishedAt || Date.now());
  const dateStr = (Number.isNaN(publicationDate.getTime()) ? new Date() : publicationDate).toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const [preset, setPreset] = useState<'story' | 'headline' | 'photo'>('story');
  const [crop, setCrop] = useState<CropRect>({ ...FULL_CROP });
  const [drawing, setDrawing] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [clipImage, setClipImage] = useState('');
  const headerRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);
  const generation = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setCrop({ ...FULL_CROP }); setPreset('story'); setDrawing(false); setScrolling(false); setClipImage(''); setError(''); setCreating(false); busy.current = false;
    }
    return () => { generation.current++; };
  }, [isOpen, headline]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (clipImage) setClipImage('');
        else onClose();
      }
    };
    document.addEventListener('keydown', escape);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', escape); };
  }, [isOpen, onClose, clipImage]);

  if (!isOpen) return null;

  const choosePreset = (next: typeof preset) => { setPreset(next); setCrop({ ...FULL_CROP }); setDrawing(false); setScrolling(false); setError(''); };
  const clipData: ClipData = {
    headline, summary, url: article?.slug ? `${getSiteUrl()}/${lang}/article/${encodeURIComponent(article.slug)}` : window.location.href,
    lang,
  };

  const createClip = async () => {
    if (busy.current || !newsRef.current || !headerRef.current) return;
    busy.current = true; setCreating(true); setError('');
    const version = ++generation.current;
    try {
      await document.fonts.ready;
      const { toCanvas, getFontEmbedCSS } = await import('html-to-image');
      const fontEmbedCSS = await getFontEmbedCSS(newsRef.current);
      // Keep memory bounded for long stories; use actual canvas pixels when cropping.
      const pixelRatio = Math.min(2, Math.sqrt(12000000 / (newsRef.current.offsetWidth * newsRef.current.offsetHeight)));
      const options = { pixelRatio, fontEmbedCSS, backgroundColor: '#FAF8F3', includeQueryParams: true };
      const [paper, masthead] = await Promise.all([toCanvas(newsRef.current, options), toCanvas(headerRef.current, options)]);
      if (version !== generation.current) return;
      const selected = cropPixels(crop, paper.width, paper.height);
      const output = document.createElement('canvas');
      output.width = Math.max(600, selected.width);
      const headerHeight = Math.round(masthead.height * output.width / masthead.width);
      output.height = headerHeight + selected.height;
      const context = output.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.fillStyle = '#FAF8F3'; context.fillRect(0, 0, output.width, output.height);
      // Branding is separate from the story and always survives a custom crop.
      context.drawImage(masthead, 0, 0, output.width, headerHeight);
      context.drawImage(paper, selected.x, selected.y, selected.width, selected.height, Math.floor((output.width - selected.width) / 2), headerHeight, selected.width, selected.height);
      setClipImage(output.toDataURL('image/png'));
    } catch {
      if (version === generation.current) setError(isTelugu ? 'క్లిప్ తయారు కాలేదు. చిత్రం లోడ్ అయ్యాక మళ్ళీ ప్రయత్నించండి లేదా హెడ్‌లైన్ క్లిప్ ఎంచుకోండి.' : 'Could not create the clip. Let the photo finish loading and retry, or choose Headline Card.');
    } finally {
      if (version === generation.current) { busy.current = false; setCreating(false); }
    }
  };

  return <>
    <div role="dialog" aria-modal="true" aria-label="Create news clip" inert={!!clipImage} aria-hidden={!!clipImage} className="fixed inset-0 z-50 bg-black/95 flex flex-col overflow-hidden select-none">
      <div className="bg-neutral-950 text-white px-4 py-3 border-b border-neutral-800 flex flex-wrap items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 font-bold mr-auto"><DashedClipIcon className="w-5 h-5 text-brand-orange" />{isTelugu ? 'వార్తా క్లిప్పింగ్ టూల్' : 'News Clip Studio'}</div>
        <div className="flex flex-wrap gap-1 bg-neutral-900 p-1 rounded-lg">
          {(['story', 'headline', ...(featuredImage ? ['photo'] : [])] as (typeof preset)[]).map(value => <button key={value} type="button" disabled={creating} onClick={() => choosePreset(value)} aria-pressed={preset === value} className={`px-3 py-1.5 rounded text-xs font-bold ${preset === value ? 'bg-[#990000] text-white' : 'text-neutral-300 hover:bg-neutral-800'}`}>{value === 'story' ? (isTelugu ? 'పూర్తి కథనం' : 'Story Card') : value === 'headline' ? (isTelugu ? 'హెడ్‌లైన్ & సారాంశం' : 'Headline Card') : (isTelugu ? 'ఫోటో క్లిప్' : 'Photo Clip')}</button>)}
        </div>
        <button type="button" onClick={onClose} aria-label="Close clip studio" className="p-2 rounded hover:bg-neutral-800"><X className="w-5 h-5" /></button>
      </div>
      <div className="bg-neutral-900 px-4 py-2 text-white flex flex-wrap items-center justify-center gap-3 text-xs shrink-0">
        <span>{isTelugu ? 'బాక్స్‌ను జరపండి. అంచులను లాగి పరిమాణం మార్చండి.' : 'Move the box or drag its edges to crop. Arrow keys fine-tune a focused box or handle.'}</span>
        <button type="button" disabled={creating} aria-pressed={drawing} onClick={() => { setDrawing(!drawing); setScrolling(false); }} className={`border px-3 py-1.5 rounded ${drawing ? 'bg-red-800 border-red-400' : 'border-neutral-600'}`}>{isTelugu ? 'కొత్త క్రాప్ గీయండి' : 'Draw new crop'}</button>
        <button type="button" disabled={creating} aria-pressed={scrolling} onClick={() => { setScrolling(!scrolling); setDrawing(false); }} className={`border px-3 py-1.5 rounded ${scrolling ? 'bg-blue-800 border-blue-400' : 'border-neutral-600'}`}>{scrolling ? (isTelugu ? 'క్రాప్ చేయండి' : 'Resume cropping') : (isTelugu ? 'వార్తను స్క్రోల్ చేయండి' : 'Scroll mode')}</button>
        <button type="button" disabled={creating} onClick={() => { setCrop({ ...FULL_CROP }); setDrawing(false); setScrolling(false); }} className="border border-neutral-600 px-3 py-1.5 rounded">{isTelugu ? 'మొత్తం వార్త' : 'Full item'}</button>
        <span role="status" aria-label="Crop dimensions">{Math.round(crop.width)}% × {Math.round(crop.height)}%</span>
      </div>
      {error && <p role="alert" className="bg-red-100 text-red-800 p-3 text-center">{error}</p>}
      <div className={`flex-1 min-h-0 overflow-auto p-4 md:p-8 bg-neutral-900 ${creating ? 'pointer-events-none' : ''}`}>
        <div className="max-w-3xl mx-auto bg-[#FAF8F3] shadow-2xl" lang={lang}>
          <div ref={headerRef} className="bg-[#FAF8F3] px-6 pt-5 pb-3 text-center border-b-2 border-neutral-900 text-neutral-800">
            <img src="/brand/news-clip-logo.jpg" alt="Sunrise News Telugu Daily" className="block w-full max-w-md h-auto mx-auto" />
            <p className="mt-2 text-sm font-semibold" data-testid="clip-date">{dateStr}</p>
          </div>
          <div className="relative">
            <div ref={newsRef} data-testid="clip-news-item" className="bg-[#FAF8F3] text-neutral-900 p-5 md:p-8">
              {preset !== 'photo' && <>
                <div className="flex justify-between gap-3 text-xs border-b border-neutral-400 pb-2 mb-4"><span>{location}</span><span>{categoryName}</span></div>
                <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3">{headline}</h2>
                <p className="text-xs text-neutral-600 mb-4">By <strong>{authorName}</strong></p>
              </>}
              {featuredImage && preset !== 'headline' && <div className="my-3">
                <img src={safeUrl(featuredImage, '/brand/news-clip-logo.jpg')} alt={headline} className="w-full h-auto block" />
                {imageCaption && <p className="text-xs text-neutral-600 mt-2">{imageCaption}</p>}
              </div>}
              {preset !== 'photo' && <>
                <p className="font-bold text-base leading-relaxed mb-4">{summary}</p>
                {preset === 'story' && <div className="md:columns-2 gap-6 text-sm leading-relaxed whitespace-pre-wrap break-words">{body.replace(/#{1,6}\s+/g, '').replace(/\*\*/g, '')}</div>}
              </>}
            </div>
            {!scrolling && <CropSelection crop={crop} onChange={setCrop} drawing={drawing} onDrawEnd={() => setDrawing(false)} />}
          </div>
        </div>
      </div>
      <div className="bg-black text-white p-4 flex justify-center gap-4 shrink-0 border-t border-neutral-800">
        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-white text-slate-900 rounded-lg font-bold">{isTelugu ? 'రద్దు' : 'Cancel'}</button>
        <button type="button" disabled={creating} onClick={createClip} className="px-6 py-2.5 bg-[#990000] hover:bg-red-800 disabled:opacity-50 rounded-lg font-bold flex gap-2 items-center"><DashedClipIcon className="w-4 h-4" />{creating ? (isTelugu ? 'తయారు అవుతోంది…' : 'Creating…') : (isTelugu ? 'క్లిప్ తయారు చేయండి' : 'Create Clip')}</button>
      </div>
    </div>
    <NewsClipResultModal isOpen={!!clipImage} onClose={() => { setClipImage(''); onClose(); }} onRecrop={() => setClipImage('')} clipData={clipData} imageDataUrl={clipImage} />
  </>;
};
