'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, Menu, X, Globe, Mail, Moon, Sun, CloudSun, 
  TrendingUp, Shield, Radio, ChevronDown, UserCheck 
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Language, Category } from '@/types';
import { DashedClipIcon } from '@/components/clipper/DashedClipIcon';

interface HeaderProps {
  lang: Language;
  categories: Category[];
}

export const Header: React.FC<HeaderProps> = ({ lang, categories }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateString, setCurrentDateString] = useState('');

  // Handle language switch
  const handleLanguageSwitch = (newLang: Language) => {
    if (newLang === lang) return;
    // Replace leading /en or /te with newLang
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'te') {
      segments[1] = newLang;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLang}`);
    }
  };

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format localized date
  useEffect(() => {
    const now = new Date();
    if (lang === 'te') {
      const days = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
      const months = ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      setCurrentDateString(`${dayName}, ${now.getDate()} ${monthName} ${now.getFullYear()}`);
    } else {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setCurrentDateString(now.toLocaleDateString('en-IN', options));
    }
  }, [lang]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${lang}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Filter top navigation categories
  const mainNav = categories.filter(c => !c.parentId).slice(0, 9);

  return (
    <header className="w-full bg-white border-b border-slate-200 relative z-30">
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Date & Weather */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-slate-200">{currentDateString || '21 September 2026'}</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="hidden md:flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>Amaravati 31°C</span>
              </span>
              <span className="text-slate-600">•</span>
              <span>Hyderabad 29°C</span>
              <span className="text-slate-600">•</span>
              <span>Visakhapatnam 30°C</span>
            </div>
          </div>

          {/* Utility links & Language Switcher */}
          <div className="flex items-center gap-3">
            {/* E-Paper & Clip Tool Shortcut */}
            <Link
              href={`/${lang}/epaper`}
              className="hover:text-amber-300 flex items-center gap-1.5 font-bold text-amber-400 transition-colors"
            >
              <DashedClipIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'te' ? 'ఈ-పేపర్ & క్లిప్' : 'E-Paper & Clip'}</span>
            </Link>

            <span className="text-slate-700">|</span>

            {/* Newsroom Admin Shortcut */}
            <Link
              href="/admin/login"
              className="hover:text-white flex items-center gap-1 font-medium text-slate-300 transition-colors"
            >
              <Shield className="w-3 h-3 text-brand-orange" />
              <span>{lang === 'te' ? 'సంపాదక విభాగం (CMS)' : 'Newsroom CMS'}</span>
            </Link>

            <span className="text-slate-700">|</span>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => handleLanguageSwitch('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  lang === 'en'
                    ? 'bg-brand-orange text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('te')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  lang === 'te'
                    ? 'bg-brand-orange text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRANDING HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-slate-700 hover:text-brand-navy rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Central Brand Logo */}
        <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
          <Logo lang={lang} size="md" showTagline={true} />
        </div>

        {/* Quick action buttons (Search, Newsletter, Live) */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Live indicator badge */}
          <Link
            href={`/${lang}/live`}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-brand-red border border-red-200 hover:bg-red-100 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
            <span>{lang === 'te' ? 'లైవ్ అప్‌డేట్స్' : 'Live News'}</span>
          </Link>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-slate-600 hover:text-brand-navy hover:bg-slate-100 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
            aria-label="Search articles"
          >
            <Search className="w-5 h-5" />
            <span className="hidden md:inline text-xs font-semibold text-slate-500">
              {lang === 'te' ? 'శోధించండి' : 'Search'}
            </span>
          </button>

          {/* Newsletter Button */}
          <Link
            href={`/${lang}/newsletter`}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy-light transition-colors shadow-sm"
          >
            <Mail className="w-3.5 h-3.5 text-brand-orange" />
            <span>{lang === 'te' ? 'న్యూస్‌లెటర్' : 'Subscribe'}</span>
          </Link>
        </div>
      </div>

      {/* 3. SEARCH DROPDOWN MODAL */}
      {searchOpen && (
        <div className="border-t border-b border-slate-200 bg-slate-50 px-4 py-3 shadow-inner">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'te'
                      ? 'వార్తలు, అమరావతి, విశాఖపట్నం, హైదరాబాద్, వ్యవసాయం శోధించండి...'
                      : 'Search news, Amaravati, Visakhapatnam, Hyderabad, policy, tech...'
                  }
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white shadow-sm"
                  autoFocus
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-brand-orange-dark transition-colors"
              >
                {lang === 'te' ? 'వెతకండి' : 'Search'}
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{lang === 'te' ? 'పాపులర్:' : 'Trending:'}</span>
              <Link href={`/${lang}/search?q=Amaravati`} className="hover:text-brand-orange hover:underline">
                Amaravati
              </Link>
              <span>•</span>
              <Link href={`/${lang}/search?q=Visakhapatnam`} className="hover:text-brand-orange hover:underline">
                Visakhapatnam
              </Link>
              <span>•</span>
              <Link href={`/${lang}/search?q=Polavaram`} className="hover:text-brand-orange hover:underline">
                Polavaram
              </Link>
              <span>•</span>
              <Link href={`/${lang}/search?q=Agriculture`} className="hover:text-brand-orange hover:underline">
                Rythu
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRIMARY STICKY NAVIGATION BAR */}
      <nav
        className={`w-full bg-brand-navy text-white transition-all duration-200 hidden lg:block ${
          isScrolled ? 'sticky top-0 shadow-md z-40' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <ul className="flex items-center space-x-1 py-1">
            {/* Home link */}
            <li>
              <Link
                href={`/${lang}`}
                className={`px-3 py-2 rounded text-sm font-semibold hover:bg-brand-navy-light transition-colors block ${
                  pathname === `/${lang}` ? 'bg-brand-orange text-white' : 'text-slate-100'
                }`}
              >
                {lang === 'te' ? 'ముఖ్యాంశాలు' : 'Home'}
              </Link>
            </li>

            {/* Dynamic category tabs */}
            {mainNav.map((cat) => {
              const catUrl = `/${lang}/category/${encodeURIComponent(cat.slug)}`;
              const isActive = pathname.startsWith(catUrl);
              return (
                <li key={cat.id}>
                  <Link
                    href={catUrl}
                    className={`px-3 py-2 rounded text-sm font-medium hover:bg-brand-navy-light transition-colors block ${
                      isActive ? 'bg-brand-navy-light text-brand-orange font-semibold' : 'text-slate-200'
                    }`}
                  >
                    {lang === 'te' ? cat.nameTe : cat.nameEn}
                  </Link>
                </li>
              );
            })}

            {/* Fact Check tab */}
            <li>
              <Link
                href={`/${lang}/fact-checks`}
                className={`px-3 py-2 rounded text-sm font-medium hover:bg-brand-navy-light transition-colors flex items-center gap-1.5 ${
                  pathname.includes('/fact-checks') ? 'bg-brand-navy-light text-brand-orange font-semibold' : 'text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-brand-orange" />
                <span>{lang === 'te' ? 'ఫ్యాక్ట్ చెక్' : 'Fact Check'}</span>
              </Link>
            </li>

            {/* Multimedia tab */}
            <li>
              <Link
                href={`/${lang}/videos`}
                className={`px-3 py-2 rounded text-sm font-medium hover:bg-brand-navy-light transition-colors block ${
                  pathname.includes('/videos') ? 'bg-brand-navy-light text-brand-orange font-semibold' : 'text-slate-200'
                }`}
              >
                {lang === 'te' ? 'వీడియోలు' : 'Videos'}
              </Link>
            </li>

            {/* Photos tab */}
            <li>
              <Link
                href={`/${lang}/photos`}
                className={`px-3 py-2 rounded text-sm font-medium hover:bg-brand-navy-light transition-colors block ${
                  pathname.includes('/photos') ? 'bg-brand-navy-light text-brand-orange font-semibold' : 'text-slate-200'
                }`}
              >
                {lang === 'te' ? 'ఫోటోలు' : 'Photos'}
              </Link>
            </li>

            {/* E-Paper & News Clipper Tab */}
            <li>
              <Link
                href={`/${lang}/epaper`}
                className={`px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.includes('/epaper') ? 'bg-[#990000] text-white shadow' : 'text-amber-300 hover:text-white hover:bg-brand-navy-light'
                }`}
              >
                <DashedClipIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'te' ? 'ఈ-పేపర్' : 'E-Paper'}</span>
              </Link>
            </li>
          </ul>

          {/* Quick Trending Link on the right */}
          <Link
            href={`/${lang}/trending`}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-white transition-colors py-2 px-2 rounded hover:bg-brand-navy-light"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'ట్రెండింగ్ న్యూస్' : 'Trending'}</span>
          </Link>
        </div>
      </nav>

      {/* 5. MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full shadow-2xl z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <Logo lang={lang} size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Switcher in Mobile */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {lang === 'te' ? 'భాషను ఎంచుకోండి:' : 'Select Language:'}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    handleLanguageSwitch('en');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    lang === 'en' ? 'bg-brand-orange text-white' : 'bg-white text-slate-700 border'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleLanguageSwitch('te');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold ${
                    lang === 'te' ? 'bg-brand-orange text-white' : 'bg-white text-slate-700 border'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            {/* Navigation links */}
            <div className="p-4 space-y-1">
              <Link
                href={`/${lang}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                {lang === 'te' ? 'ముఖ్యాంశాలు (Home)' : 'Home'}
              </Link>
              <Link
                href={`/${lang}/latest`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                {lang === 'te' ? 'తాజా వార్తలు (Latest)' : 'Latest News'}
              </Link>
              <Link
                href={`/${lang}/trending`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                {lang === 'te' ? 'ట్రెండింగ్ కథనాలు' : 'Trending News'}
              </Link>
              <Link
                href={`/${lang}/fact-checks`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                {lang === 'te' ? 'నిజనిర్ధారణ (Fact Checks)' : 'Fact Checks'}
              </Link>
              <Link
                href={`/${lang}/epaper`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold text-red-800 bg-red-50 hover:bg-red-100"
              >
                <DashedClipIcon className="w-4 h-4 text-red-700" />
                <span>{lang === 'te' ? 'ఈ-పేపర్ & క్లిప్పింగ్ టూల్' : 'E-Paper & News Clipper'}</span>
              </Link>

              <div className="pt-2 pb-1 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
                  {lang === 'te' ? 'విభాగాలు' : 'Categories'}
                </span>
              </div>

              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${lang}/category/${encodeURIComponent(cat.slug)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  {lang === 'te' ? cat.nameTe : cat.nameEn}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-200 space-y-1">
                <Link
                  href={`/${lang}/editorial-standards`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  {lang === 'te' ? 'సంపాదకీయ ప్రమాణాలు' : 'Editorial Standards'}
                </Link>
                <Link
                  href={`/${lang}/corrections`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  {lang === 'te' ? 'సవరణల నివేదిక' : 'Corrections & Updates'}
                </Link>
                <Link
                  href={`/${lang}/contact`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  {lang === 'te' ? 'సంప్రదించండి' : 'Contact Us'}
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-1.5 text-xs font-semibold text-brand-orange"
                >
                  {lang === 'te' ? 'సంపాదక విభాగం (CMS లాగిన్)' : 'Newsroom CMS Portal'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
