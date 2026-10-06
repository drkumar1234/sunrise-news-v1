import React from 'react';
import Link from 'next/link';
import { History as HistoryIcon, CheckCircle, Mail } from 'lucide-react';
import { Language } from '@/types';

export default function CorrectionsPolicyPage({
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
          <HistoryIcon className="w-4 h-4" />
          <span>{isTelugu ? 'పారదర్శక విధానం' : 'TRANSPARENCY POLICY'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ న్యూస్ సవరణల విధానం (Corrections Policy)' : 'Formal Corrections & Updates Policy'}
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          {isTelugu
            ? 'ప్రజలకు సత్యసంధమైన వార్తలను అందించడంలో మా నిబద్ధత మరియు పొరపాట్లు దొర్లినప్పుడు మేము అనుసరించే నియమావళి.'
            : 'How Sunrise News addresses errors, appends transparent corrections, and preserves the public record.'}
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {isTelugu ? 'పొరపాట్లు జరిగినప్పుడు మా స్పందన' : 'Commitment to Prompt Correction'}
          </h2>
          <p>
            {isTelugu
              ? 'మేము అత్యంత ఖచ్చితమైన సమాచారాన్ని అందించడానికి ప్రయత్నిస్తాము. అయినప్పటికీ వాస్తవాల్లో ఏదైనా పొరపాటు ఉన్నట్లు నిర్ధారణ అయితే, వెంటనే ఆ కథనంలో స్పష్టమైన సవరణ నోటీసును ప్రచురిస్తాము.'
              : 'When an error of fact is verified, we amend the story immediately and append a formal correction note stating the date, original phrase, amended text, and the responsible editor.'}
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {isTelugu ? 'రహస్య మార్పులకు తావులేదు (No Stealth Edits)' : 'Strict Anti-Stealth Editing Rule'}
          </h2>
          <p>
            {isTelugu
              ? 'సాధారణ అక్షరదోషాలు మినహా కథనం యొక్క అర్థాన్ని లేదా సారాంశాన్ని ప్రభావితం చేసే ఏ మార్పునూ రహస్యంగా చేయము. పూర్వపు పాఠం మరియు సవరించిన పాఠం రెండూ ఆర్కైవ్‌లో భద్రపరచబడతాయి.'
              : 'Material factual changes will never be made quietly without an accompanying editor note. Readers have the right to know what was altered and why.'}
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {isTelugu ? 'దోషాలను పాఠకులు ఎలా నివేదించవచ్చు?' : 'How Readers Can Submit Corrections'}
          </h2>
          <p>
            {isTelugu
              ? 'ప్రతి కథనం కింద ఉన్న "సవరణ నివేదించండి" బటన్ ద్వారా లేదా corrections@sunrisenews.in ద్వారా మీరు ఆధారాలతో కూడిన వివరాలను పంపవచ్చు. మా ఫ్యాక్ట్-చెక్ మరియు ఎడిటోరియల్ డెస్క్ 24 గంటలలోపు పరిశీలిస్తుంది.'
              : 'Readers are encouraged to submit factual corrections with supporting documentation via the "Report Error" feature on the article page or by emailing corrections@sunrisenews.in.'}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <Link
            href={`/${lang}/corrections`}
            className="px-5 py-2.5 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold rounded-lg transition-colors shadow"
          >
            {isTelugu ? 'ప్రజా సవరణల రిజిస్టర్ చూడండి' : 'View Public Corrections Log'}
          </Link>
        </div>
      </div>
    </div>
  );
}
