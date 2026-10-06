import React from 'react';
import { Scale, FileText } from 'lucide-react';
import { Language } from '@/types';

export default function TermsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" />
          <span>LEGAL TERMS</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'నిబంధనలు మరియు షరతులు (Terms & Conditions)' : 'Terms & Conditions of Service'}
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Governed under the laws of the Republic of India • Jurisdiction: Amaravati & Hyderabad
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
        <section className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Intellectual Property & Fair Use</h2>
          <p className="text-xs text-slate-600">
            All text, photographs, graphic elements, videos, and layout systems published on SUNRISE NEWS are the exclusive property of Sunrise News Digital Media Pvt Ltd or used under explicit license. Brief journalistic quotes are permitted under fair use doctrine with mandatory canonical backlink attribution.
          </p>
        </section>

        <section className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Reader Conduct & Moderation</h2>
          <p className="text-xs text-slate-600">
            Submissions to public discussion spaces must remain respectful and lawful. Defamatory statements, hate speech, unlawful incitement, or unsolicited advertising will be rejected during editorial pre-moderation.
          </p>
        </section>
      </div>
    </div>
  );
}
