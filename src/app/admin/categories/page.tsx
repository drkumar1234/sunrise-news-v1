'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, Check, Folder } from 'lucide-react';
import { Category } from '@/types';
import { getCategories } from '@/lib/db';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [nameEn, setNameEn] = useState('');
  const [nameTe, setNameTe] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionTe, setDescriptionTe] = useState('');
  const [parentId, setParentId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || !nameTe) return;

    const newCategory: Category = {
      id: editingId || `cat-${Date.now()}`,
      slug: slug || nameEn.toLowerCase().replace(/\s+/g, '-'),
      nameEn,
      nameTe,
      descriptionEn,
      descriptionTe,
      parentId: parentId || undefined,
      displayOrder: categories.length + 1,
      featured: true,
    };

    let updatedList = [...categories];
    if (editingId) {
      updatedList = updatedList.map(c => c.id === editingId ? newCategory : c);
    } else {
      updatedList.push(newCategory);
    }

    setCategories(updatedList);
    setToast(editingId ? 'Category updated!' : 'Category created!');
    setNameEn('');
    setNameTe('');
    setSlug('');
    setDescriptionEn('');
    setDescriptionTe('');
    setParentId('');
    setEditingId(null);
    setTimeout(() => setToast(''), 2500);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setNameEn(cat.nameEn);
    setNameTe(cat.nameTe);
    setSlug(cat.slug);
    setDescriptionEn(cat.descriptionEn);
    setDescriptionTe(cat.descriptionTe);
    setParentId(cat.parentId || '');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Category Taxonomy Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize regional and thematic editorial sections in Telugu and English.
          </p>
        </div>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-orange" />
            <span>{editingId ? 'Edit Category' : 'Create New Category'}</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Name (English): *</label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Visakhapatnam"
                className="w-full p-2.5 border rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Name (Telugu): *</label>
              <input
                type="text"
                required
                value={nameTe}
                onChange={(e) => setNameTe(e.target.value)}
                placeholder="ఉదా: విశాఖపట్నం"
                className="w-full p-2.5 border rounded-lg font-telugu bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Slug:</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. visakhapatnam"
                className="w-full p-2.5 border rounded-lg font-mono bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Parent Category (Optional):</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white"
              >
                <option value="">None (Top-Level Section)</option>
                {categories.filter(c => !c.parentId && c.id !== editingId).map(c => (
                  <option key={c.id} value={c.id}>{c.nameEn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Description (English):</label>
              <textarea
                rows={2}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Description (Telugu):</label>
              <textarea
                rows={2}
                value={descriptionTe}
                onChange={(e) => setDescriptionTe(e.target.value)}
                className="w-full p-2.5 border rounded-lg font-telugu bg-white"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg font-bold transition-colors"
              >
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setNameEn(''); setNameTe(''); }}
                  className="px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right 7 Cols: Category List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-600 uppercase">
            Active Categories ({categories.length})
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {categories.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{c.nameEn}</span>
                    <span className="font-telugu text-slate-600 text-xs">({c.nameTe})</span>
                    {c.parentId && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Sub-category
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">/{c.slug}</span>
                  {c.descriptionEn && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.descriptionEn}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => startEdit(c)}
                  className="p-1.5 text-slate-500 hover:text-brand-orange hover:bg-slate-100 rounded-lg"
                  title="Edit category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
