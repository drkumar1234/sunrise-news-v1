'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, MapPin, ChevronRight, ShieldCheck, 
  AlertCircle, MessageSquare, CheckCircle2 
} from 'lucide-react';
import { Article, Category, Author, AdPlacement, Language } from '@/types';
import { ReaderTools } from '@/components/article/ReaderTools';
import { ArticleBody } from '@/components/article/ArticleBody';
import { FactCheckVerdict } from '@/components/article/FactCheckVerdict';
import { CorrectionsNotice } from '@/components/article/CorrectionsNotice';
import { NewsCard } from '@/components/article/NewsCard';
import { AdBanner } from '@/components/ui/AdBanner';

interface ArticleViewClientProps {
  article: Article;
  category?: Category;
  author?: Author;
  relatedArticles: Article[];
  sidebarAd?: AdPlacement;
  midArticleAd?: AdPlacement;
  lang: Language;
}

export function ArticleViewClient({
  article,
  category,
  author,
  relatedArticles,
  sidebarAd,
  midArticleAd,
  lang,
}: ArticleViewClientProps) {
  const isTelugu = lang === 'te';

  // State for reader tools font size
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  // Comment state
  const [comments, setComments] = useState<{ name: string; text: string; time: string }[]>([
    {
      name: 'P. Srinivasa Rao',
      text: isTelugu
        ? 'ఈ ప్రాజెక్ట్ త్వరితగతిన పూర్తి కావడం ఆంధ్రప్రదేశ్ అభివృద్ధికి అత్యంత అవసరం. సమగ్రమైన విశ్లేషణను అందించిన సన్‌రైజ్ న్యూస్ బృందానికి ధన్యవాదాలు.'
        : 'Crucial analysis for the regional economy. The government must maintain strict transparency on deadlines.',
      time: '2 hours ago',
    }
  ]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Error report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentText) return;
    setComments([
      ...comments,
      {
        name: commentName,
        text: commentText,
        time: 'Just now (Awaiting editorial approval)',
      }
    ]);
    setCommentName('');
    setCommentText('');
    setCommentSubmitted(true);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSubmitted(false);
      setReportText('');
    }, 2000);
  };

  const headline = isTelugu && article.headlineTe ? article.headlineTe : article.headline;
  const summary = isTelugu && article.summaryTe ? article.summaryTe : article.summary;
  const location = isTelugu && article.locationTe ? article.locationTe : article.location;
  const authorName = author ? (isTelugu && author.nameTe ? author.nameTe : author.name) : 'Staff Reporter';
  const authorBio = author ? (isTelugu ? author.bioTe : author.bioEn) : '';
  const authorRole = author ? (isTelugu && author.roleTe ? author.roleTe : author.role) : 'Journalist';
  const catName = category ? (isTelugu ? category.nameTe : category.nameEn) : 'News';

  const publishedDateFormatted = new Date(article.publishedAt).toLocaleDateString(
    isTelugu ? 'te-IN' : 'en-IN',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  const updatedDateFormatted = new Date(article.updatedAt).toLocaleDateString(
    isTelugu ? 'te-IN' : 'en-IN',
    { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sunrisenews.in/${lang}/article/${encodeURIComponent(article.slug)}`,
    },
    headline: headline,
    image: [article.featuredImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `https://sunrisenews.in/${lang}/authors/${author?.slug || 'editorial'}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sunrise News',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sunrisenews.in/logo.png',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. BREADCRUMBS */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href={`/${lang}`} className="hover:text-brand-orange">
          {isTelugu ? 'ముఖ్యాంశాలు' : 'Home'}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        {category && (
          <>
            <Link href={`/${lang}/category/${category.slug}`} className="hover:text-brand-orange font-medium">
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
              href={`/${lang}/category/${category.slug}`}
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
              <img
                src={author.avatar}
                alt={authorName}
                className="w-11 h-11 rounded-full object-cover border border-slate-300 shadow-sm"
              />
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm">{authorName}</span>
                {author?.verified && (
                  <ShieldCheck className="w-4 h-4 text-brand-orange fill-current text-white" />
                )}
              </div>
              <span className="text-slate-500 block">{authorRole}</span>
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
          src={article.featuredImage}
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
            articleUrl={`/${lang}/article/${encodeURIComponent(article.slug)}`}
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
            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 whitespace-nowrap transition-colors"
            >
              {isTelugu ? 'సవరణ నివేదించండి' : 'Report Error'}
            </button>
          </div>

          {/* Author Detailed Bio Card */}
          {author && (
            <div className="my-10 p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
              <img
                src={author.avatar}
                alt={authorName}
                className="w-16 h-16 rounded-full object-cover border-2 border-brand-orange flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base text-slate-950">{authorName}</h3>
                  <Link
                    href={`/${lang}/authors/${author.slug}`}
                    className="text-xs font-semibold text-brand-orange hover:underline"
                  >
                    {isTelugu ? 'మరిన్ని కథనాలు' : 'View Articles'}
                  </Link>
                </div>
                <p className="text-xs text-slate-600 mb-2">{authorBio}</p>
                {author.reportingBeats && author.reportingBeats.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-600">{isTelugu ? 'బీట్స్: ' : 'Reporting Beats: '}</span>
                    <span>{author.reportingBeats.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reader Moderated Comments Section */}
          <section className="my-10 pt-8 border-t border-slate-200" aria-label="Reader Comments">
            <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-brand-orange" />
              <span>{isTelugu ? 'పాఠకుల స్పందనలు (Comments)' : 'Reader Discussion'}</span>
              <span className="text-sm font-normal text-slate-500">({comments.length})</span>
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase">
                {isTelugu ? 'మీ అభిప్రాయాన్ని తెలపండి:' : 'Leave a Comment (Subject to Moderation):'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={isTelugu ? 'మీ పేరు' : 'Your full name'}
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  required
                  className="px-3 py-2 border rounded-lg text-sm bg-white"
                />
              </div>
              <textarea
                placeholder={isTelugu ? 'గౌరవప్రదమైన భాషలో మీ అభిప్రాయాన్ని రాయండి...' : 'Share your respectful perspective...'}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {isTelugu ? 'అన్ని వ్యాఖ్యలు సంపాదకీయ సమీక్షకు లోబడి ఉంటాయి.' : 'Comments are reviewed before publication.'}
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg text-xs font-bold transition-colors"
                >
                  {isTelugu ? 'వ్యాఖ్యను పంపండి' : 'Post Comment'}
                </button>
              </div>
              {commentSubmitted && (
                <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isTelugu ? 'మీ వ్యాఖ్య సమర్పించబడింది! త్వరలోనే ప్రచురించబడుతుంది.' : 'Your comment was submitted for editorial moderation.'}</span>
                </div>
              )}
            </form>

            {/* Published Comments List */}
            <div className="space-y-4">
              {comments.map((c, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-100 bg-white shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                    <span className="text-[11px] text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
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

      {/* Error Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {isTelugu ? 'సంపాదక బృందానికి సవరణ నివేదించండి' : 'Report an Error to the Editorial Desk'}
            </h3>
            <p className="text-xs text-slate-600">
              {isTelugu
                ? 'సన్‌రైజ్ న్యూస్ ఖచ్చితత్వానికి ప్రాధాన్యత ఇస్తుంది. తప్పు ఉన్న భాగం మరియు ఆధారాలను వివరించండి.'
                : 'Sunrise News takes factual accuracy seriously. Please describe the error and provide primary sources.'}
            </p>
            {reportSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{isTelugu ? 'మీ నివేదిక నమోదైంది. మా ఎడిటర్లు పరిశీలిస్తారు.' : 'Thank you. The editorial desk has received your note.'}</span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <textarea
                  rows={4}
                  required
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder={isTelugu ? 'సవరణ చేయవలసిన వాక్యం లేదా అంశాన్ని ఇక్కడ రాయండి...' : 'Describe the factual inaccuracy...'}
                  className="w-full p-3 border rounded-lg text-sm bg-slate-50 focus:bg-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    {isTelugu ? 'రద్దు చేయి' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-dark rounded-lg shadow-sm"
                  >
                    {isTelugu ? 'నివేదిక పంపండి' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
