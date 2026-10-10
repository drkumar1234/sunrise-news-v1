import React from 'react';
import Link from 'next/link';
import { BarChart3, PieChart, TrendingUp, Download, Share2 } from 'lucide-react';
import { Language } from '@/types';

export default async function InfographicsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const graphics = [
    {
      id: 'info-1',
      title: isTelugu
        ? 'ఆంధ్రప్రదేశ్ & తెలంగాణ నదీ జలాల కేటాయింపులు (TMC అంచనాలు)'
        : 'Krishna & Godavari River Water Allocation Matrix (TMC Yields)',
      category: isTelugu ? 'సాగునీటి ప్రాజెక్టులు' : 'Irrigation & Hydrology',
      date: '21 September 2026',
      source: 'Central Water Commission / KRMB',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      description: isTelugu
        ? 'పోలవరం, శ్రీశైలం, నాగార్జునసాగర్ రిజర్వాయర్ల ప్రస్తుత నీటి మట్టాలు మరియు ఆయకట్టు సాగు విస్తీర్ణ వివరాలు.'
        : 'Comparative storage levels, ayacut release schedules, and telemetry sensor points across both states.',
    },
    {
      id: 'info-2',
      title: isTelugu
        ? 'తెలుగు రాష్ట్రాల్లో సౌర & పునరుత్పాదక ఇంధన ఉత్పత్తి వృద్ధి'
        : 'Renewable Solar & Wind Capacity Expansion in AP & Telangana (2020-2026)',
      category: isTelugu ? 'పునరుత్పాదక ఇంధనం' : 'Clean Energy',
      date: '18 September 2026',
      source: 'Ministry of New and Renewable Energy',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      description: isTelugu
        ? 'కడప అల్ట్రా మెగా సోలార్ పార్క్ మరియు తెలంగాణ పవన విద్యుత్ ఉత్పత్తి గణాంకాలు.'
        : 'Grid penetration metrics and private industrial rooftop solar adoption across industrial corridors.',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>{isTelugu ? 'దత్తాంశ సమాచారం' : 'DATA JOURNALISM'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ ఇన్ఫోగ్రాఫిక్స్ & డేటా చార్టులు' : 'Infographics & Data Visualizations'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'గణాంకాలు, బడ్జెట్ కేటాయింపులు, పంటల దిగుబడులు మరియు పారిశ్రామిక వృద్ధి వివరాలను సులభంగా అర్థం చేసుకునే ఇన్ఫోగ్రాఫిక్స్.'
            : 'Translating complex economic datasets and regional benchmarks into accessible graphical models.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {graphics.map((g) => (
          <div key={g.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded bg-brand-navy/90 text-white text-xs font-bold">
                {g.category}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h2 className="text-xl font-bold text-slate-900 leading-snug">{g.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{g.description}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Source: {g.source}</span>
                <span>{g.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
