'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Upload, FileText, ExternalLink } from 'lucide-react';
import { adminRequest, saveAdmin } from '@/lib/admin-client';
import type { EpaperEdition } from '@/types';

export function EpaperUploadPanel() {
  const [title, setTitle] = useState('Sunrise News Daily Edition');
  const [date, setDate] = useState(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }));
  const [edition, setEdition] = useState('AP & Telangana');
  const [file, setFile] = useState<File | null>(null);
  const [editions, setEditions] = useState<EpaperEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const busy = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let active = true;
    adminRequest<{ editions: EpaperEdition[] }>('/api/admin/epapers')
      .then(data => { if (active) setEditions(data.editions); })
      .catch(error => { if (active) setError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const chooseFile = (candidate?: File) => {
    setError(''); setMessage('');
    if (!candidate) { setFile(null); return; }
    if (!/\.(pdf|jpe?g)$/i.test(candidate.name) || !candidate.size || candidate.size > 4 * 1024 * 1024) {
      setError('Choose a JPG, JPEG or PDF file up to 4 MB.'); setFile(null);
      if (fileInput.current) fileInput.current.value = '';
      return;
    }
    setFile(candidate);
  };
  const upload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current) return;
    if (!file) { setError('Choose a JPG or PDF file to upload.'); return; }
    const status = (event.nativeEvent as SubmitEvent).submitter?.getAttribute('value') === 'published' ? 'published' : 'draft';
    busy.current = true; setWorking('upload'); setError(''); setMessage('');
    try {
      const form = new FormData();
      form.set('title', title); form.set('date', date); form.set('edition', edition); form.set('status', status); form.set('file', file);
      const data = await adminRequest<{ edition: EpaperEdition }>('/api/admin/epapers', { method: 'POST', body: form });
      setEditions(previous => [data.edition, ...previous].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)));
      setFile(null); if (fileInput.current) fileInput.current.value = '';
      setMessage(status === 'published' ? 'E-paper published. Readers can now open it on the website.' : 'E-paper saved as a private draft. Publish it when ready.');
    } catch (error) { setError(error instanceof Error ? error.message : 'Upload failed. Please retry.'); }
    finally { busy.current = false; setWorking(''); }
  };
  const changeStatus = async (item: EpaperEdition, status: EpaperEdition['status']) => {
    if (busy.current) return;
    busy.current = true; setWorking(item.id); setError(''); setMessage('');
    try {
      const data = await saveAdmin<{ edition: EpaperEdition }>('/api/admin/epapers', { id: item.id, status });
      setEditions(previous => previous.map(edition => edition.id === item.id ? data.edition : edition));
      setMessage(status === 'published' ? 'E-paper published.' : 'E-paper archived and removed from the public archive.');
    } catch (error) { setError(error instanceof Error ? error.message : 'The status could not be saved.'); }
    finally { busy.current = false; setWorking(''); }
  };

  return <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-5" aria-label="E-paper Daily PDF uploads">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-black text-slate-900">E-paper Daily PDF</h2><p className="text-sm text-slate-500 mt-1">Upload the daily newspaper as a PDF or JPG. రోజువారీ ఈ-పేపర్ అప్‌లోడ్.</p></div>
      <Link href="/en/epaper" target="_blank" className="text-sm text-brand-orange font-semibold flex gap-1 items-center">View public archive <ExternalLink className="w-4 h-4" /></Link>
    </div>
    {error && <p role="alert" className="p-3 rounded-lg bg-red-50 text-red-800">{error}</p>}
    {message && <p role="status" className="p-3 rounded-lg bg-emerald-50 text-emerald-800">{message}</p>}
    <form onSubmit={upload} className="space-y-4">
      <fieldset disabled={!!working} className="space-y-4 disabled:opacity-60">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm font-semibold">Edition title<input required maxLength={160} value={title} onChange={event => setTitle(event.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 font-normal" /></label>
          <label className="block text-sm font-semibold">Edition date<input required type="date" value={date} onChange={event => setDate(event.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 font-normal" /></label>
          <label className="block text-sm font-semibold">Edition / region<input required maxLength={100} value={edition} onChange={event => setEdition(event.target.value)} className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 font-normal" /></label>
        </div>
        <div className="border-2 border-dashed border-red-300 rounded-xl bg-red-50/50 p-5 text-center" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (!working) chooseFile(event.dataTransfer.files[0]); }}>
          <Upload className="w-7 h-7 text-red-800 mx-auto mb-2" />
          <label className="block text-base font-bold text-slate-900" htmlFor="daily-epaper-upload">Upload JPG or PDF</label>
          <p className="text-xs text-slate-500 mt-1 mb-3">Choose or drop one file • JPG / JPEG / PDF • Maximum 4 MB. A PDF can contain multiple pages.</p>
          <input ref={fileInput} id="daily-epaper-upload" type="file" accept=".jpg,.jpeg,.pdf,image/jpeg,application/pdf" onChange={event => chooseFile(event.target.files?.[0])} className="block w-full max-w-md mx-auto text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-red-800 file:px-4 file:py-2 file:font-bold file:text-white" />
          {file && <p className="mt-3 text-sm text-slate-700 break-all">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button type="submit" value="draft" className="px-5 py-2.5 bg-slate-800 text-white rounded-lg font-bold">{working === 'upload' ? 'Uploading…' : 'Save Draft'}</button>
          <button type="submit" value="published" className="px-5 py-2.5 bg-red-800 text-white rounded-lg font-bold">Publish E-paper</button>
        </div>
      </fieldset>
    </form>
    <div className="border-t border-slate-200 pt-4 space-y-3">
      <h3 className="font-bold text-slate-900">Uploaded editions</h3>
      {loading ? <p role="status" className="text-sm text-slate-500">Loading editions…</p> : editions.length === 0 ? <p className="text-sm text-slate-500">No editions uploaded yet. Use the box above to add the first one.</p> : editions.map(item => <div key={item.id} className="rounded-lg border border-slate-200 p-3 flex flex-wrap items-center gap-3">
        <FileText className="w-5 h-5 text-red-800 shrink-0" />
        <div className="flex-1 min-w-0"><p className="font-semibold break-words">{item.title}</p><p className="text-xs text-slate-500">{item.date} • {item.edition} • {item.status} • {(item.file.size / 1024 / 1024).toFixed(2)} MB</p></div>
        <a href={`${item.file.url}?view=1`} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-orange font-semibold">Preview file</a>
        {item.status !== 'published' && <button type="button" disabled={!!working} onClick={() => changeStatus(item, 'published')} className="rounded bg-emerald-700 text-white px-3 py-1.5 text-sm font-bold disabled:opacity-50">Publish</button>}
        {item.status !== 'archived' && <button type="button" disabled={!!working} onClick={() => changeStatus(item, 'archived')} className="rounded bg-slate-100 px-3 py-1.5 text-sm font-semibold disabled:opacity-50">Archive</button>}
      </div>)}
    </div>
  </section>;
}
