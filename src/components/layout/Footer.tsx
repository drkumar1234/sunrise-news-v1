'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ShieldCheck, MapPin, Phone, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Language, Category, EditorialSettings } from '@/types';

interface FooterProps {
  lang: Language;
  categories: Category[];
  settings: EditorialSettings;
}

export const Footer: React.FC<FooterProps> = ({ lang, categories, settings }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    setSubscribeError(false);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: lang, editions: ['morning_briefing'] }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        setSubscribeError(true);
      }
    } catch {
      setSubscribeError(true);
    } finally {
      setLoading(false);
    }
  };

  const isTelugu = lang === 'te';

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* 1. TOP NEWSLETTER STRIP */}
      <div className="bg-brand-navy border-b border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-orange" />
              <span>{isTelugu ? 'సన్‌రైజ్ న్యూస్ మార్నింగ్ బ్రీఫింగ్' : 'Sunrise News Morning Briefing'}</span>
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {isTelugu
                ? 'తెలుగు రాష్ట్రాల రాజకీయాలు, అమరావతి, హైదరాబాద్ వార్తలు ప్రతిరోజూ ఉదయం మీ ఈమెయిల్‌లో నేరుగా పొందండి.'
                : 'Curated journalism from Andhra Pradesh, Telangana, national policy, and business delivered to your inbox daily.'}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-4 py-2 rounded-lg text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isTelugu ? 'సభ్యత్వం నమోదైంది! ధన్యవాదాలు.' : 'Subscription saved. Thank you!'}</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isTelugu ? 'మీ ఈమెయిల్ అడ్రస్' : 'Enter your email address'}
                  required
                  className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-orange w-full md:w-72"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-lg text-sm font-semibold whitespace-nowrap transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? '...' : isTelugu ? 'చందా చేరండి' : 'Subscribe'}
                </button>
              </>
            )}
          </form>
          {subscribeError && <p role="alert" className="text-sm text-red-200">{isTelugu ? 'సభ్యత్వం నమోదు కాలేదు. మళ్లీ ప్రయత్నించండి.' : 'Subscription could not be saved. Please try again.'}</p>}
        </div>
      </div>

      {/* 2. MAIN FOOTER DIRECTORY (4 Columns) */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
        {/* Col 1: Brand & Tagline */}
        <div className="lg:col-span-2 space-y-4">
          <Logo variant="light" lang={lang} size="md" showTagline={true} />
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            {isTelugu
              ? 'సన్‌రైజ్ న్యూస్ — ఆంధ్రప్రదేశ్, తెలంగాణ మరియు భారతదేశ సమగ్ర వార్తలను నిష్పక్షపాతంగా, బాధ్యతాయుతంగా అందించే స్వతంత్ర డిజిటల్ వార్తా వేదిక.'
              : 'SUNRISE NEWS is an independent, non-partisan digital journalism platform committed to public-interest reporting across Andhra Pradesh, Telangana, and the nation.'}
          </p>

          <div className="pt-2 text-xs space-y-2 text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
              <span>{settings.addressAmaravati}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>{settings.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>{settings.contactEmail}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Regional Bureaus & Sections */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
            {isTelugu ? 'ప్రాంతీయ విభాగాలు' : 'Regional Sections'}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href={`/${lang}/category/andhra-pradesh`} className="hover:text-white transition-colors">
                {isTelugu ? 'ఆంధ్రప్రదేశ్ వార్తలు' : 'Andhra Pradesh News'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/category/telangana`} className="hover:text-white transition-colors">
                {isTelugu ? 'తెలంగాణ & హైదరాబాద్' : 'Telangana & Hyderabad'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/category/amaravati`} className="hover:text-white transition-colors">
                {isTelugu ? 'అమరావతి నిర్మాణం' : 'Amaravati Capital Zone'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/category/visakhapatnam`} className="hover:text-white transition-colors">
                {isTelugu ? 'విశాఖపట్నం పోర్ట్ & ఐటీ' : 'Visakhapatnam IT & Port'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/category/india`} className="hover:text-white transition-colors">
                {isTelugu ? 'జాతీయం (India)' : 'National Politics'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/category/agriculture`} className="hover:text-white transition-colors">
                {isTelugu ? 'రైతు & వ్యవసాయం' : 'Agriculture & Irrigation'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Editorial Trust & Standards */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
            {isTelugu ? 'సంపాదకీయ విశ్వసనీయత' : 'Editorial Trust'}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href={`/${lang}/editorial-standards`} className="hover:text-white transition-colors">
                {isTelugu ? 'సంపాదకీయ ప్రమాణాలు' : 'Editorial Standards & Charter'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/fact-checks`} className="hover:text-white transition-colors flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
                <span>{isTelugu ? 'నిజనిర్ధారణ డెస్క్' : 'Fact Check Desk'}</span>
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/corrections`} className="hover:text-white transition-colors">
                {isTelugu ? 'సవరణల నివేదిక' : 'Corrections & Updates Policy'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/ethics-transparency`} className="hover:text-white transition-colors">
                {isTelugu ? 'నైతిక విలువలు & పారదర్శకత' : 'Ethics & Transparency'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/authors`} className="hover:text-white transition-colors">
                {isTelugu ? 'రిపోర్టర్లు & సంపాదకులు' : 'Authors & Journalists'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/investigations`} className="hover:text-white transition-colors">
                {isTelugu ? 'పరిశోధనాత్మక కథనాలు' : 'Investigations'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Grievance & Legal */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
            {isTelugu ? 'చట్టబద్ధ పాలన' : 'Legal & Governance'}
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href={`/${lang}/epaper`} className="text-amber-400 hover:text-white font-semibold transition-colors flex items-center gap-1">
                <span>{isTelugu ? 'ఈ-పేపర్ & క్లిప్పింగ్ టూల్' : 'E-Paper & News Clipper'}</span>
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/about`} className="hover:text-white transition-colors">
                {isTelugu ? 'మా గురించి' : 'About Sunrise News'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/contact`} className="hover:text-white transition-colors">
                {isTelugu ? 'సంప్రదించండి' : 'Contact Newsroom'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/advertise`} className="hover:text-white transition-colors">
                {isTelugu ? 'ప్రకటనల విభాగం' : 'Advertise With Us'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">
                {isTelugu ? 'గోప్యతా విధానం (DPDP)' : 'Privacy Policy (DPDP)'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/terms`} className="hover:text-white transition-colors">
                {isTelugu ? 'నిబంధనలు & షరతులు' : 'Terms & Conditions'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/accessibility`} className="hover:text-white transition-colors">
                {isTelugu ? 'యాక్సెసిబిలిటీ నివేదిక' : 'Accessibility Statement'}
              </Link>
            </li>
            <li>
              <Link href={`/${lang}/sitemap`} className="hover:text-white transition-colors">
                {isTelugu ? 'సైట్‌మ్యాప్' : 'HTML & XML Sitemap'}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. GRIEVANCE REDRESSAL COMPLIANCE (Indian IT Rules 2021) */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-slate-300">Grievance Redressal (Rule 11 of IT Rules, 2021): </span>
          <span>{settings.grievanceOfficerName} • Email: sunrisenews369@gmail.com</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sitemap.xml" className="hover:text-white flex items-center gap-1">
            <span>Sitemap.xml</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link href="/news-sitemap.xml" className="hover:text-white flex items-center gap-1">
            <span>Google News Sitemap</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 4. COPYRIGHT */}
      <div className="bg-black py-4 px-4 text-center text-xs text-slate-500 border-t border-slate-900">
        <p>
          © {new Date().getFullYear()} SUNRISE NEWS Onbehalf of Sharon Media Publications. All Rights Reserved.
          {isTelugu ? ' సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.' : ' Published under Press Council of India standards.'}
        </p>
      </div>
    </footer>
  );
};
