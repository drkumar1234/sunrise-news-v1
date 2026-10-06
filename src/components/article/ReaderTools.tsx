'use client';

import React, { useState, useEffect } from 'react';
import { 
  Share2, Copy, Check, Printer, Bookmark, 
  MessageCircle, Twitter, Facebook, Linkedin, Send 
} from 'lucide-react';
import { Language } from '@/types';
import { DashedClipIcon } from '@/components/clipper/DashedClipIcon';
import { NewsClipperModal } from '@/components/clipper/NewsClipperModal';

interface ReaderToolsProps {
  headline: string;
  articleUrl: string;
  lang: Language;
  onFontSizeChange?: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  summary?: string;
  body?: string;
  featuredImage?: string;
  imageCaption?: string;
  categoryName?: string;
  authorName?: string;
  location?: string;
}

export const ReaderTools: React.FC<ReaderToolsProps> = ({
  headline,
  articleUrl,
  lang,
  onFontSizeChange,
  summary,
  body,
  featuredImage,
  imageCaption,
  categoryName,
  authorName,
  location,
}) => {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSize, setActiveSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [clipperOpen, setClipperOpen] = useState(false);

  const isTelugu = lang === 'te';

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const setSize = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    setActiveSize(size);
    if (onFontSizeChange) onFontSizeChange(size);
  };

  const fullUrl = typeof window !== 'undefined' ? window.location.href : articleUrl;
  const encodedHeadline = encodeURIComponent(headline);
  const encodedUrl = encodeURIComponent(fullUrl);

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedHeadline}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedHeadline}&url=${encodedUrl}&via=SunriseNewsIN`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedHeadline}`,
  };

  return (
    <>
      {/* Scroll Progress Bar at the top of the browser */}
      <div 
        id="reading-progress" 
        style={{ width: `${scrollProgress}%` }} 
        aria-hidden="true" 
      />

      <div className="reader-tools flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200 my-6 bg-slate-50/70 px-4 rounded-lg">
        {/* Font Size Adjusters */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <span className="mr-1">{isTelugu ? 'అక్షరాల పరిమాణం:' : 'Text Size:'}</span>
          <button
            type="button"
            onClick={() => setSize('sm')}
            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors ${
              activeSize === 'sm' ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 border hover:bg-slate-100'
            }`}
            title="Small text"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setSize('base')}
            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-sm transition-colors ${
              activeSize === 'base' ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 border hover:bg-slate-100'
            }`}
            title="Default text"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setSize('lg')}
            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-base transition-colors ${
              activeSize === 'lg' ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 border hover:bg-slate-100'
            }`}
            title="Large text"
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => setSize('xl')}
            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-lg transition-colors ${
              activeSize === 'xl' ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 border hover:bg-slate-100'
            }`}
            title="Extra large text"
          >
            A++
          </button>
        </div>

        {/* Action Buttons: Share & Print */}
        <div className="flex items-center gap-2">
          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform hover:scale-105"
            title="Share to WhatsApp"
            aria-label="Share to WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </a>

          {/* Twitter / X */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-transform hover:scale-105"
            title="Share to X"
            aria-label="Share to X"
          >
            <Twitter className="w-4 h-4 fill-current" />
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-transform hover:scale-105"
            title="Share to Facebook"
            aria-label="Share to Facebook"
          >
            <Facebook className="w-4 h-4 fill-current" />
          </a>

          {/* Telegram */}
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-transform hover:scale-105"
            title="Share to Telegram"
            aria-label="Share to Telegram"
          >
            <Send className="w-3.5 h-3.5" />
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isTelugu ? 'లింక్ కాపీ అయింది!' : 'Copied!') : (isTelugu ? 'లింక్ కాపీ' : 'Copy Link')}</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 rounded text-slate-600 hover:text-brand-navy hover:bg-slate-200 border border-slate-300 bg-white transition-colors"
            title={isTelugu ? 'ముద్రించండి' : 'Print article'}
            aria-label="Print article"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* CROP NEWS CLIP BUTTON */}
          <button
            type="button"
            onClick={() => setClipperOpen(true)}
            className="px-3 py-1.5 rounded bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
            title={isTelugu ? 'వార్తను క్లిప్ చేయండి' : 'Crop & Clip News Story'}
          >
            <DashedClipIcon className="w-3.5 h-3.5 text-white" />
            <span>{isTelugu ? 'క్లిప్ చేయండి' : 'Clip Story'}</span>
          </button>
        </div>
      </div>

      {/* Interactive News Clipper Modal */}
      <NewsClipperModal
        isOpen={clipperOpen}
        onClose={() => setClipperOpen(false)}
        headline={headline}
        summary={summary}
        body={body}
        featuredImage={featuredImage}
        imageCaption={imageCaption}
        categoryName={categoryName}
        authorName={authorName}
        location={location}
        lang={lang}
      />
    </>
  );
};
