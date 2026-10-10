import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Folder } from 'lucide-react';
import { getCategoryBySlug, getCategories, getArticles, getAuthors } from '@/lib/public-articles';
import { NewsCard } from '@/components/article/NewsCard';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';

  const category = await getCategoryBySlug(resolvedParams.slug);
  if (!category) {
    notFound();
  }

  const [allCategories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);

  // Child categories if any
  const childCategories = allCategories.filter(c => c.parentId === category.id);

  // Fetch articles for this category
  const { articles, total } = await getArticles({
    categoryId: category.id,
    status: 'published',
  });

  const catName = isTelugu ? category.nameTe : category.nameEn;
  const catDesc = isTelugu ? category.descriptionTe : category.descriptionEn;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center gap-1.5">
        <Link href={`/${lang}`} className="hover:text-brand-orange">
          {isTelugu ? 'ముఖ్యాంశాలు' : 'Home'}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-semibold">{catName}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-brand-navy text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
            <Folder className="w-4 h-4" />
            <span>{isTelugu ? 'విభాగం' : 'EDITORIAL SECTION'}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            {catName}
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {catDesc}
          </p>
        </div>

        {/* Decorative background sunburst motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-orange/20 to-transparent pointer-events-none" />
      </div>

      {/* Subcategory Pills if present */}
      {childCategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
            {isTelugu ? 'ఉప విభాగాలు:' : 'Sub-sections:'}
          </span>
          {childCategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/${lang}/category/${encodeURIComponent(sub.slug)}`}
              className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-brand-orange hover:text-white text-slate-700 text-xs font-bold transition-colors whitespace-nowrap"
            >
              {isTelugu ? sub.nameTe : sub.nameEn}
            </Link>
          ))}
        </div>
      )}

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">
            {isTelugu
              ? 'ఈ విభాగంలో ప్రస్తుతం కొత్త కథనాలు సిద్ధమవుతున్నాయి.'
              : 'No articles currently found in this section. Check back shortly.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <NewsCard
              key={art.id}
              article={art}
              category={category}
              author={authors.find(a => a.id === art.authorId)}
              lang={lang}
              variant="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
}
