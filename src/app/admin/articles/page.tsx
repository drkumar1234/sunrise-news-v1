'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Plus, Search, Filter, CheckCircle, 
  Clock, Trash2, Edit3, Eye, AlertCircle 
} from 'lucide-react';
import { Article, Category } from '@/types';
import { adminRequest, saveAdmin } from '@/lib/admin-client';

export default function AdminArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('status', statusFilter);
      if (categoryFilter) params.set('category', categoryFilter);
      if (search) params.set('q', search);

      const data = await adminRequest(`/api/articles?${params.toString()}`);
      setArticles(data.articles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adminRequest('/api/catalog').then(data => setCategories(data.categories)).catch(error => setError(error.message));
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [statusFilter, categoryFilter]);

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    try {
      await saveAdmin(`/api/articles/${articleId}`, { status: newStatus });
      await fetchArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update article.');
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await adminRequest(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });
      await fetchArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete article.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Articles Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, review, edit, and publish stories across all editions.
          </p>
        </div>

        <Link
          href="/admin/articles/editor"
          className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create Article</span>
        </Link>
      </div>

      {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{error}</p>}
      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          {['all', 'published', 'review', 'draft', 'approved', 'archived'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameEn}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
              placeholder="Search headline..."
              className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No articles found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Headline & Summary</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Published</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 max-w-md">
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">
                        {art.headline}
                      </div>
                      {art.headlineTe && (
                        <div className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">
                          {art.headlineTe}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>Slug: /{art.slug}</span>
                        <span>•</span>
                        <span>Lang: {art.language.toUpperCase()}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        art.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : art.status === 'review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {art.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600 font-medium">
                      {art.location}
                    </td>

                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {new Date(art.publishedAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {art.status !== 'published' ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(art.id, 'published')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(art.id, 'draft')}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px] font-bold"
                        >
                          Unpublish
                        </button>
                      )}

                      <Link
                        href={`/admin/articles/editor?id=${art.id}`}
                        className="px-2.5 py-1 bg-brand-navy hover:bg-brand-navy-light text-white rounded text-[11px] font-bold inline-block"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/${art.language || 'en'}/article/${encodeURIComponent(art.slug || art.id)}`}
                        target="_blank"
                        className="p-1 text-slate-400 hover:text-slate-600 inline-block align-middle"
                        title="Preview public story"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(art.id)}
                        className="p-1 text-red-500 hover:text-red-700 inline-block align-middle"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
