import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle, AlertTriangle, ShieldAlert, Search } from 'lucide-react';
import { getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function FactChecksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [{ articles }, categories, authors] = await Promise.all([
    getArticles({ format: 'fact-check', status: 'published' }),
    getCategories(),
    getAuthors(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border-t-4 border-brand-orange">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-5 h-5 text-brand-orange" />
          <span>{isTelugu ? 'నిజనిర్ధారణ వేదిక' : 'INDEPENDENT FACT CHECK DESK'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          {isTelugu ? 'సన్‌రైజ్ ఫ్యాక్ట్ చెక్ డెస్క్ (Fact Checks)' : 'Sunrise News Fact Check Desk'}
        </h1>
        <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
          {isTelugu
            ? 'రాజకీయ నాయకుల ప్రకటనలు, సోషల్ మీడియాలో వైరల్ అయ్యే పోస్టులు, ఫోటోలు, వీడియోల వాస్తవాలను నిష్పక్షపాత ఆధారాలతో ధ్రువీకరించి ప్రజలకు వాస్తవాలను అందించే విభాగం.'
            : 'Evaluating viral claims, political statements, and digital hoaxes using strict, transparent evidence verification standards.'}
        </p>

        {/* Fact check criteria explanation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="font-bold text-emerald-400 block mb-0.5">True / నిజం</span>
            <span className="text-slate-400 text-[11px]">Primary documents completely verify claim</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="font-bold text-amber-400 block mb-0.5">Misleading / తప్పుదోవ</span>
            <span className="text-slate-400 text-[11px]">Partial truth presented out of context</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="font-bold text-red-400 block mb-0.5">False / అబద్ధం</span>
            <span className="text-slate-400 text-[11px]">Directly contradicted by empirical facts</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="font-bold text-slate-300 block mb-0.5">Unproven / రుజువు కాలేదు</span>
            <span className="text-slate-400 text-[11px]">Insufficient verifiable evidence available</span>
          </div>
        </div>
      </div>

      {/* Grid of Fact Check Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <NewsCard
            key={art.id}
            article={art}
            category={categories.find(c => c.id === art.categoryId)}
            author={authors.find(a => a.id === art.authorId)}
            lang={lang}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
}
