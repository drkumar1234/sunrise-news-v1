import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <Logo size="lg" className="mx-auto" />
      <div className="space-y-2">
        <span className="text-6xl font-black text-brand-orange block">404</span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Page Not Found / పేజీ కనుగొనబడలేదు
        </h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
          The story or section you are seeking may have moved, been archived, or the address was mistyped.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-4">
        <Link
          href="/en"
          className="px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-light transition-colors flex items-center gap-2 shadow"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>
        <Link
          href="/en/search"
          className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 border"
        >
          <Search className="w-4 h-4 text-brand-orange" />
          <span>Search News</span>
        </Link>
      </div>
    </div>
  );
}
