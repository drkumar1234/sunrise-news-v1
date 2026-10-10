import React from 'react';
import { Megaphone, Users, Award, Mail, Phone } from 'lucide-react';
import { Language } from '@/types';

export default async function AdvertisePage({
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
          {isTelugu ? 'ప్రకటనలు & బ్రాండ్ విస్తరణ' : 'COMMERCIAL SOLUTIONS'}
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ న్యూస్ ప్రకటనల విభాగం' : 'Advertise with Sunrise News'}
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
          {isTelugu
            ? 'ఆంధ్రప్రదేశ్, తెలంగాణ మరియు దేశవ్యాప్తంగా ఉన్న ఉన్నత స్థాయి పాఠకులను మీ బ్రాండ్ ద్వారా చేరుకోండి.'
            : 'Reach influential decision makers, urban professionals, and regional audiences across Telugu states.'}
        </p>
      </div>

      {/* Audience Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-3xl font-black text-brand-orange block">2.4M+</span>
          <span className="text-xs font-bold text-slate-700 uppercase">Monthly Pageviews</span>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-3xl font-black text-brand-navy block">78%</span>
          <span className="text-xs font-bold text-slate-700 uppercase">AP & Telangana Native</span>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <span className="text-3xl font-black text-emerald-600 block">4.8 min</span>
          <span className="text-xs font-bold text-slate-700 uppercase">Average Reading Session</span>
        </div>
      </div>

      {/* Ad Placements Guide */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-6">
        <h2 className="text-xl font-bold text-amber-300">
          {isTelugu ? 'లభ్యమయ్యే ప్రకటన స్థానాలు' : 'Standard Digital Placements'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-1">Header Leaderboard</h3>
            <p>728x90 desktop / 320x50 mobile. Premium top visibility across all articles.</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-1">Sidebar Rectangle</h3>
            <p>300x250 sticky desktop slot with high dwell time beside investigative reads.</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-1">Mid-Article Ribbon</h3>
            <p>High-engagement native inline placement inside regional reports.</p>
          </div>
        </div>
      </div>

      {/* Media Kit Contact */}
      <div className="p-8 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-3">
        <h3 className="text-xl font-bold text-slate-900">
          {isTelugu ? 'మీడియా కిట్ మరియు ధరల వివరాల కోసం:' : 'Request Media Kit & Rate Card'}
        </h3>
        <p className="text-xs text-slate-600">
          {isTelugu
            ? 'మా వాణిజ్య ప్రతినిధులను సంప్రదించండి: advertise@sunrisenews.in | +91 866 245 8890'
            : 'Contact our commercial media team: advertise@sunrisenews.in | +91 866 245 8890'}
        </p>
      </div>
    </div>
  );
}
