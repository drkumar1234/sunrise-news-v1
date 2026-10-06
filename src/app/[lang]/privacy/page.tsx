import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { Language } from '@/types';

export default function PrivacyPolicyPage({
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
          <Lock className="w-4 h-4" />
          <span>{isTelugu ? 'డేటా రక్షణ' : 'DPDP ACT COMPLIANCE'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ న్యూస్ గోప్యతా విధానం (Privacy Policy)' : 'Sunrise News Privacy Policy'}
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Last Updated: 21 September 2026 • Compliant with Digital Personal Data Protection Act, 2023 (India)
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
        <section className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-2">1. Information Collection & Usage</h2>
          <p className="text-xs text-slate-600">
            SUNRISE NEWS collects minimal personal information necessary to deliver newsletter subscriptions, process reader comments, and ensure technical website security. We do not sell, rent, or trade reader personal identities to third-party data brokers.
          </p>
        </section>

        <section className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-2">2. Reader Consent & Unsubscribe Rights</h2>
          <p className="text-xs text-slate-600">
            Newsletter subscribers may withdraw their consent at any time via the one-click unsubscribe mechanism attached to every dispatch. Upon withdrawal, your email address is purged from active dispatch queues.
          </p>
        </section>

        <section className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-2">3. Data Protection Officer</h2>
          <p className="text-xs text-slate-600">
            For inquiries regarding personal data records or to exercise your rights under the Indian DPDP Act, contact our Data Grievance Officer: grievance@sunrisenews.in.
          </p>
        </section>
      </div>
    </div>
  );
}
