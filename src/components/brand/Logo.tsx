'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'icon-only';
  lang?: 'en' | 'te';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

/**
 * Official SUNRISE NEWS Brand Logo component
 * Features the authentic Telugu masthead ("సన్‌రైజ్ న్యూస్ - తెలుగు దినపత్రిక")
 * with rising sun & pen nib emblem and PRGI (RNI) registration.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  lang = 'en',
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  const isLight = variant === 'light';

  // Dimension scaling
  const sizeClasses = {
    sm: 'h-8 sm:h-9 max-w-[170px]',
    md: 'h-12 sm:h-14 max-w-[260px]',
    lg: 'h-16 sm:h-20 max-w-[340px]',
    xl: 'h-24 sm:h-28 max-w-[440px]',
  }[size] || 'h-12 sm:h-14 max-w-[260px]';

  if (variant === 'icon-only') {
    return (
      <Link 
        href={`/${lang}`} 
        className={`inline-flex items-center group ${className}`} 
        aria-label="Sunrise News"
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm flex items-center justify-center p-0.5 transition-transform group-hover:scale-105">
          <img
            src="/brand/sunrise-news-logo.jpg"
            alt="Sunrise News"
            className="w-full h-full object-contain"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/${lang}`}
      className={`inline-flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-md ${className}`}
      aria-label="SUNRISE NEWS TELUGU DAILY — Home"
    >
      <div 
        className={`flex flex-col ${
          isLight 
            ? 'bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 inline-flex transition-transform duration-200 group-hover:shadow-md' 
            : 'transition-transform duration-200 group-hover:scale-[1.01]'
        }`}
      >
        <img
          src="/brand/sunrise-news-logo.jpg"
          alt="SUNRISE NEWS TELUGU DAILY | సన్‌రైజ్ న్యూస్"
          className={`${sizeClasses} w-auto object-contain`}
          loading="eager"
        />

        {showTagline && (
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mt-0.5 tracking-tight px-0.5">
            <span>{lang === 'te' ? 'మీ ప్రపంచం. మీ వార్తలు. అనునిత్యం.' : 'Your World. Your News. Every Day.'}</span>
            <span className="text-[9px] text-emerald-800 font-bold ml-2">RNI Regd.</span>
          </div>
        )}
      </div>
    </Link>
  );
};
