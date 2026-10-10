'use client';

import React, { useRef, useState, useEffect } from 'react';
import { safeUrl } from '@/lib/content-safety';
import {
  Download, MessageCircle, Copy, Check, Share2,
  RotateCcw, X, ShieldCheck, ExternalLink, Calendar, MapPin
} from 'lucide-react';
import { Language } from '@/types';
import { getSiteUrl } from '@/lib/site-url';

export interface ClipData {
  headline: string;
  summary: string;
  bodySnippet?: string;
  featuredImage?: string;
  imageCaption?: string;
  categoryName?: string;
  authorName?: string;
  location?: string;
  dateStr?: string;
  url?: string;
  lang: Language;
  preset: 'story' | 'headline' | 'photo' | 'quote' | 'custom';
}

interface NewsClipResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecrop: () => void;
  clipData: ClipData;
}

export const NewsClipResultModal: React.FC<NewsClipResultModalProps> = ({
  isOpen,
  onClose,
  onRecrop,
  clipData,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');

  const isTelugu = clipData.lang === 'te';

  // Render the clipping on an HTML5 canvas for crisp image generation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions: High-res 1200 x height
    const width = 1000;
    const height = clipData.preset === 'headline' ? 620 : 1200;
    canvas.width = width;
    canvas.height = height;

    // Background: Crisp warm newsprint
    ctx.fillStyle = '#FCFBF7';
    ctx.fillRect(0, 0, width, height);

    // Outer broadsheet border
    ctx.strokeStyle = '#0B192C';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(22, 22, width - 44, height - 44);

    // 1. TOP HEADER / MASTHEAD
    ctx.fillStyle = '#0B192C';
    ctx.fillRect(23, 23, width - 46, 95);

    // Sun icon & Masthead Title
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('☀', 45, 65);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 28px sans-serif';
    ctx.fillText('SUNRISE NEWS', 75, 65);

    ctx.fillStyle = '#FFB703';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('|  సన్‌రైజ్ న్యూస్', 305, 65);

    // Subheader Edition & Date
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 13px sans-serif';
    const dateText = clipData.dateStr || new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    ctx.fillText(`${dateText}  •  Andhra Pradesh & Telangana Edition  •  E-Paper Digital Clip`, 45, 96);

    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('OFFICIAL DIGITAL CLIP', width - 215, 65);

    // 2. METADATA BAR
    let currentY = 145;
    ctx.fillStyle = '#FF6B35';
    ctx.font = 'bold 14px sans-serif';
    const cat = (clipData.categoryName || 'NEWS').toUpperCase();
    ctx.fillText(cat, 45, currentY);

    if (clipData.location) {
      ctx.fillStyle = '#64748B';
      ctx.font = '13px sans-serif';
      ctx.fillText(`•   ${clipData.location}`, 55 + ctx.measureText(cat).width + 10, currentY);
    }

    currentY += 15;
    // Horizontal divider
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(45, currentY);
    ctx.lineTo(width - 45, currentY);
    ctx.stroke();

    // 3. HEADLINE
    currentY += 40;
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 32px sans-serif';

    // Word wrap headline
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number = 4) => {
      const words = text.split(' ');
      let line = '';
      let linesDrawn = 0;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
          linesDrawn++;
          if (linesDrawn >= maxLines - 1 && n < words.length - 1) {
            line += '...';
            break;
          }
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
      return y + lineHeight;
    };

    currentY = wrapText(clipData.headline, 45, currentY, width - 90, 42, 3);

    // Author byline
    if (clipData.authorName) {
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 14px sans-serif';
      ctx.fillText(`By ${clipData.authorName}  |  Sunrise Newsroom`, 45, currentY + 5);
      currentY += 25;
    }

    // 4. IMAGE (if present)
    const drawContent = () => {
      // 5. SUMMARY / BODY SNIPPET
      currentY += 20;
      ctx.fillStyle = '#1E293B';
      ctx.font = '500 18px sans-serif';
      currentY = wrapText(clipData.summary, 45, currentY, width - 90, 28, 4);

      if (clipData.bodySnippet && clipData.preset !== 'headline') {
        currentY += 15;
        ctx.fillStyle = '#334155';
        ctx.font = '16px sans-serif';
        const cleanBody = clipData.bodySnippet
          .replace(/#{1,6}\s+/g, '')
          .replace(/\*\*/g, '')
          .slice(0, 400);
        currentY = wrapText(cleanBody, 45, currentY, width - 90, 26, 6);
      }

      // 6. FOOTER WATERMARK
      const footerY = height - 55;
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(45, footerY - 20);
      ctx.lineTo(width - 45, footerY - 20);
      ctx.stroke();

      ctx.fillStyle = '#0B192C';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('SUNRISE NEWS STORY CLIP', 45, footerY + 5);

      ctx.fillStyle = '#64748B';
      ctx.font = '12px sans-serif';
      ctx.fillText(`Read full investigative journalism & updates at ${getSiteUrl()}`, 45, footerY + 24);

      ctx.fillStyle = '#0B192C';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Sunrise News', width - 250, footerY + 12);

      // Generate preview URL
      try {
        const dataUrl = canvas.toDataURL('image/png');
        setPreviewDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating canvas data URL:', err);
      }
    };

    if (clipData.featuredImage && clipData.preset !== 'headline') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const imgH = 340;
          ctx.drawImage(img, 45, currentY + 10, width - 90, imgH);
          currentY += imgH + 25;
          if (clipData.imageCaption) {
            ctx.fillStyle = '#64748B';
            ctx.font = 'italic 12px sans-serif';
            ctx.fillText(clipData.imageCaption.slice(0, 110), 45, currentY);
            currentY += 15;
          }
        } catch {
          // If tainted canvas due to cors, continue gracefully
        }
        drawContent();
      };
      img.onerror = () => {
        drawContent();
      };
      img.src = clipData.featuredImage;
    } else {
      drawContent();
    }
  }, [isOpen, clipData]);

  if (!isOpen) return null;

  // 1. Download action
  const handleDownload = () => {
    setDownloading(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      const slug = clipData.headline
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 30);
      a.download = `SunriseNews_Clip_${slug || 'story'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  // 2. WhatsApp Share action
  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `📰 *${clipData.headline}*\n\n${clipData.summary}\n\n👉 Read full story on Sunrise News: ${
        clipData.url || (typeof window !== 'undefined' ? window.location.href : getSiteUrl())
      }`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  // 3. Copy Image to clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch (err) {
          // Fallback to copying URL
          if (clipData.url) {
            await navigator.clipboard.writeText(clipData.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          }
        }
      }, 'image/png');
    } catch {
      // Fallback
    }
  };

  // 4. Native Web Share if available
  const handleWebShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], 'news-clip.png', { type: 'image/png' })] })) {
          const file = new File([blob], 'SunriseNews_Clip.png', { type: 'image/png' });
          await navigator.share({
            title: clipData.headline,
            text: clipData.summary,
            url: clipData.url || window.location.href,
            files: [file],
          });
        } else if (navigator.share) {
          await navigator.share({
            title: clipData.headline,
            text: clipData.summary,
            url: clipData.url || window.location.href,
          });
        } else {
          handleWhatsApp();
        }
      });
    } catch {
      handleWhatsApp();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-fadeIn">
      {/* Offscreen Canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-700 my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-brand-navy text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange font-bold text-sm">
              ✂
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>{isTelugu ? 'న్యూస్ క్లిప్ సిద్ధమైంది' : 'News Clip Ready'}</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  {isTelugu ? 'వార్తా కార్డ్' : 'Story Card'}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {isTelugu
                  ? 'కథనం విజయవంతంగా క్లిప్ చేయబడింది. మీరు డౌన్‌లోడ్ చేసుకోవచ్చు లేదా షేర్ చేయవచ్చు.'
                  : 'Your newspaper clip is generated with official masthead branding.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRecrop}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Edit card format"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isTelugu ? 'మళ్ళీ క్లిప్ చేయండి' : 'Edit Card'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Live Scrollable Preview */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900/60 flex flex-col items-center justify-center">
          {/* Authentic Newspaper Cutout Card */}
          <div className="w-full max-w-2xl bg-[#FCFBF7] text-slate-900 rounded-lg p-5 md:p-8 shadow-2xl border-4 border-slate-900 relative">
            {/* Stamp badge */}
            <div className="absolute top-4 right-4 bg-red-800 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow">
              {isTelugu ? 'సన్‌రైజ్ క్లిప్' : 'SUNRISE CLIP'}
            </div>

            {/* Newspaper Header */}
            <div className="border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <img
                  src="/brand/sunrise-news-logo.jpg"
                  alt="SUNRISE NEWS TELUGU DAILY | సన్‌రైజ్ న్యూస్"
                  className="h-12 md:h-16 object-contain"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1 pt-1 border-t border-slate-300">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{clipData.dateStr || '06 Oct 2026'}</span>
                  <span>•</span>
                  <span>{isTelugu ? 'ఆంధ్రప్రదేశ్ & హైదరాబాద్ ఎడిషన్' : 'AP & Telangana Edition'}</span>
                </span>
                <span className="font-semibold text-slate-700">
                  {clipData.categoryName || 'News'}
                </span>
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-xl md:text-2xl font-black text-slate-950 leading-tight mb-2 font-serif">
              {clipData.headline}
            </h2>

            {/* Byline */}
            {clipData.authorName && (
              <p className="text-xs text-slate-600 italic mb-4">
                By {clipData.authorName} {clipData.location && `• ${clipData.location}`}
              </p>
            )}

            {/* Photo if present */}
            {clipData.featuredImage && clipData.preset !== 'headline' && (
              <div className="my-3 overflow-hidden rounded border border-slate-300 bg-slate-100">
                <img
                  src={safeUrl(clipData.featuredImage, '/brand/sunrise-news-logo.jpg')}
                  alt={clipData.headline}
                  className="w-full max-h-72 object-cover"
                />
                {clipData.imageCaption && (
                  <p className="text-[11px] text-slate-600 italic p-1.5 bg-slate-50 border-t border-slate-200">
                    {clipData.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Summary / Body */}
            <p className="text-sm md:text-base font-medium text-slate-800 leading-relaxed mt-2">
              {clipData.summary}
            </p>

            {clipData.bodySnippet && clipData.preset !== 'headline' && (
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed mt-2 border-l-2 border-brand-orange pl-3 italic">
                {clipData.bodySnippet.replace(/#{1,6}\s+/g, '').slice(0, 260)}...
              </p>
            )}

            {/* Newspaper Footer */}
            <div className="mt-6 pt-3 border-t-2 border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{getSiteUrl()} • Sunrise News Clipping</span>
              </span>
              <span>Press Council Standards Compliant</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="bg-white border-t border-slate-200 p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="hidden sm:inline">
              {isTelugu ? 'షేర్ చేయడానికి సిద్ధం:' : 'Ready to share:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* WhatsApp Share (Primary in AP / Telangana) */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{isTelugu ? 'వాట్సాప్‌లో షేర్' : 'WhatsApp'}</span>
            </button>

            {/* Download Image Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || !previewDataUrl}
              className="px-4 py-2.5 rounded-lg bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? (isTelugu ? 'డౌన్‌లోడ్ అవుతోంది...' : 'Downloading...') : (isTelugu ? 'క్లిప్ డౌన్‌లోడ్ (PNG)' : 'Download Clip')}</span>
            </button>

            {/* Copy Image Button */}
            <button
              type="button"
              onClick={handleCopyImage}
              className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs md:text-sm flex items-center gap-2 border border-slate-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isTelugu ? 'కాపీ అయింది!' : 'Copied!') : (isTelugu ? 'ఇమేజ్ కాపీ' : 'Copy')}</span>
            </button>

            {/* Native Share */}
            <button
              type="button"
              onClick={handleWebShare}
              className="p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
              title="Share"
              aria-label="Share clip"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
