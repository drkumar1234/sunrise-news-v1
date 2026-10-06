'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, X, Sparkles, AlertCircle } from 'lucide-react';
import { getCategories, getTags, getAuthors } from '@/lib/db';
import { NewsCard } from '@/components/article/NewsCard';
import { Article, Language, Category, Tag, Author } from '@/types';

import { Suspense } from 'react';

function SearchContent({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Language = params.lang === 'te' ? 'te' : 'en';
  const isTelugu = lang === 'te';
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get('q') || '';
  const tagParam = searchParams.get('tag') || '';
  const categoryParam = searchParams.get('category') || '';
  const authorParam = searchParams.get('author') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedTag, setSelectedTag] = useState(tagParam);
  const [selectedAuthor, setSelectedAuthor] = useState(authorParam);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Load metadata and perform search
  useEffect(() => {
    setCategories(getCategories());
    setTags(getTags());
    setAuthors(getAuthors());
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (queryParam) queryParams.set('q', queryParam);
        if (categoryParam) queryParams.set('category', categoryParam);
        if (tagParam) queryParams.set('tag', tagParam);
        if (authorParam) queryParams.set('author', authorParam);

        const res = await fetch(`/api/search?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.articles || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [queryParam, categoryParam, tagParam, authorParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTag) params.set('tag', selectedTag);
    if (selectedAuthor) params.set('author', selectedAuthor);

    router.push(`/${lang}/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setSelectedAuthor('');
    router.push(`/${lang}/search`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Search Header Form */}
      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl md:text-3xl font-black text-brand-navy mb-4">
          {isTelugu ? 'సన్‌రైజ్ న్యూస్ శోధన (Multilingual Search)' : 'Multilingual News Search & Archive'}
        </h1>

        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isTelugu
                    ? 'అమరావతి, విశాఖపట్నం, హైదరాబాద్, పోలవరం, వ్యవసాయం...'
                    : 'Search by headline, keyword, location, or full text...'
                }
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap"
            >
              {isTelugu ? 'వెతకండి' : 'Search'}
            </button>
          </div>

          {/* Facet Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                {isTelugu ? 'విభాగం (Category)' : 'Category'}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="">{isTelugu ? 'అన్ని విభాగాలు' : 'All Categories'}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {isTelugu ? c.nameTe : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                {isTelugu ? 'టాపిక్ ట్యాగ్ (Topic Tag)' : 'Topic Tag'}
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="">{isTelugu ? 'అన్ని ట్యాగ్‌లు' : 'All Tags'}</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.slug}>
                    #{isTelugu ? t.nameTe : t.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                {isTelugu ? 'రిపోర్టర్ (Author)' : 'Reporter / Author'}
              </label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="">{isTelugu ? 'అందరూ రచయితలు' : 'All Authors'}</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {isTelugu && a.nameTe ? a.nameTe : a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(queryParam || categoryParam || tagParam || authorParam) && (
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-600">
                {isTelugu ? 'ఫలితాల సంఖ్య: ' : 'Found: '} <strong className="text-brand-orange">{results.length}</strong> {isTelugu ? 'కథనాలు' : 'articles'}
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>{isTelugu ? 'ఫిల్టర్లు తొలగించండి' : 'Clear All Filters'}</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="p-16 text-center text-slate-500">
          <div className="inline-block w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-sm font-semibold">{isTelugu ? 'శోధిస్తున్నాము...' : 'Searching news records...'}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 max-w-2xl mx-auto space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            {isTelugu ? 'ఎటువంటి ఫలితాలు కనుగొనబడలేదు' : 'No articles matched your criteria'}
          </h3>
          <p className="text-xs text-slate-600">
            {isTelugu
              ? 'మరొక పదం లేదా విస్తృత పదాలను ఉపయోగించి ప్రయత్నించండి.'
              : 'Try checking your spelling, using fewer keywords, or broadening your filters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((art) => (
            <NewsCard
              key={art.id}
              article={art}
              category={categories.find(c => c.id === art.categoryId)}
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

export default function SearchPage({ params }: { params: { lang: string } }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading Search Portal...</div>}>
      <SearchContent params={params} />
    </Suspense>
  );
}
