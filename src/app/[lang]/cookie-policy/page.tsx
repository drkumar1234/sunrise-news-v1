import React from 'react';
import { Cookie, CheckCircle } from 'lucide-react';
import { Language } from '@/types';

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Cookie className="w-4 h-4" />
          <span>COOKIES & STORAGE</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'కుకీ విధానం (Cookie Policy)' : 'Cookie & Local Storage Policy'}
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Transparency on how browser storage and preferences are managed.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
        <section className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-2">Essential & Functional Cookies</h2>
          <p className="text-xs text-slate-600">
            SUNRISE NEWS uses strictly necessary session cookies and local storage tokens to preserve language selection (English vs. Telugu), font size preferences, and reader session states. We do not deploy invasive cross-site behavioral tracking cookies.
          </p>
        </section>
      </div>
    </div>
  );
}
