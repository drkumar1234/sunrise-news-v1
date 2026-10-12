'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import type { EpaperEdition, Language } from '@/types';

export function DailyEpaperArchive({ lang }: { lang: Language }) {
  const te = lang === 'te';
  const [editions, setEditions] = useState<EpaperEdition[]>([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/epapers', { cache: 'no-store', signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error('The daily editions could not be loaded. Please refresh.'); return response.json(); })
      .then(data => setEditions(data.editions || []))
      .catch(error => { if (error.name !== 'AbortError') setError(te ? 'ఈ-పేపర్ ఎడిషన్లు లోడ్ కాలేదు. మళ్ళీ ప్రయత్నించండి.' : error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [te]);
  const visible = editions.filter(edition => !date || edition.date === date);
  return <section className="bg-slate-50 text-slate-900 border-b border-slate-300 p-5 md:p-8" aria-label="Daily e-paper archive">
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap gap-4 justify-between items-end">
        <div><h1 className="text-2xl md:text-3xl font-black">{te ? 'ఈ-పేపర్ రోజువారీ PDF' : 'E-paper Daily PDF'}</h1><p className="text-sm text-slate-600 mt-2">{te ? 'రోజువారీ వార్తాపత్రికను PDF లేదా JPG రూపంలో చదవండి, డౌన్‌లోడ్ చేసుకోండి.' : 'Read and download the daily newspaper in PDF or JPG format.'}</p></div>
        <div className="flex gap-2 items-end"><label className="text-xs font-semibold">{te ? 'తేదీ ఎంచుకోండి' : 'Filter by date'}<input type="date" value={date} onChange={event => setDate(event.target.value)} className="block mt-1 border border-slate-300 p-2 rounded-lg bg-white text-sm" /></label>{date && <button type="button" onClick={() => setDate('')} className="p-2 text-sm font-semibold text-red-800">{te ? 'అన్ని ఎడిషన్లు' : 'Show all'}</button>}</div>
      </div>
      {loading && <p role="status">{te ? 'ఈ-పేపర్ లోడ్ అవుతోంది…' : 'Loading daily editions…'}</p>}
      {error && <p role="alert" className="text-red-800">{error}</p>}
      {!loading && !error && visible.length === 0 && <p className="bg-white border border-slate-200 rounded-xl p-6 text-slate-600">{te ? 'ఈ తేదీకి ఈ-పేపర్ ఇంకా ప్రచురించబడలేదు.' : date ? 'No e-paper has been published for this date.' : 'Daily editions will appear here when the newsroom publishes a JPG or PDF.'}</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(item => <article key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {item.file.contentType === 'image/jpeg' ? <a href={`${item.file.url}?view=1`} target="_blank" rel="noopener noreferrer"><img src={item.file.url} alt={item.title} className="w-full h-56 object-contain bg-slate-100" loading="lazy" /></a> : <div className="h-40 bg-red-50 flex flex-col items-center justify-center gap-2 text-red-800"><FileText className="w-12 h-12" /><span className="font-bold">PDF</span></div>}
          <div className="p-4 space-y-3"><h2 className="font-bold text-lg">{item.title}</h2><p className="text-sm text-slate-600">{new Date(`${item.date}T00:00:00Z`).toLocaleDateString(te ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })} • {item.edition}</p>
            <div className="flex flex-wrap gap-3"><a href={`${item.file.url}?view=1`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-bold text-sm text-red-800"><ExternalLink className="w-4 h-4" />{te ? 'చదవండి' : 'Open edition'}</a><a href={item.file.url} download={item.file.name} className="flex items-center gap-1.5 font-bold text-sm text-slate-700"><Download className="w-4 h-4" />{te ? 'డౌన్‌లోడ్' : 'Download'}</a></div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
