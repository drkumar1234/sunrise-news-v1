'use client';

import React, { useState, useEffect } from 'react';
import { Tags, Plus, Check, Merge, AlertCircle } from 'lucide-react';
import { Tag } from '@/types';
import { adminRequest, saveAdmin } from '@/lib/admin-client';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [nameEn, setNameEn] = useState('');
  const [nameTe, setNameTe] = useState('');
  const [slug, setSlug] = useState('');
  const [aliases, setAliases] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    adminRequest('/api/admin/tags').then(data => setTags(data.tags)).catch(error => setError(error.message));
  }, []);

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn) return;

    const tagSlug = slug || nameEn.toLowerCase().replace(/\s+/g, '-');
    const aliasList = aliases
      .split(',')
      .map(a => a.trim().toLowerCase())
      .filter(Boolean);

    // Duplicate detection
    const existing = tags.find(t => t.slug === tagSlug && t.id !== editingId);
    if (existing) {
      alert(`Tag slug '${tagSlug}' already exists!`);
      return;
    }

    const newTag: Tag = {
      id: editingId || `tag-${Date.now()}`,
      slug: tagSlug,
      nameEn,
      nameTe: nameTe || nameEn,
      aliases: aliasList,
      articleCount: 0,
    };

    setError('');
    setSaving(true);
    try {
    await saveAdmin('/api/admin/tags', newTag);
    setTags(editingId ? tags.map(tag => tag.id === editingId ? newTag : tag) : [...tags, newTag]);
    setToast('Canonical tag saved with alias mappings!');
    setNameEn('');
    setNameTe('');
    setSlug('');
    setAliases('');
    setEditingId(null);
    setTimeout(() => setToast(''), 2500);
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save tag.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900">Canonical Tag Management & Alias Mapping</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Prevent duplicate tag sprawl (e.g. mapping "Vizag" and "Vishakhapatnam" to canonical "Visakhapatnam").
        </p>
      </div>

      {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{error}</p>}
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Create Canonical Tag */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-orange" />
            <span>{editingId ? 'Edit Canonical Tag' : 'Create Canonical Tag'}</span>
          </h2>

          <form onSubmit={handleAddTag} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Tag Name (English): *</label>
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
              <label className="block font-bold text-slate-700 uppercase mb-1">Tag Name (Telugu):</label>
              <input
                type="text"
                value={nameTe}
                onChange={(e) => setNameTe(e.target.value)}
                placeholder="ఉదా: విశాఖపట్నం"
                className="w-full p-2.5 border rounded-lg font-telugu bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Canonical Slug:</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. visakhapatnam"
                className="w-full p-2.5 border rounded-lg font-mono bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Aliases & Common Synonyms (Comma separated):
              </label>
              <input
                type="text"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                placeholder="e.g. vizag, vishakhapatnam, waltair"
                className="w-full p-2.5 border rounded-lg bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Any story tagged with these aliases will resolve automatically to this canonical tag.
              </span>
            </div>

            <button
              type="submit" disabled={saving}
              className="w-full py-2.5 bg-brand-navy hover:bg-brand-navy-light text-white rounded-lg font-bold transition-colors shadow"
            >
              Save Canonical Tag
            </button>
            {editingId && <button type="button" className="w-full p-2 bg-slate-100 rounded-lg" onClick={() => { setEditingId(null); setNameEn(''); setNameTe(''); setSlug(''); setAliases(''); }}>Cancel editing</button>}
          </form>
        </div>

        {/* Right 7 Cols: Tags List & Aliases */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-600 uppercase">
            Active Canonical Tags ({tags.length})
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {tags.map((t) => (
              <div key={t.id} className="p-4 space-y-1.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">#{t.slug}</span>
                  <button type="button" className="text-brand-navy text-xs font-bold" onClick={() => { setEditingId(t.id); setNameEn(t.nameEn); setNameTe(t.nameTe); setSlug(t.slug); setAliases(t.aliases.join(', ')); }}>Edit tag</button>
                </div>

                <div className="text-xs text-slate-600">
                  <span>Display: <strong>{t.nameEn}</strong></span>
                  {t.nameTe && <span className="ml-2 font-telugu text-slate-500">({t.nameTe})</span>}
                </div>

                {t.aliases && t.aliases.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Mapped Aliases:</span>
                    {t.aliases.map((alias) => (
                      <span key={alias} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono">
                        {alias}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
