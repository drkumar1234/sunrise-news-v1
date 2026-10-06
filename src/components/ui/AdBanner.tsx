import React from 'react';
import { AdPlacement, Language } from '@/types';

interface AdBannerProps {
  ad?: AdPlacement;
  slotKey: 'leaderboard' | 'sidebar' | 'mid_content' | 'footer';
  lang?: Language;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  ad,
  slotKey,
  lang = 'en',
  className = '',
}) => {
  if (!ad || !ad.isActive) return null;

  const isTelugu = lang === 'te';
  const label = isTelugu ? 'ప్రకటన' : 'ADVERTISEMENT';

  // Slot specific dimensions
  const slotStyles = {
    leaderboard: 'max-w-4xl h-24 sm:h-28 my-6',
    sidebar: 'w-full h-64 my-6',
    mid_content: 'w-full max-w-2xl h-24 my-6 mx-auto',
    footer: 'max-w-4xl h-24 my-6 mx-auto',
  }[slotKey];

  return (
    <div className={`flex flex-col items-center ad-banner ${slotStyles} ${className}`}>
      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
        {label}
      </span>
      <a
        href={ad.targetUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full h-full rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group bg-slate-100 transition-transform hover:scale-[1.01]"
      >
        <img
          src={ad.imageUrl}
          alt={ad.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-1 right-2 bg-slate-900/80 backdrop-blur-sm text-[9px] text-slate-200 px-1.5 py-0.5 rounded">
          {ad.advertiser}
        </div>
      </a>
    </div>
  );
};
