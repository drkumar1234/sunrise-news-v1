import React from 'react';
import Link from 'next/link';
import { 
  FileText, CheckCircle2, Clock, FileEdit, 
  Users, Layers, ArrowUpRight, Plus, Radio, Megaphone,
  History as HistoryIcon 
} from 'lucide-react';
import { getArticles, getCategories, getSubscribers, getAuditLogs } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export default async function AdminDashboardPage() {
  if (!await getSession(new Request('http://cms.local/admin', { headers: { cookie: (await cookies()).toString() } }))) redirect('/admin/login');
  const [{ articles: all }, categories, subscribers, logs] = await Promise.all([
    getArticles({ status: 'all' }), getCategories(), getSubscribers(), getAuditLogs(),
  ]);
  const auditLogs = logs.slice(0, 8);

  const publishedCount = all.filter(a => a.status === 'published').length;
  const inReviewCount = all.filter(a => a.status === 'review').length;
  const draftCount = all.filter(a => a.status === 'draft').length;

  const pendingReviewArticles = all.filter(a => a.status === 'review');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Newsroom Editorial Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status of Telugu & English publishing workflow, review queues, and live dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/articles/editor"
            className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Story</span>
          </Link>
          <Link
            href="/admin/ticker"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-brand-orange" />
            <span>Breaking Ticker</span>
          </Link>
        </div>
      </div>

      {/* CODE-FREE DAILY PUBLISHING DESK */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-neutral-900 to-red-950 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
            <span>✨ Code-Free News Publishing</span>
            <span>•</span>
            <span>రోజువారీ వార్తా డెస్క్</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Write, Create & Upload Everyday in MS Word or PDF
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            మీరు రోజువారీ నివేదికలను నేరుగా రాయవచ్చు లేదా MS Word (.docx) మరియు PDF ఫైల్స్‌ను అప్‌లోడ్ చేయవచ్చు. సిస్టమ్ స్వయంచాలకంగా శీర్షికలను, సారాంశాలను వెలికితీస్తుంది.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href="/admin/articles/editor"
            className="px-5 py-3 bg-[#990000] hover:bg-[#800000] text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 flex-1 md:flex-initial active:scale-95 border border-red-600"
          >
            <FileText className="w-4 h-4" />
            <span>Upload Word / PDF File</span>
          </Link>
          <Link
            href="/admin/articles/editor"
            className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 flex-1 md:flex-initial active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-900" />
            <span>Write New Story</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Published */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Published Stories
            </span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">
              {publishedCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Live on website</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* In Review */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Awaiting Review
            </span>
            <span className="text-3xl font-black text-amber-500 mt-1 block">
              {inReviewCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Requires editor approval</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Drafts */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Reporter Drafts
            </span>
            <span className="text-3xl font-black text-slate-700 mt-1 block">
              {draftCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Work in progress</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <FileEdit className="w-6 h-6" />
          </div>
        </div>

        {/* Subscribers */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Subscribers
            </span>
            <span className="text-3xl font-black text-brand-navy mt-1 block">
              {subscribers.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Morning Briefing list</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-navy flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Review Queue & Quick Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Published & Pending */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-orange" />
              <span>Recent Editorial Submissions</span>
            </h2>
            <Link
              href="/admin/articles"
              className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
            >
              <span>View All Articles</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {all.slice(0, 6).map((art) => (
              <div key={art.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      art.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : art.status === 'review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {art.status}
                    </span>
                    <span className="text-xs text-slate-400">• {art.location}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 truncate">{art.headline}</h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/articles/editor?id=${art.id}`}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Audit Trail */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-brand-navy" />
              <span>Audit Trail</span>
            </h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.userName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-1">
                  <span className="font-semibold uppercase text-brand-orange">{log.action}: </span>
                  {log.targetTitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
