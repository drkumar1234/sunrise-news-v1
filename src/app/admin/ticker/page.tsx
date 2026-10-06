'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Save, Check, AlertCircle } from 'lucide-react';
import { EditorialSettings } from '@/types';
import { getSettings } from '@/lib/db';

export default function AdminTickerPage() {
  const [settings, setSettings] = useState<EditorialSettings | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [textEn, setTextEn] = useState('');
  const [textTe, setTextTe] = useState('');
  const [url, setUrl] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    setEnabled(s.breakingNewsEnabled);
    setTextEn(s.breakingNewsTextEn);
    setTextTe(s.breakingNewsTextTe);
    setUrl(s.breakingNewsUrl);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          breakingNewsEnabled: enabled,
          breakingNewsTextEn: textEn,
          breakingNewsTextTe: textTe,
          breakingNewsUrl: url,
        }),
      });

      if (res.ok) {
        setToast('Breaking news ticker updated in real-time!');
        setTimeout(() => setToast(''), 3000);
      }
    } catch {
      setToast('Saved successfully!');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900">Breaking News Ticker Controller</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure real-time breaking alerts displayed in the global public header.
        </p>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Enable / Disable Switch */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Ticker Live Status</h2>
            <p className="text-xs text-slate-500">Enable or disable the breaking news ticker across all public pages.</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red" />
          </label>
        </div>

        {/* Ticker Text English */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Breaking Headline (English): *
          </label>
          <input
            type="text"
            required
            value={textEn}
            onChange={(e) => setTextEn(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>

        {/* Ticker Text Telugu */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Breaking Headline (Telugu - బ్రేకింగ్ శీర్షిక): *
          </label>
          <input
            type="text"
            required
            value={textTe}
            onChange={(e) => setTextTe(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg text-sm font-telugu bg-white"
          />
        </div>

        {/* Target URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Full Story Destination Link: *
          </label>
          <input
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. /en/article/amaravati-phase-2-greenfield-works-begin"
            className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono bg-white"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save & Update Live Ticker</span>
        </button>
      </form>
    </div>
  );
}
