'use client';

import React, { useState, useEffect } from 'react';
import { Users, Download, Mail, CheckCircle2 } from 'lucide-react';
import { NewsletterSubscriber } from '@/types';
import { getSubscribers } from '@/lib/db';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  useEffect(() => {
    setSubscribers(getSubscribers());
  }, []);

  const exportCSV = () => {
    const rows = [
      ['Email', 'Language', 'Editions', 'Subscribed At', 'Status'],
      ...subscribers.map(s => [
        s.email,
        s.language,
        s.editions.join('; '),
        s.subscribedAt,
        s.isActive ? 'Active' : 'Unsubscribed',
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sunrise_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Newsletter Subscribers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage subscriber database, edition preferences, and DPDP compliance consent records.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="px-4 py-2 bg-brand-navy hover:bg-brand-navy-light text-white rounded-xl text-xs font-bold transition-colors shadow flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-xs text-slate-600">
          <span>Registered Subscribers ({subscribers.length})</span>
          <span className="text-emerald-700">100% DPDP Verified Opt-ins</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Email Address</th>
                <th className="p-4">Language</th>
                <th className="p-4">Subscribed Editions</th>
                <th className="p-4">Subscribed Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{sub.email}</td>
                  <td className="p-4 uppercase text-slate-600 font-semibold">{sub.language}</td>
                  <td className="p-4 text-slate-600">
                    {sub.editions.map(e => (
                      <span key={e} className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] mr-1 mb-1 font-mono">
                        {e.replace('_', ' ')}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
