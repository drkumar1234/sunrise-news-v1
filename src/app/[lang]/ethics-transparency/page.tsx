import React from 'react';
import { ShieldCheck, Eye, Scale, HeartHandshake } from 'lucide-react';
import { Language } from '@/types';

export default function EthicsTransparencyPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          <span>{isTelugu ? 'నైతిక విలువలు & చట్టం' : 'GOVERNANCE & INTEGRITY'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'నైతిక విలువలు & యాజమాన్య పారదర్శకత' : 'Code of Ethics & Financial Transparency'}
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          {isTelugu
            ? 'సన్‌రైజ్ న్యూస్ యాజమాన్యం, నిధుల సేకరణ, పాత్రికేయ నైతిక నియమావళి మరియు ప్రయోజనాల వైరుధ్యాల నివారణపై పూర్తి వివరాలు.'
            : 'Ownership declaration, disclosure of financial interests, conflict of interest safeguards, and ethical parameters.'}
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-orange" />
            <span>{isTelugu ? 'యాజమాన్య ప్రకటన (Ownership & Structure)' : 'Ownership & Governance Structure'}</span>
          </h2>
          <p>
            {isTelugu
              ? 'సన్‌రైజ్ న్యూస్ డిజిటల్ మీడియా ప్రైవేట్ లిమిటెడ్ ద్వారా నిర్వహించబడుతున్న స్వతంత్ర సంస్థ. ఈ సంస్థలో ఎటువంటి రాజకీయ పార్టీలకు లేదా విదేశీ కార్పొరేట్ శక్తులకు వాటాలు లేవు.'
              : 'SUNRISE NEWS is operated by Sunrise News Digital Media Pvt Ltd, an independent journalism enterprise headquartered in Amaravati and Hyderabad. The publication maintains zero debt or equity ownership from political formations.'}
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-orange" />
            <span>{isTelugu ? 'ప్రయోజనాల వైరుధ్యాల నివారణ (Conflict of Interest)' : 'Conflict of Interest Safeguards'}</span>
          </h2>
          <p>
            {isTelugu
              ? 'మా రిపోర్టర్లు మరియు ఎడిటర్లు తాము పరిశీలిస్తున్న వ్యాపార సంస్థలు లేదా రాజకీయ నాయకుల నుంచి ఎటువంటి బహుమతులు, ఉచిత ప్రయాణాలు లేదా గౌరవ వేతనాలు స్వీకరించడాన్ని ఖచ్చితంగా నిషేధిస్తాము.'
              : 'Our journalists are strictly barred from accepting gifts, sponsored travel, hospitality, or consulting honorariums from sources, subjects of investigations, or government agencies they cover.'}
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-brand-orange" />
            <span>{isTelugu ? 'మూలాల పరిరక్షణ (Protection of Whistleblowers)' : 'Protection of Confidential Sources'}</span>
          </h2>
          <p>
            {isTelugu
              ? 'ప్రజా ప్రయోజనాల దృష్ట్యా అవినీతిని బయటపెట్టే సమాచార దాతలు (Whistleblowers) మరియు గోప్యతా మూలాల భద్రతను రక్షించడానికి మేము కట్టుబడి ఉంటాము.'
              : 'The confidentiality of whistleblowers providing public-interest disclosures is safeguarded under the highest journalistic privilege and digital security protocols.'}
          </p>
        </div>
      </div>
    </div>
  );
}
