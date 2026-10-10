'use client';

import React, { useState, useEffect } from 'react';
import { History, Shield, Clock, FileText } from 'lucide-react';
import { AuditLog } from '@/types';
import { adminRequest } from '@/lib/admin-client';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    adminRequest('/api/admin/audit-logs').then(data => setLogs(data.logs)).catch(error => setError(error.message));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900">Editorial Audit Trail & Activity Log</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Recent saved newsroom activity, including article changes, publishing, and settings updates.
        </p>
      </div>

      {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{error}</p>}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Editor / User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Details & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{log.userName}</div>
                    <span className="text-[10px] text-brand-orange uppercase font-semibold">
                      {log.userRole.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      log.action === 'publish'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.action === 'create'
                        ? 'bg-blue-100 text-blue-800'
                        : log.action === 'delete'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <span className="font-bold text-slate-800 block truncate">{log.targetTitle}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {log.targetId}</span>
                  </td>
                  <td className="p-4 text-slate-600 max-w-sm">
                    {log.details || '—'}
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
