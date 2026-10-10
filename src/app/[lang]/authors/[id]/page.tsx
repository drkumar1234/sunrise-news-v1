import React from 'react';
import { safeUrl } from '@/lib/content-safety';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Mail, Twitter, Linkedin, ChevronRight } from 'lucide-react';
import { getAuthorBySlug, getArticles, getCategories, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const author = await getAuthorBySlug(resolvedParams.id);
  if (!author) {
    notFound();
  }

  const [{ articles }, categories] = await Promise.all([
    getArticles({ authorId: author.id, status: 'published' }),
    getCategories(),
  ]);

  const authorName = isTelugu && author.nameTe ? author.nameTe : author.name;
  const authorRole = isTelugu && author.roleTe ? author.roleTe : author.role;
  const authorBio = isTelugu ? author.bioTe : author.bioEn;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
        <Link href={`/${lang}`} className="hover:text-brand-orange">
          {isTelugu ? 'ముఖ్యాంశాలు' : 'Home'}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href={`/${lang}/authors`} className="hover:text-brand-orange">
          {isTelugu ? 'రచయితలు' : 'Authors'}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-semibold">{authorName}</span>
      </nav>

      {/* Author Profile Bio Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={safeUrl(author.avatar, '/brand/sunrise-news-logo.jpg')}
          alt={authorName}
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
        />

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-950">{authorName}</h1>
              {author.verified && (
                <ShieldCheck className="w-5 h-5 text-brand-orange" />
              )}
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
              {author.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{author.email}</span>
                </span>
              )}
              {author.twitter && (
                <span className="font-semibold text-brand-navy">{author.twitter}</span>
              )}
            </div>
          </div>

          <p className="text-sm font-semibold text-brand-orange">{authorRole}</p>
          <p className="text-sm text-slate-700 max-w-3xl leading-relaxed">{authorBio}</p>

          <div className="pt-2 text-xs text-slate-500 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-slate-700">{isTelugu ? 'కవర్ చేసే అంశాలు:' : 'Assigned Beats:'}</span>
            {author.reportingBeats.map((beat) => (
              <span key={beat} className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
                {beat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Articles by this author */}
      <div>
        <h2 className="text-2xl font-black text-brand-navy mb-6">
          {isTelugu ? `${authorName} అందించిన కథనాలు` : `Published Articles by ${authorName}`}
          <span className="text-sm font-normal text-slate-500 ml-2">({articles.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <NewsCard
              key={art.id}
              article={art}
              category={categories.find(c => c.id === art.categoryId)}
              author={author}
              lang={lang}
              variant="grid"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
