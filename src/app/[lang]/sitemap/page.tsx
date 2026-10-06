import React from 'react';
import Link from 'next/link';
import { Network, ExternalLink } from 'lucide-react';
import { getCategories, getArticles } from '@/lib/db';
import { Language } from '@/types';

export default function HtmlSitemapPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const categories = getCategories();
  const { articles } = getArticles({ status: 'published' });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b-2 border-brand-navy pb-4">
        <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-1">
          <Network className="w-4 h-4" />
          <span>INDEX & ARCHIVE</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-navy">
          {isTelugu ? 'సన్‌రైజ్ న్యూస్ సైట్‌మ్యాప్' : 'Sunrise News Complete Website Directory'}
        </h1>
        <p className="text-slate-600 text-xs mt-1">
          Comprehensive structured navigation index for human readers and search crawlers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-xs">
        {/* Core & Sections */}
        <div className="space-y-3">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b pb-1">
            {isTelugu ? 'ప్రధాన విభాగాలు' : 'Main Sections'}
          </h2>
          <ul className="space-y-1.5 text-slate-600">
            <li><Link href={`/${lang}`} className="hover:text-brand-orange font-semibold">Home</Link></li>
            <li><Link href={`/${lang}/latest`} className="hover:text-brand-orange font-semibold">Latest News</Link></li>
            <li><Link href={`/${lang}/trending`} className="hover:text-brand-orange font-semibold">Trending News</Link></li>
            <li><Link href={`/${lang}/top-stories`} className="hover:text-brand-orange font-semibold">Top Stories</Link></li>
            <li><Link href={`/${lang}/breaking`} className="hover:text-brand-orange font-semibold">Breaking News</Link></li>
            <li><Link href={`/${lang}/search`} className="hover:text-brand-orange font-semibold">Search Portal</Link></li>
          </ul>

          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b pb-1 pt-4">
            {isTelugu ? 'విషయ విభాగాలు' : 'Categories'}
          </h2>
          <ul className="space-y-1.5 text-slate-600">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/${lang}/category/${c.slug}`} className="hover:text-brand-orange">
                  {isTelugu ? c.nameTe : c.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Editorial & Trust */}
        <div className="space-y-3">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b pb-1">
            {isTelugu ? 'సంపాదకీయ విశ్వసనీయత' : 'Editorial & Trust'}
          </h2>
          <ul className="space-y-1.5 text-slate-600">
            <li><Link href={`/${lang}/editorial-opinion`} className="hover:text-brand-orange">Editorial & Opinion</Link></li>
            <li><Link href={`/${lang}/special-reports`} className="hover:text-brand-orange">Special Reports</Link></li>
            <li><Link href={`/${lang}/investigations`} className="hover:text-brand-orange">Investigative Reporting</Link></li>
            <li><Link href={`/${lang}/explainers`} className="hover:text-brand-orange">News Explainers</Link></li>
            <li><Link href={`/${lang}/fact-checks`} className="hover:text-brand-orange font-semibold text-brand-red">Fact Check Desk</Link></li>
            <li><Link href={`/${lang}/corrections`} className="hover:text-brand-orange">Corrections & Updates</Link></li>
            <li><Link href={`/${lang}/authors`} className="hover:text-brand-orange">Authors & Reporters</Link></li>
            <li><Link href={`/${lang}/editorial-standards`} className="hover:text-brand-orange">Editorial Standards</Link></li>
            <li><Link href={`/${lang}/corrections-policy`} className="hover:text-brand-orange">Corrections Policy</Link></li>
            <li><Link href={`/${lang}/ethics-transparency`} className="hover:text-brand-orange">Ethics & Transparency</Link></li>
          </ul>

          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b pb-1 pt-4">
            {isTelugu ? 'మల్టీమీడియా' : 'Multimedia Hub'}
          </h2>
          <ul className="space-y-1.5 text-slate-600">
            <li><Link href={`/${lang}/videos`} className="hover:text-brand-orange">Video Bulletins</Link></li>
            <li><Link href={`/${lang}/photos`} className="hover:text-brand-orange">Photo Essays</Link></li>
            <li><Link href={`/${lang}/infographics`} className="hover:text-brand-orange">Data Infographics</Link></li>
            <li><Link href={`/${lang}/podcasts`} className="hover:text-brand-orange">Podcasts & Audio</Link></li>
            <li><Link href={`/${lang}/live`} className="hover:text-brand-orange">Live Updates</Link></li>
          </ul>
        </div>

        {/* Audience & Legal */}
        <div className="space-y-3">
          <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider border-b pb-1">
            {isTelugu ? 'సంస్థ & పాలన' : 'Institutional & Legal'}
          </h2>
          <ul className="space-y-1.5 text-slate-600">
            <li><Link href={`/${lang}/about`} className="hover:text-brand-orange">About Us</Link></li>
            <li><Link href={`/${lang}/contact`} className="hover:text-brand-orange">Contact Us & Bureaus</Link></li>
            <li><Link href={`/${lang}/advertise`} className="hover:text-brand-orange">Advertise & Media Kit</Link></li>
            <li><Link href={`/${lang}/newsletter`} className="hover:text-brand-orange">Newsletter Subscriptions</Link></li>
            <li><Link href={`/${lang}/privacy`} className="hover:text-brand-orange">Privacy Policy (DPDP)</Link></li>
            <li><Link href={`/${lang}/terms`} className="hover:text-brand-orange">Terms and Conditions</Link></li>
            <li><Link href={`/${lang}/cookie-policy`} className="hover:text-brand-orange">Cookie Policy</Link></li>
            <li><Link href={`/${lang}/accessibility`} className="hover:text-brand-orange">Accessibility Statement</Link></li>
            <li><a href="/sitemap.xml" className="text-brand-orange font-bold flex items-center gap-1"><span>XML Sitemap</span><ExternalLink className="w-3 h-3" /></a></li>
            <li><a href="/news-sitemap.xml" className="text-brand-orange font-bold flex items-center gap-1"><span>Google News Sitemap</span><ExternalLink className="w-3 h-3" /></a></li>
            <li><a href="/robots.txt" className="text-slate-500 flex items-center gap-1"><span>Robots.txt</span><ExternalLink className="w-3 h-3" /></a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
