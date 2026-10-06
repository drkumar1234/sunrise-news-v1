import React from 'react';
import { Shield, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import { Language } from '@/types';

export default function EditorialStandardsPage({
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
          <Shield className="w-4 h-4" />
          <span>{isTelugu ? 'పాత్రికేయ ప్రమాణాలు' : 'EDITORIAL CHARTER'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ న్యూస్ సంపాదకీయ ప్రమాణాలు' : 'Sunrise News Editorial Standards & Charter'}
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          {isTelugu
            ? 'విశ్వసనీయత, ఖచ్చితత్వం, నిష్పక్షపాత వైఖరి మరియు ప్రజాస్వామిక విలువల పరిరక్షణే మా ప్రథమ ప్రాధాన్యత.'
            : 'Our guiding principles for objective reporting, source verification, independence, and ethical boundaries.'}
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-800 space-y-6 text-sm leading-relaxed">
        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>1. {isTelugu ? 'సమాచార ధ్రువీకరణ (Source Verification)' : 'Verification and Sourcing Rigor'}</span>
          </h2>
          <p>
            {isTelugu
              ? 'ప్రతి వార్తా కథనాన్ని ప్రచురించే ముందు కనీసం రెండు స్వతంత్ర మార్గాల ద్వారా లేదా అధికారిక ప్రభుత్వ పత్రాల ద్వారా సరిచూడటం మా సంపాదక బృందానికి తప్పనిసరి. ఊహాగానాలు లేదా అస్పష్ట ఆధారాలతో కూడిన వార్తలను ప్రచురించబోము.'
              : 'Every claim, statistic, or accusation is cross-checked against primary official records or confirmed by at least two independent, knowledgeable sources. Anonymous sourcing is restricted strictly to cases of documented personal peril.'}
          </p>
        </section>

        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>2. {isTelugu ? 'రాజకీయ స్వతంత్రత మరియు సమతుల్యత' : 'Political Impartiality & Fair Right of Reply'}</span>
          </h2>
          <p>
            {isTelugu
              ? 'సన్‌రైజ్ న్యూస్ ఎటువంటి రాజకీయ పార్టీకి లేదా వ్యాపార కూటమికి ప్రాతినిధ్యం వహించదు. వివాదాస్పద అంశాలలో సంబంధిత అన్ని పక్షాల వాదనలకు సముచిత స్థానం మరియు స్పందించే అవకాశం కల్పిస్తాము.'
              : 'SUNRISE NEWS does not endorse political candidates or align with partisan lobbies. When individuals or entities are criticized in investigative reporting, a reasonable, timely right-of-reply is extended prior to publication.'}
          </p>
        </section>

        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>3. {isTelugu ? 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ (AI) వినియోగ నిబంధనలు' : 'Artificial Intelligence (AI) Policy'}</span>
          </h2>
          <p>
            {isTelugu
              ? 'సన్‌రైజ్ న్యూస్‌లో ప్రచురితమయ్యే ప్రతి కథనం మానవ పాత్రికేయుల చేత పరిశీలించబడి, సంపాదక సమీక్ష పూర్తి చేసుకున్న తర్వాత మాత్రమే ప్రచురించబడుతుంది. సంపాదకీయ బాధ్యత పూర్తిగా మానవ జర్నలిస్టులదే.'
              : 'All reporting, investigative synthesis, and fact checks are conducted and verified by human reporters and editors. AI translation models serve only as assistive drafts and undergo mandatory editorial review before publication.'}
          </p>
        </section>

        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-brand-navy mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>4. {isTelugu ? 'వాణిజ్య ప్రకటనల విభజన (Commercial Separation)' : 'Separation of Editorial & Commercial Interests'}</span>
          </h2>
          <p>
            {isTelugu
              ? 'వార్తలకు మరియు ప్రకటనలకు మధ్య స్పష్టమైన విభజన ఉంటుంది. ప్రాయోజిత కంటెంట్ లేదా పెయిడ్ ఫీచర్లు స్పష్టంగా "ప్రకటన" లేదా "స్పాన్సర్డ్" అనే లేబుల్‌తో మాత్రమే ప్రచురించబడతాయి.'
              : 'Our newsroom operates with total editorial autonomy. Advertisers, commercial partners, and investors have no input into our news selection, reporting priorities, or conclusions.'}
          </p>
        </section>
      </div>
    </div>
  );
}
