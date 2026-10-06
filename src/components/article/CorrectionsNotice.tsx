import React from 'react';
import { AlertCircle, History as HistoryIcon } from 'lucide-react';
import { CorrectionNotice, Language } from '@/types';

interface CorrectionsNoticeProps {
  corrections: CorrectionNotice[];
  lang: Language;
}

export const CorrectionsNotice: React.FC<CorrectionsNoticeProps> = ({ corrections, lang }) => {
  if (!corrections || corrections.length === 0) return null;

  const isTelugu = lang === 'te';

  return (
    <aside className="my-6 p-5 rounded-lg border-l-4 border-brand-orange bg-amber-50/50 text-slate-800 shadow-sm">
      <div className="flex items-center gap-2 text-brand-orange-dark font-bold text-sm mb-3">
        <HistoryIcon className="w-4 h-4" />
        <span>{isTelugu ? 'పారదర్శక సవరణల నివేదిక (Corrections & Clarifications)' : 'CORRECTIONS & UPDATES NOTICE'}</span>
      </div>

      <div className="space-y-4">
        {corrections.map((corr) => {
          const formattedDate = new Date(corr.date).toLocaleDateString(
            isTelugu ? 'te-IN' : 'en-IN',
            { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
          );

          return (
            <div key={corr.id} className="text-xs space-y-1.5 border-b border-amber-200/60 pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between text-slate-500 font-medium">
                <span>{isTelugu ? 'సవరించిన తేదీ: ' : 'Amended: '} {formattedDate}</span>
                <span>{isTelugu ? 'బాధ్యతాయుత సంపాదకులు: ' : 'Editor: '} {corr.editorName}</span>
              </div>

              <div className="text-slate-700">
                <span className="font-semibold text-slate-900">{isTelugu ? 'సవరణ కారణం: ' : 'Reason: '}</span>
                <span>{corr.reason}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 bg-white/80 p-2.5 rounded border border-amber-200">
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase block">{isTelugu ? 'పూర్వపు పాఠం' : 'Original Text:'}</span>
                  <span className="line-through text-slate-500 italic">"{corr.originalText}"</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">{isTelugu ? 'సవరించిన పాఠం' : 'Amended Text:'}</span>
                  <span className="text-slate-900 font-medium">"{corr.correctedText}"</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
