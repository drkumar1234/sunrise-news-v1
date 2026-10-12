'use client';

import React, { useEffect, useState } from 'react';
import { Download, MessageCircle, Copy, Check, Share2, RotateCcw, X } from 'lucide-react';
import { Language } from '@/types';
import { getSiteUrl } from '@/lib/site-url';

export interface ClipData { headline: string; summary: string; url?: string; lang: Language }
interface NewsClipResultModalProps {
  isOpen: boolean; onClose: () => void; onRecrop: () => void; clipData: ClipData; imageDataUrl: string;
}

export const NewsClipResultModal: React.FC<NewsClipResultModalProps> = ({ isOpen, onClose, onRecrop, clipData, imageDataUrl }) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const isTelugu = clipData.lang === 'te';
  useEffect(() => { setCopied(false); setError(''); }, [imageDataUrl]);
  if (!isOpen) return null;
  const imageBlob = async () => (await fetch(imageDataUrl)).blob();
  const filename = `SunriseNews_Clip_${clipData.headline.replace(/[^a-zA-Z0-9\u0C00-\u0C7F]+/g, '-').slice(0, 45) || 'story'}.png`;
  const whatsApp = () => {
    const text = encodeURIComponent(`📰 ${clipData.headline}\n\n${clipData.summary}\n\n${clipData.url || getSiteUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };
  const copyImage = async () => {
    setError('');
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': imageBlob() })]);
      setCopied(true);
    } catch { setError(isTelugu ? 'కాపీ చేయడం సాధ్యం కాలేదు. క్లిప్ డౌన్‌లోడ్ చేసుకోండి.' : 'Image copying is unavailable. Download the clip instead.'); }
  };
  const shareImage = async () => {
    setError('');
    try {
      const file = new File([await imageBlob()], filename, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ title: clipData.headline, files: [file] });
      else setError(isTelugu ? 'క్లిప్ డౌన్‌లోడ్ చేసి మీ యాప్‌లో షేర్ చేయండి.' : 'Download the clip, then attach it in your preferred app.');
    } catch (cause) {
      if (!(cause instanceof Error && cause.name === 'AbortError')) setError(isTelugu ? 'షేర్ చేయడం సాధ్యం కాలేదు. క్లిప్ డౌన్‌లోడ్ చేసుకోండి.' : 'Sharing is unavailable. Download the clip instead.');
    }
  };
  return <div role="dialog" aria-modal="true" aria-label="News clip ready" className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-3 md:p-6">
    <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[94dvh] overflow-hidden">
      <div className="bg-brand-navy text-white p-4 flex items-center justify-between gap-3 shrink-0">
        <h3 className="font-bold">{isTelugu ? 'న్యూస్ క్లిప్ సిద్ధమైంది' : 'News Clip Ready'}</h3>
        <div className="flex gap-3 items-center">
          <button type="button" onClick={onRecrop} className="flex gap-2 items-center text-sm bg-slate-700 px-3 py-2 rounded"><RotateCcw className="w-4 h-4" />{isTelugu ? 'మళ్ళీ క్రాప్ చేయండి' : 'Adjust Crop'}</button>
          <button type="button" onClick={onClose} aria-label="Close clip result" className="p-2"><X className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4 bg-slate-800">
        <img src={imageDataUrl} alt={isTelugu ? 'మీరు ఎంచుకున్న వార్తా క్లిప్' : 'Your cropped news clip'} className="block w-full max-w-2xl h-auto mx-auto bg-white" data-testid="generated-news-clip" />
      </div>
      <div className="p-4 shrink-0 border-t border-slate-200">
        {error && <p role="alert" className="text-red-700 text-sm mb-3">{error}</p>}
        <div className="flex flex-wrap justify-center gap-3">
          <a href={imageDataUrl} download={filename} className="px-4 py-2.5 bg-[#990000] text-white rounded-lg font-bold flex items-center gap-2"><Download className="w-4 h-4" />{isTelugu ? 'క్లిప్ డౌన్‌లోడ్ (PNG)' : 'Download Clip (PNG)'}</a>
          <button type="button" onClick={copyImage} className="px-4 py-2.5 bg-slate-100 rounded-lg font-semibold flex items-center gap-2">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? (isTelugu ? 'కాపీ అయింది!' : 'Copied!') : (isTelugu ? 'ఇమేజ్ కాపీ' : 'Copy Image')}</button>
          <button type="button" onClick={shareImage} className="px-4 py-2.5 bg-slate-100 rounded-lg font-semibold flex items-center gap-2"><Share2 className="w-4 h-4" />{isTelugu ? 'క్లిప్ షేర్' : 'Share Image'}</button>
          <button type="button" onClick={whatsApp} className="px-4 py-2.5 bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-2"><MessageCircle className="w-4 h-4" />{isTelugu ? 'వాట్సాప్ లింక్' : 'WhatsApp Link'}</button>
        </div>
      </div>
    </div>
  </div>;
};
