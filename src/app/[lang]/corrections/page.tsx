import React from 'react';
import Link from 'next/link';
import { History as HistoryIcon, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { getArticles } from '@/lib/public-articles';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function CorrectionsLogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const { articles } = await getArticles({ status: 'published' });
  const articlesWithCorrections = articles.filter(a => a.corrections && a.corrections.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <HistoryIcon className="w-4 h-4" />
          <span>{isTelugu ? 'పారదర్శకత' : 'EDITORIAL INTEGRITY & ACCOUNTABILITY'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సవరణలు మరియు నవీకరణల నివేదిక' : 'Corrections & Clarifications Log'}
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          {isTelugu
            ? 'సన్‌రైజ్ న్యూస్ ఎడిటోరియల్ పాలసీ ప్రకారం వాస్తవపరమైన దోషాలను ఎట్టి పరిస్థితుల్లోనూ గోప్యంగా మార్చబోము. ప్రతి సవరణను సమయం, తేదీ, మార్పు వివరాలు మరియు బాధ్యతాయుత సంపాదకుడి పేరుతో సహా ఇక్కడ పారదర్శకంగా నమోదు చేస్తాము.'
            : 'At SUNRISE NEWS, we hold ourselves accountable to the highest factual rigor. Material errors are never silently altered. When a factual inaccuracy is identified, we promptly append a public notice specifying what was amended, when, and who reviewed it.'}
        </p>
      </div>

      {/* Trust Commitment Box */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-6 text-xs text-slate-700 space-y-2">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isTelugu ? 'మా సవరణ విధానం (Our Standard Protocol)' : 'Our Transparent Correction Protocol'}</span>
        </h3>
        <p>
          {isTelugu
            ? '1. చిన్న అక్షరదోషాలు మినహా, అర్థాన్ని మార్చే ప్రతి మార్పుకు వ్యాసంలో స్పష్టమైన సవరణ నోటీస్ జోడించబడుతుంది.'
            : '1. Material factual corrections are clearly flagged at the top or bottom of the amended article.'}
        </p>
        <p>
          {isTelugu
            ? '2. పూర్వపు పాఠం (Original Text) మరియు సవరించిన పాఠం (Amended Text) రెండింటినీ భద్రపరుస్తాము.'
            : '2. Both the original text and corrected language are maintained in our public record.'}
        </p>
        <p>
          {isTelugu
            ? '3. పాఠకులు ఎవరైనా దోషాన్ని గమనిస్తే grievance@sunrisenews.in కు లేదా కథనం దిగువన ఉన్న రిపోర్ట్ బటన్ ద్వారా నివేదించవచ్చు.'
            : '3. Readers may report any suspected inaccuracies directly via our "Report Error" feature on every story or via grievance@sunrisenews.in.'}
        </p>
      </div>

      {/* List of Corrections */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          {isTelugu ? 'ఇటీవలి సవరణల జాబితా' : 'Recent Editorial Corrections'}
        </h2>

        {articlesWithCorrections.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border">
            <p className="text-slate-500 text-sm">
              {isTelugu ? 'ప్రస్తుతం ఎటువంటి సవరణల నివేదికలు లేవు.' : 'No active corrections recorded at this time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {articlesWithCorrections.map((art) => {
              const headline = isTelugu && art.headlineTe ? art.headlineTe : art.headline;

              return (
                <div
                  key={art.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <Link
                      href={`/${lang}/article/${encodeURIComponent(art.slug)}`}
                      className="text-base font-bold text-slate-900 hover:text-brand-orange transition-colors flex items-center gap-1.5"
                    >
                      <span>{headline}</span>
                      <ChevronRight className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    </Link>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {isTelugu ? 'కథనం ప్రచురణ: ' : 'Originally Published: '} {new Date(art.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {art.corrections?.map((corr) => (
                    <div key={corr.id} className="text-xs space-y-2 bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-brand-orange">
                          {isTelugu ? 'సవరణ సమయం: ' : 'Amended: '} {new Date(corr.date).toLocaleDateString()}
                        </span>
                        <span>{isTelugu ? 'సమీక్షించిన ఎడిటర్: ' : 'Editor: '} {corr.editorName}</span>
                      </div>
                      <p className="text-slate-800">
                        <strong className="text-slate-900">{isTelugu ? 'కారణం: ' : 'Reason for update: '}</strong>
                        {corr.reason}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-red-50 rounded border border-red-200">
                          <span className="font-bold text-red-700 block text-[11px] mb-1">
                            {isTelugu ? 'పూర్వపు వాక్యం' : 'Original Version:'}
                          </span>
                          <span className="line-through text-slate-600 italic">"{corr.originalText}"</span>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                          <span className="font-bold text-emerald-700 block text-[11px] mb-1">
                            {isTelugu ? 'సవరించిన వాక్యం' : 'Corrected Version:'}
                          </span>
                          <span className="text-slate-900 font-medium">"{corr.correctedText}"</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
