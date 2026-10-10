'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Save, Check, ExternalLink } from 'lucide-react';
import { AdPlacement } from '@/types';
import { adminRequest, saveAdmin } from '@/lib/admin-client';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdPlacement[]>([]);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    adminRequest('/api/admin/ads').then(data => setAds(data.ads)).catch(error => setError(error.message));
  }, []);

  const toggleAdActive = (id: string) => {
    const updated = ads.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a);
    setAds(updated);
    setToast('Unsaved changes. Save the campaign to apply them.');
  };

  const updateAdField = (id: string, field: keyof AdPlacement, value: any) => {
    const updated = ads.map(a => a.id === id ? { ...a, [field]: value } : a);
    setAds(updated);
  };

  const saveCampaign = async (ad: AdPlacement) => {
    setSavingId(ad.id);
    setError('');
    try { await saveAdmin('/api/admin/ads', ad); setToast('Campaign saved.'); }
    catch (error) { setError(error instanceof Error ? error.message : 'Unable to save campaign.'); }
    finally { setSavingId(null); }
  };

  const addCampaign = () => {
    const today = new Date().toISOString().slice(0, 10);
    setAds([...ads, { id: `ad-${Date.now()}`, slotKey: 'leaderboard', title: 'New campaign', advertiser: '', imageUrl: '', targetUrl: '', startDate: today, endDate: today, isActive: false }]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900">Advertising & Campaign Manager</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Control leaderboard, sidebar, and mid-content advertising placements and tracking URLs.
        </p>
      </div>

      <button type="button" onClick={addCampaign} className="px-4 py-2 rounded-lg bg-brand-navy text-white text-sm font-bold">Add campaign</button>
      {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{error}</p>}
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-6">
        {ads.map((ad) => (
          <div key={ad.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded bg-brand-navy text-white text-xs font-bold uppercase tracking-wider">
                  Slot: {ad.slotKey}
                </span>
                <span className="font-bold text-sm text-slate-900">{ad.title}</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <span>Active:</span>
                <input
                  type="checkbox"
                  checked={ad.isActive}
                  onChange={() => toggleAdActive(ad.id)}
                  className="rounded text-brand-orange h-4 w-4"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-1">
                <label className="block font-bold text-slate-600 mb-1">Creative Preview:</label>
                <div className="aspect-[16/9] rounded-lg overflow-hidden border bg-slate-100">
                  {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Campaign Headline:</label>
                  <input
                    type="text"
                    value={ad.title}
                    onChange={(e) => updateAdField(ad.id, 'title', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Advertiser Name:</label>
                    <input
                      type="text"
                      value={ad.advertiser}
                      onChange={(e) => updateAdField(ad.id, 'advertiser', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Target Click URL:</label>
                    <input
                      type="text"
                      value={ad.targetUrl}
                      onChange={(e) => updateAdField(ad.id, 'targetUrl', e.target.value)}
                      className="w-full p-2 border rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Creative Image URL:</label>
                  <input
                    type="text"
                    value={ad.imageUrl}
                    onChange={(e) => updateAdField(ad.id, 'imageUrl', e.target.value)}
                    className="w-full p-2 border rounded-lg font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <label>Placement<select value={ad.slotKey} onChange={e => updateAdField(ad.id, 'slotKey', e.target.value)} className="block border p-2 rounded w-full">{['leaderboard', 'sidebar', 'mid_content', 'footer'].map(slot => <option key={slot} value={slot}>{slot}</option>)}</select></label>
              <label>Start date<input type="date" value={ad.startDate} onChange={e => updateAdField(ad.id, 'startDate', e.target.value)} className="block border p-2 rounded w-full" /></label>
              <label>End date<input type="date" value={ad.endDate} onChange={e => updateAdField(ad.id, 'endDate', e.target.value)} className="block border p-2 rounded w-full" /></label>
            </div>
            <button type="button" disabled={savingId === ad.id} onClick={() => saveCampaign(ad)} className="px-4 py-2 rounded-lg bg-brand-navy text-white text-xs font-bold disabled:opacity-50">{savingId === ad.id ? 'Saving…' : 'Save campaign'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
