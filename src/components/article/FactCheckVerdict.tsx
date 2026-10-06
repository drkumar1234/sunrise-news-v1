import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { FactCheckData, Language } from '@/types';

interface FactCheckVerdictProps {
  data: FactCheckData;
  lang: Language;
}

export const FactCheckVerdict: React.FC<FactCheckVerdictProps> = ({ data, lang }) => {
  const isTelugu = lang === 'te';

  const verdictStyles = {
    True: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-500',
      text: 'text-emerald-700',
      badgeBg: 'bg-emerald-600',
      icon: CheckCircle,
    },
    'Mostly True': {
      bg: 'bg-teal-50',
      border: 'border-teal-500',
      text: 'text-teal-700',
      badgeBg: 'bg-teal-600',
      icon: ShieldCheck,
    },
    False: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      badgeBg: 'bg-red-600',
      icon: ShieldAlert,
    },
    Misleading: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      text: 'text-amber-700',
      badgeBg: 'bg-amber-600',
      icon: AlertTriangle,
    },
    Unproven: {
      bg: 'bg-slate-50',
      border: 'border-slate-500',
      text: 'text-slate-700',
      badgeBg: 'bg-slate-600',
      icon: HelpCircle,
    },
  }[data.verdict] || {
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    text: 'text-slate-700',
    badgeBg: 'bg-slate-600',
    icon: HelpCircle,
  };

  const Icon = verdictStyles.icon;
  const claimText = isTelugu && data.claimTe ? data.claimTe : data.claim;
  const verdictText = isTelugu && data.verdictTe ? data.verdictTe : data.verdict;
  const evidenceText = isTelugu && data.evidenceSummaryTe ? data.evidenceSummaryTe : data.evidenceSummary;

  return (
    <div className={`my-8 p-6 rounded-xl border-2 ${verdictStyles.border} ${verdictStyles.bg} shadow-md`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 mb-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {isTelugu ? 'సన్‌రైజ్ న్యూస్ ఫ్యాక్ట్ చెక్' : 'SUNRISE NEWS FACT-CHECK EVALUATION'}
          </span>
          <span className="text-xs text-slate-500">
            {isTelugu ? 'పరిశీలించిన తేదీ: ' : 'Review Date: '} {data.reviewDate}
          </span>
        </div>

        {/* Verdict Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-extrabold text-base shadow ${verdictStyles.badgeBg}`}>
          <Icon className="w-5 h-5" />
          <span>{isTelugu ? `తీర్పు: ${verdictText}` : `VERDICT: ${verdictText}`}</span>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <strong className="text-slate-900 font-bold block text-xs uppercase text-slate-500 mb-1">
            {isTelugu ? 'పరిశీలించిన వాదన:' : 'The Claim Under Review:'}
          </strong>
          <p className="font-semibold text-slate-900 text-base italic bg-white/70 p-3 rounded border border-slate-200">
            "{claimText}"
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {isTelugu ? 'ప్రచారం చేసిన మూలం: ' : 'Claimed By / Origin: '} {data.claimedBy}
          </span>
        </div>

        <div className="pt-2">
          <strong className="text-slate-900 font-bold block text-xs uppercase text-slate-500 mb-1">
            {isTelugu ? 'నిజనిర్ధారణ ఆధారాలు & వాస్తవాలు:' : 'Evidence & Editorial Finding:'}
          </strong>
          <p className="text-slate-800 leading-relaxed">
            {evidenceText}
          </p>
        </div>
      </div>
    </div>
  );
};
