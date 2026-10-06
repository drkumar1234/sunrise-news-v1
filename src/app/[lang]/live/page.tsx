'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Radio, Clock, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { Language } from '@/types';

export default function LiveUpdatesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [lastRefreshed, setLastRefreshed] = useState('Just now');

  const updates = [
    {
      time: '16:15 IST',
      headline: isTelugu
        ? 'అమరావతి సీఆర్‌డీఏ ఇంజనీరింగ్ సమావేశం ముగింపు: తుది ఒప్పందాలపై సంతకాలు'
        : 'AP CRDA Engineering Review Concludes: Executing Agreements on Flood Mitigation',
      content: isTelugu
        ? 'కృష్ణా నదీ తీర ప్రాంతంలో 28 కిలోమీటర్ల మేర నిర్మించనున్న రివెట్‌మెంట్ పనులకు సంబంధించి ఇంజనీర్లు మరియు కన్సార్టియం ప్రతినిధులు సాంకేతిక ఒప్పందాలపై సంతకాలు చేశారు. వచ్చే సోమవారం నుంచి ప్రాథమిక పనులు ప్రారంభమవుతాయి.'
        : 'Engineers and technical consortium heads officially signed milestone frameworks for the 28km reinforced riverfront revetment works along the Krishna river bank. Soil stabilization drills start next week.',
      category: 'Amaravati',
      badge: 'Developing',
    },
    {
      time: '15:40 IST',
      headline: isTelugu
        ? 'విశాఖ పోర్ట్ ద్వారా రికార్డు స్థాయిలో కంటైనర్ రవాణా'
        : 'Visakhapatnam Port Crosses Record Monthly Container Throughput',
      content: isTelugu
        ? 'విశాఖపట్నం మేజర్ పోర్ట్ ట్రస్ట్ ఈ త్రైమాసికంలో 7.4 మిలియన్ టన్నుల సరుకు రవాణా నమోదు చేసింది. ఫార్మా మరియు సముద్ర ఉత్పత్తుల ఎగుమతులు భారీగా పెరిగాయి.'
        : 'Port authorities report 7.4 million metric tonnes handled this quarter, boosted by pharmaceutical consignments and marine cold chain exports to East Asia.',
      category: 'Visakhapatnam',
      badge: 'Port & Trade',
    },
    {
      time: '14:20 IST',
      headline: isTelugu
        ? 'హైదరాబాద్ శంషాబాద్ ఎయిర్‌పోర్ట్‌లో అధునాతన కార్గో విస్తరణ'
        : 'Hyderabad Airport Unveils Temperature-Controlled Vaccine Logistics Wing',
      content: isTelugu
        ? 'జీఎంఆర్ హైదరాబాద్ అంతర్జాతీయ విమానాశ్రయంలో లైఫ్ సైన్సెస్ మరియు వ్యాక్సిన్ల నిల్వ కోసం నూతన ఫార్మా కార్గో విభాగాన్ని ప్రారంభించారు.'
        : 'Dedicated pharmaceutical hub inaugurated with end-to-end cryogenic cooling capacity to service vaccine exporters across Genome Valley.',
      category: 'Hyderabad',
      badge: 'Aviation',
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Live Header */}
      <div className="bg-brand-navy-dark text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-brand-red">
        <div>
          <div className="flex items-center gap-2 bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <Radio className="w-4 h-4" />
            <span>{isTelugu ? 'ప్రత్యక్ష ప్రసారం (LIVE)' : 'LIVE NEWS BLOG'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black">
            {isTelugu ? 'క్షణం క్షణం వార్తా పరిణామాలు' : 'Rolling Live Dispatches'}
          </h1>
          <p className="text-slate-300 text-xs mt-1">
            {isTelugu
              ? 'ఆంధ్రప్రదేశ్, తెలంగాణ మరియు జాతీయ రాజకీయ పరిణామాలపై నిరంతర ప్రత్యక్ష సమాచారం.'
              : 'Minute-by-minute updates from our bureau network in Amaravati, Hyderabad, and Delhi.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/90 px-4 py-2 rounded-lg border border-slate-800">
          <Clock className="w-4 h-4 text-brand-orange" />
          <span>Updated: {lastRefreshed}</span>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8">
        {updates.map((item, index) => (
          <div key={index} className="relative group">
            {/* Timeline node */}
            <span className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-brand-orange border-4 border-white shadow" />

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm group-hover:bg-white group-hover:shadow transition-all space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-brand-red bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  {item.time}
                </span>
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                  {item.category} • {item.badge}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-950 leading-snug">
                {item.headline}
              </h2>

              <p className="text-xs text-slate-700 leading-relaxed">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
