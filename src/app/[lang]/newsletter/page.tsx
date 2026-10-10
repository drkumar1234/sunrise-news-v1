'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Mail, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import { Language } from '@/types';

export default function NewsletterPage() {
  const params = useParams<{ lang: string }>();
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const [email, setEmail] = useState('');
  const [morning, setMorning] = useState(true);
  const [regional, setRegional] = useState(true);
  const [sunday, setSunday] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      const editions = [];
      if (morning) editions.push('morning_briefing');
      if (regional) editions.push('ap_telangana');
      if (sunday) editions.push('sunday_special');

      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: lang, editions }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-navy text-white flex items-center justify-center mx-auto shadow-md">
          <Mail className="w-6 h-6 text-brand-orange" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ న్యూస్‌లెటర్ సబ్‌స్క్రిప్షన్' : 'Subscribe to Sunrise News Briefings'}
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
          {isTelugu
            ? 'మీ సమయానికి విలువనిస్తూ నిష్పక్షపాత వార్తా విశ్లేషణలను ఉదయం 7 గంటలకు మీ ఇన్‌బాక్స్‌లో నేరుగా అందుకోండి.'
            : 'Carefully curated regional dispatches, state governance updates, and verified news delivered to your inbox every morning.'}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">
              {isTelugu ? 'సభ్యత్వం విజయవంతంగా పూర్తయింది!' : 'You Are Successfully Subscribed!'}
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {isTelugu
                ? 'మీ ఈమెయిల్‌కు నిర్ధారణ సందేశం పంపబడింది. ప్రతి ఉదయం మా బ్రీఫింగ్ ద్వారా విశ్వసనీయ సమాచారాన్ని ఆస్వాదించండి.'
                : 'Thank you for joining our readership community. A confirmation welcome email has been dispatched.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                {isTelugu ? 'మీ ఈమెయిల్ చిరునామా:' : 'Email Address:'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            {/* Newsletter Preferences */}
            <div className="space-y-3 pt-2">
              <span className="block text-xs font-bold text-slate-700 uppercase">
                {isTelugu ? 'మీకు కావలసిన ఎడిషన్లను ఎంచుకోండి:' : 'Select Your Preferred Editions:'}
              </span>

              <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={morning}
                  onChange={(e) => setMorning(e.target.checked)}
                  className="mt-1 h-4 w-4 text-brand-orange rounded"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {isTelugu ? 'మార్నింగ్ బ్రీఫింగ్ (Daily Morning Briefing)' : 'Daily Morning Briefing (7:00 AM IST)'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isTelugu
                      ? 'రోజువారీ ముఖ్య వార్తలు, మార్కెట్లు మరియు ప్రభుత్వ ప్రధాన నిర్ణయాల సంగ్రహం.'
                      : 'Essential top 10 news summaries to start your day with clarity.'}
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regional}
                  onChange={(e) => setRegional(e.target.checked)}
                  className="mt-1 h-4 w-4 text-brand-orange rounded"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {isTelugu ? 'ఆంధ్రప్రదేశ్ & తెలంగాణ ప్రత్యేకం (Telugu States Special)' : 'AP & Telangana Regional Digest'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isTelugu
                      ? 'అమరావతి నిర్మాణం, హైదరాబాద్ ఐటీ, సాగునీరు మరియు ప్రాంతీయ రాజకీయాల లోతైన విశ్లేషణ.'
                      : 'Focused reporting on Amaravati, Hyderabad, irrigation, and district affairs.'}
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sunday}
                  onChange={(e) => setSunday(e.target.checked)}
                  className="mt-1 h-4 w-4 text-brand-orange rounded"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {isTelugu ? 'ఆదివారం ప్రత్యేక సంచిక (Sunday Longform Special)' : 'Sunday Longform & Investigations'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {isTelugu
                      ? 'సాహిత్యం, సంస్కృతి, పరిశోధనాత్మక కథనాలు మరియు సినిమా ప్రత్యేక వ్యాసాలు.'
                      : 'Deep investigative features, cultural essays, and reflective analysis.'}
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl font-bold transition-colors shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{status === 'loading' ? 'Processing...' : isTelugu ? 'సభ్యత్వం నమోదు చేసుకోండి' : 'Confirm Subscription'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              {isTelugu
                ? 'మేము మీ గోప్యతను గౌరవిస్తాము. స్పామ్ పంపబోము. ఎప్పుడైనా అన్‌సబ్‌స్క్రైబ్ చేసుకోవచ్చు.'
                : 'Zero spam. Unsubscribe with 1-click anytime in accordance with our Privacy Policy.'}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
