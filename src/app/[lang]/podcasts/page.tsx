import React from 'react';
import { Headphones, Play, Mic, Clock } from 'lucide-react';
import { Language } from '@/types';

export default function PodcastsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const episodes = [
    {
      id: 'pod-1',
      title: isTelugu
        ? 'అమరావతి రాజధాని 2.0: భవిష్యత్ ప్రణాళికలు మరియు సవాళ్లు'
        : 'Amaravati 2.0: Inside the Infrastructure & Financing Roadmap',
      host: isTelugu ? 'రమేష్ వర్మ' : 'Ramesh Varma',
      duration: '24 mins',
      date: '21 Sep 2026',
      description: isTelugu
        ? 'ఆంధ్రప్రదేశ్ రాజధాని నిర్మాణంలో రెండో దశ టెండర్ల ప్రాధాన్యత మరియు ప్రపంచ బ్యాంక్ నిధుల కేటాయింపులపై సమగ్ర చర్చ.'
        : 'Deep dive into the Phase 2 arterial highway tenders, flood engineering on Krishna river, and citizen rehabilitation.',
    },
    {
      id: 'pod-2',
      title: isTelugu
        ? 'హైదరాబాద్ ఐటీ & ఏఐ విస్తరణ: తెలుగు యువతకు ఉద్యోగావకాశాలు'
        : 'Hyderabad Generative AI Hub: Talent, Investment & Indic Language LLMs',
      host: isTelugu ? 'కవితా రావు' : 'Kavitha Rao',
      duration: '19 mins',
      date: '19 Sep 2026',
      description: isTelugu
        ? 'ఫైనాన్షియల్ డిస్ట్రిక్ట్ లో కొత్త రీసెర్చ్ సెంటర్ల ఏర్పాటు మరియు తెలుగు భాషా ఆధారిత సాంకేతిక నమూనాల అభివృద్ధి.'
        : 'Analyzing the multi-billion dollar AI enterprise commitments and academic tie-ups with IIIT Hyderabad.',
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Headphones className="w-4 h-4" />
          <span>{isTelugu ? 'ఆడియో పాడ్‌కాస్ట్' : 'SUNRISE AUDIO'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ పాడ్‌కాస్ట్‌లు & ఆడియో బులెటిన్లు' : 'Sunrise Podcasts & Audio Briefings'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {isTelugu
            ? 'ప్రయాణంలోనూ తాజా వార్తలు మరియు ముఖ్య పరిణామాలను స్పష్టమైన విశ్లేషణలతో వినండి.'
            : 'Insightful discussions and morning audio digests accessible on web and mobile.'}
        </p>
      </div>

      <div className="space-y-6">
        {episodes.map((ep) => (
          <div
            key={ep.id}
            className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-navy text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Play className="w-6 h-6 fill-current text-brand-orange ml-1" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-brand-orange font-bold uppercase tracking-wider mb-1">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Hosted by {ep.host}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">{ep.title}</h2>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{ep.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 flex-shrink-0 self-end md:self-center">
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{ep.duration}</span>
              </span>
              <span>{ep.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
