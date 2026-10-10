import React from 'react';
import Link from 'next/link';
import { Shield, Target, Compass, Award, Building } from 'lucide-react';
import { Language } from '@/types';

export default async function AboutUsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-brand-orange uppercase tracking-wider block">
          {isTelugu ? 'మా ప్రస్థానం' : 'ABOUT SUNRISE NEWS'}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-brand-navy">
          {isTelugu ? 'ప్రజా పక్షాన నిలిచే స్వతంత్ర జర్నలిజం' : 'Independent Journalism for an Informed Democracy'}
        </h1>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {isTelugu
            ? 'సన్‌రైజ్ న్యూస్ — ఆంధ్రప్రదేశ్, తెలంగాణ మరియు భారతదేశ వ్యాప్తంగా నిష్పక్షపాత వార్తలను, పరిశోధనాత్మక విశ్లేషణలను అందించే అగ్రగామి డిజిటల్ ప్రచురణ.'
            : 'Founded to deliver reliable, deeply researched regional and national reporting with uncompromising factual rigor.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">{isTelugu ? 'లక్ష్యం (Mission)' : 'Our Mission'}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isTelugu
              ? 'ప్రజాస్వామ్యంలో పౌరులకు అవసరమైన సత్యసంధమైన సమాచారాన్ని నిష్పక్షపాతంగా అందించడం.'
              : 'Empowering citizens with accurate, contextual journalism free from commercial or political bias.'}
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-navy/10 text-brand-navy flex items-center justify-center mx-auto mb-3">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">{isTelugu ? 'దార్శనికత (Vision)' : 'Our Vision'}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isTelugu
              ? 'దక్షిణ భారతదేశంలో అత్యంత విశ్వసనీయమైన మరియు ఆధునిక సాంకేతిక పరిజ్ఞానంతో కూడిన డిజిటల్ వార్తా వేదికగా నిలవడం.'
              : 'Setting the gold standard for regional newsroom architecture and bilingual investigative storytelling.'}
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">{isTelugu ? 'విశ్వసనీయత (Credibility)' : 'Our Credibility'}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isTelugu
              ? 'కఠినమైన ఫ్యాక్ట్-చెక్ ప్రమాణాలు, పారదర్శక సవరణల విధానం మరియు స్వతంత్ర సంపాదకీయ స్వేచ్ఛ.'
              : 'Stringent source verification, transparent corrections register, and reader accountability.'}
          </p>
        </div>
      </div>

      {/* Regional Bureaus */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Building className="w-5 h-5 text-brand-orange" />
          <span>{isTelugu ? 'మా ప్రధాన బ్యూరో కార్యాలయాలు' : 'Our Bureau Network'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <h3 className="font-bold text-white mb-1">Amaravati Bureau</h3>
            <p>Rayapudi Capital Corridor, Amaravati 522237</p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <h3 className="font-bold text-white mb-1">Hyderabad Bureau</h3>
            <p>Jubilee Hills Media Tower, Hyderabad 500033</p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <h3 className="font-bold text-white mb-1">Visakhapatnam Bureau</h3>
            <p>Oceanic Media Center, VIP Road, Vizag 530003</p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <h3 className="font-bold text-white mb-1">New Delhi Bureau</h3>
            <p>Press House, Bahadur Shah Zafar Marg, ITO 110002</p>
          </div>
        </div>
      </div>
    </div>
  );
}
