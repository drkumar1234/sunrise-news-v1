'use client';

import { useEffect, useState } from 'react';
import type { EditorialSettings } from '@/types';
import { adminRequest, saveAdmin } from '@/lib/admin-client';

const fields: { key: keyof EditorialSettings; label: string; type?: string }[] = [
  { key: 'siteNameEn', label: 'Website name (English)' },
  { key: 'siteNameTe', label: 'Website name (Telugu)' },
  { key: 'taglineEn', label: 'Tagline (English)' },
  { key: 'taglineTe', label: 'Tagline (Telugu)' },
  { key: 'contactEmail', label: 'Contact email', type: 'email' },
  { key: 'contactPhone', label: 'Contact phone', type: 'tel' },
  { key: 'addressHyderabad', label: 'Hyderabad address' },
  { key: 'addressAmaravati', label: 'Amaravati address' },
  { key: 'addressVisakhapatnam', label: 'Visakhapatnam address' },
  { key: 'addressDelhi', label: 'Delhi address' },
  { key: 'grievanceOfficerName', label: 'Grievance officer name' },
  { key: 'grievanceOfficerEmail', label: 'Grievance officer email', type: 'email' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<EditorialSettings | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { adminRequest('/api/settings').then(data => setSettings(data.settings)).catch(error => setError(error.message)); }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await saveAdmin('/api/settings', Object.fromEntries(fields.map(({ key }) => [key, settings[key]])));
      setMessage('Website details saved.');
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save website details.'); }
    finally { setSaving(false); }
  }

  return <div className="max-w-4xl mx-auto space-y-6">
    <div><h1 className="text-2xl font-black">Website settings</h1><p className="text-sm text-slate-500 mt-1">Manage the publication details shown to readers.</p></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 text-red-800 p-3">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-emerald-50 text-emerald-800 p-3">{message}</p>}
    {settings ? <form onSubmit={save} className="bg-white border rounded-xl p-6 space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">{fields.map(field => <label key={field.key} className="text-sm font-semibold">{field.label}
        <input type={field.type || 'text'} value={String(settings[field.key] || '')} maxLength={2000} onChange={event => setSettings({ ...settings, [field.key]: event.target.value })} className="block w-full border rounded-lg p-2.5 mt-1 font-normal" />
      </label>)}</div>
      <button disabled={saving} className="px-5 py-2.5 rounded-lg bg-brand-navy text-white font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save website details'}</button>
    </form> : !error && <p>Loading website settings…</p>}
  </div>;
}
