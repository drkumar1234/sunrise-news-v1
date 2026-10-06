import React from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import { Language } from '@/types';

export default function AccessibilityStatementPage({
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
          <Eye className="w-4 h-4" />
          <span>INCLUSIVITY & STANDARDS</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'యాక్సెసిబిలిటీ నివేదిక' : 'Website Accessibility Statement (WCAG 2.1 AA)'}
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Committed to inclusive digital journalism for all readers regardless of physical ability or device.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
        <section className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">Accessibility Features Implemented:</h2>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li><strong>High Contrast Typography</strong>: WCAG 2.1 AA compliant contrast ratios across navy, orange, and white surfaces.</li>
            <li><strong>Keyboard Navigation</strong>: Full tab order, visible focus rings, and skip-to-content links.</li>
            <li><strong>Screen Reader Semantic Landmarks</strong>: Proper ARIA roles, descriptive alt attributes on all editorial images.</li>
            <li><strong>Customizable Font Scaling</strong>: In-article font adjustment buttons (A-, A, A+, A++) for low-vision readers.</li>
            <li><strong>Reduced Motion Support</strong>: Automated tickers and animations respect the user’s OS-level `prefers-reduced-motion` settings.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
