'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Pause, Play, ChevronRight } from 'lucide-react';
import { Language } from '@/types';
import { safeUrl } from '@/lib/content-safety';

interface BreakingNewsTickerProps {
  lang: Language;
  textEn: string;
  textTe: string;
  url: string;
  enabled?: boolean;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  lang,
  textEn,
  textTe,
  url,
  enabled = true,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  if (!enabled) return null;

  const displayText = lang === 'te' ? textTe : textEn;
  const label = lang === 'te' ? 'బ్రేకింగ్ న్యూస్' : 'BREAKING NEWS';

  return (
    <div className="bg-brand-navy-dark text-white border-b border-brand-red/30 py-1.5 px-4 breaking-ticker relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-sm">
        {/* Badge */}
        <div className="flex items-center gap-2 flex-shrink-0 bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{label}</span>
        </div>

        {/* Scrolling text container */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className={`whitespace-nowrap flex items-center ${isPaused ? '' : 'animate-ticker'}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Link
              href={safeUrl(url, `/${lang}/breaking`)}
              className="text-slate-200 hover:text-white font-medium hover:underline inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{displayText}</span>
              <ChevronRight className="w-4 h-4 text-brand-orange" />
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
            title={isPaused ? 'Resume ticker' : 'Pause ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
