'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock, MapPin, ChevronRight, ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Article, Category, Author, AdPlacement, Language } from '@/types';
import { ReaderTools } from '@/components/article/ReaderTools';
import { ArticleBody } from '@/components/article/ArticleBody';
import { FactCheckVerdict } from '@/components/article/FactCheckVerdict';
import { CorrectionsNotice } from '@/components/article/CorrectionsNotice';
import { NewsCard } from '@/components/article/NewsCard';
import { AuthorAvatar } from '@/components/article/AuthorAvatar';
import { AdBanner } from '@/components/ui/AdBanner';
import { serializeJsonLd, safeUrl } from '@/lib/content-safety';

interface ArticleViewClientProps {
  article: Article;
  category?: Category;
  author?: Author;
  relatedArticles: Article[];
  sidebarAd?: AdPlacement;
  midArticleAd?: AdPlacement;
  lang: Language;
  siteUrl: string;
}

export function ArticleViewClient({
  article,
  category,
  author,
  relatedArticles,
  sidebarAd,
  midArticleAd,
  lang,
  siteUrl,
}: ArticleViewClientProps) {
  const isTelugu = lang === 'te';

  // State for reader tools font size
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  const headline = isTelugu && article.headlineTe ? article.headlineTe : article.headline;
  const summary = isTelugu && article.summaryTe ? article.summaryTe : article.summary;
  const location = isTelugu && article.locationTe ? article.locationTe : article.location;
  const authorName = author ? (isTelugu && author.nameTe ? author.nameTe : author.name) : 'Staff Reporter';
  const authorBio = author ? (isTelugu && author.bioTe ? author.bioTe : author.bioEn).trim() : '';
  const authorRole = author ? (isTelugu && author.roleTe ? author.roleTe : author.role).trim() : '';
  const reportingBeats = author?.reportingBeats.filter(beat => beat.trim()) ?? [];
  const catName = category ? (isTelugu ? category.nameTe : category.nameEn) : 'News';

  const publishedDateFormatted = new Date(article.publishedAt).toLocaleDateString(
    isTelugu ? 'te-IN' : 'en-IN',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }
  );

  const updatedDateFormatted = new Date(article.updatedAt).toLocaleDateString(
    isTelugu ? 'te-IN' : 'en-IN',
    { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }
  );

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${lang}/article/${encodeURIComponent(article.slug)}`,
    },
    headline: headline,
    image: [article.featuredImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${siteUrl}/${lang}/authors/${encodeURIComponent(author?.slug || 'editorial')}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sunrise News',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    description: summary,
    articleSection: catName,
  };

  return (
    <article className="max-w-7xl mx-auto px-4 py-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href={`/${lang}`} className="hover:text-brand-orange">
          {isTelugu ? 'ముఖ్యాంశాలు' : 'Home'}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        {category && (
          <>
            <Link href={`/${lang}/category/${encodeURIComponent(category.slug)}`} className="hover:text-brand-orange font-medium">
              {catName}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </>
        )}
        <span className="text-slate-400 truncate max-w-xs md:max-w-md">{headline}</span>
      </nav>

      {/* 2. ARTICLE HEADER SECTION */}
      <header className="max-w-4xl mb-6">
        {/* Category & Location Badges */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {category && (
            <Link
              href={`/${lang}/category/${encodeURIComponent(category.slug)}`}
              className="px-3 py-1 rounded-full bg-brand-navy text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-navy-light transition-colors"
            >
              {catName}
            </Link>
          )}
          <span className="flex items-center gap-1 text-slate-600 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
            <span>{location}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 text-xs flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readingTimeMinutes} {isTelugu ? 'నిమిషాల పఠనం' : 'min read'}</span>
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl font-black text-slate-950 leading-tight tracking-tight mb-4">
          {headline}
        </h1>

        {/* Summary / Subheadline */}
        {summary && (
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-serif mb-6">
            {summary}
          </p>
        )}

        {/* Author & Timestamp Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-600 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {author && (
              <AuthorAvatar
                author={author}
                lang={lang}
                className="w-11 h-11 border border-slate-300 shadow-sm"
              />
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm">{authorName}</span>
                {author?.verified && (
                  <ShieldCheck className="w-4 h-4 text-brand-orange fill-current text-white" />
                )}
              </div>
              {authorRole && <span className="text-slate-500 block">{authorRole}</span>}
            </div>
          </div>

          <div className="text-right text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">{isTelugu ? 'ప్రచురణ: ' : 'Published: '}</span>
              <span>{publishedDateFormatted}</span>
            </div>
            {article.updatedAt !== article.publishedAt && (
              <div className="text-[11px] text-brand-orange mt-0.5">
                <span>{isTelugu ? 'నవీకరించబడింది: ' : 'Updated: '}</span>
                <span>{updatedDateFormatted}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. FEATURED IMAGE WITH CAPTION & CREDIT */}
      <figure className="max-w-5xl mb-8 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
        <img
          src={safeUrl(article.featuredImage, '/brand/sunrise-news-logo.jpg')}
          alt={headline}
          className="w-full aspect-[16/9] object-cover"
        />
        {(article.imageCaption || article.imageCredit) && (
          <figcaption className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>{article.imageCaption}</span>
            {article.imageCredit && (
              <span className="text-slate-400 font-medium whitespace-nowrap">
                {isTelugu ? 'ఫోటో సౌజన్యం: ' : 'Credit: '} {article.imageCredit}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      {/* 4. MAIN ARTICLE CONTENT & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8">
          {/* Interactive Reader Tools with News Clipper */}
          <ReaderTools
            headline={headline}
            articleUrl={`${siteUrl}/${lang}/article/${encodeURIComponent(article.slug)}`}
            lang={lang}
            onFontSizeChange={(size) => setFontSize(size)}
            summary={summary}
            body={isTelugu && article.bodyTe ? article.bodyTe : article.body}
            featuredImage={article.featuredImage}
            imageCaption={article.imageCaption}
            categoryName={catName}
            authorName={authorName}
            location={location}
          />

          {/* Fact Check Box if applicable */}
          {article.factCheck && (
            <FactCheckVerdict data={article.factCheck} lang={lang} />
          )}

          {/* Corrections Notice if applicable */}
          {article.corrections && article.corrections.length > 0 && (
            <CorrectionsNotice corrections={article.corrections} lang={lang} />
          )}

          {/* Article Formatted Body */}
          <ArticleBody article={article} lang={lang} fontSize={fontSize} />

          {/* Tags Cloud */}
          {article.tags && article.tags.length > 0 && (
            <div className="my-8 pt-6 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                {isTelugu ? 'సంబంధిత విషయ సూచిక (Tags):' : 'Related Topics & Tags:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tagSlug) => (
                  <Link
                    key={tagSlug}
                    href={`/${lang}/search?tag=${encodeURIComponent(tagSlug)}`}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-brand-navy hover:text-white text-slate-700 text-xs font-semibold transition-colors"
                  >
                    #{tagSlug}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Report an Error / Suggestion Button */}
          <div className="my-6 p-4 rounded-lg bg-slate-100/80 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <AlertCircle className="w-4 h-4 text-brand-orange flex-shrink-0" />
              <span>
                {isTelugu
                  ? 'ఈ కథనంలో ఏవైనా తప్పులు ఉన్నట్లు మీరు గమనించారా? మా సంపాదక బృందానికి తెలియజేయండి.'
                  : 'Notice a factual or typographical error in this story? Inform our editorial desk.'}
              </span>
            </div>
            <Link
              href={`/${lang}/contact`}
              className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 whitespace-nowrap transition-colors"
            >
              {isTelugu ? 'సవరణ నివేదించండి' : 'Report Error'}
            </Link>
          </div>

          {/* Author Detailed Bio Card */}
          {author && (
            <div className="my-10 p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
              <AuthorAvatar
                author={author}
                lang={lang}
                className="w-16 h-16 border-2 border-brand-orange"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base text-slate-950">{authorName}</h3>
                  <Link
                    href={`/${lang}/authors/${encodeURIComponent(author.slug)}`}
                    className="text-xs font-semibold text-brand-orange hover:underline"
                  >
                    {isTelugu ? 'మరిన్ని కథనాలు' : 'View Articles'}
                  </Link>
                </div>
                {authorBio && <p className="text-xs text-slate-600 mb-2">{authorBio}</p>}
                {reportingBeats.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-600">{isTelugu ? 'బీట్స్: ' : 'Reporting Beats: '}</span>
                    <span>{reportingBeats.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <section className="my-10 pt-8 border-t border-slate-200" aria-label="Reader Comments">
            <h3 className="text-xl font-bold text-slate-950 mb-3">{isTelugu ? 'పాఠకుల స్పందనలు' : 'Reader Discussion'}</h3>
            <p className="text-sm text-slate-600">{isTelugu ? 'ఆన్‌లైన్ వ్యాఖ్యలు ప్రస్తుతం అందుబాటులో లేవు.' : 'Online comments are not available yet.'}</p>
          </section>
        </div>

        {/* Right Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Sidebar Ad Placement */}
          {sidebarAd && (
            <AdBanner ad={sidebarAd} slotKey="sidebar" lang={lang} />
          )}

          {/* Related Articles Box */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h3 className="font-black text-sm uppercase tracking-wider text-brand-navy mb-4 pb-2 border-b border-slate-200">
              {isTelugu ? 'సంబంధిత కథనాలు' : 'Related Stories'}
            </h3>
            <div className="space-y-4">
              {relatedArticles.map((rel) => (
                <NewsCard
                  key={rel.id}
                  article={rel}
                  category={category}
                  author={author}
                  lang={lang}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

    </article>
  );
}
