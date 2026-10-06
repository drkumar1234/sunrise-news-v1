'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, Key, User, Check, ArrowRight, 
  FileText, Upload, Sparkles, CheckCircle2, Lock 
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { UserRole } from '@/types';

export default function AdminLoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');
  const [password, setPassword] = useState('newsroom2026');
  const [loading, setLoading] = useState(false);
  const [fastLoginMode, setFastLoginMode] = useState(true);

  const roles = [
    {
      role: 'super_admin' as UserRole,
      title: 'Editor-in-Chief / Super Admin',
      titleTe: 'ప్రధాన సంపాదకుడు (ఎడిటర్-ఇన్-చీఫ్)',
      desc: 'Full code-free access: Write, upload MS Word / PDF documents, manage ads, categories & audit logs',
      badge: 'Full Access',
      name: 'Ramesh Varma',
      icon: '👑',
    },
    {
      role: 'editor' as UserRole,
      title: 'Senior News Editor',
      titleTe: 'సీనియర్ సంపాదకుడు (డెస్క్)',
      desc: 'Review queue, approval, publishing, corrections & document attachments',
      badge: 'Editorial Desk',
      name: 'Ananya Sharma',
      icon: '✍️',
    },
    {
      role: 'reporter' as UserRole,
      title: 'Field Reporter / Journalist',
      titleTe: 'ఫీల్డ్ రిపోర్టర్ / పాత్రికేయుడు',
      desc: 'Everyday reporting: Direct draft creation & press release uploads',
      badge: 'Reporting Beat',
      name: 'S. Krishna Murthy',
      icon: '📰',
    },
  ];

  // Quick 1-click code-free login
  const handleQuickLogin = (role: UserRole) => {
    setLoading(true);
    const activeUser = roles.find(r => r.role === role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sr_user', JSON.stringify({
        id: `usr-${role}`,
        role: role,
        name: activeUser?.name || 'Staff User',
        email: `${role}@sunrisenews.in`,
      }));
    }

    setTimeout(() => {
      router.push('/admin');
    }, 300);
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background glow & subtle newsprint grid */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10 space-y-6 relative z-10 border border-slate-200">
        {/* Brand Header */}
        <div className="text-center space-y-3 pb-2 border-b border-slate-100">
          <Logo variant="dark" size="lg" className="mx-auto" />
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Code-Free Editorial Access</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Newsroom CMS & Document Studio
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              కోడ్ అవసరం లేకుండా నేరుగా వార్తలు రాయడానికి, MS Word (.docx) మరియు PDF ఫైల్స్ అప్‌లోడ్ చేయడానికి లాగిన్ అవ్వండి.
            </p>
          </div>
        </div>

        {/* 1-CLICK CODE-FREE INSTANT ACCESS SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#990000]" />
              <span>1-Click Fast Sign In (కోడ్-రహిత ప్రవేశం)</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              No Coding Required
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {roles.map((r) => (
              <button
                key={r.role}
                type="button"
                disabled={loading}
                onClick={() => handleQuickLogin(r.role)}
                className="group p-3.5 rounded-2xl border-2 border-slate-200 hover:border-[#990000] bg-slate-50/70 hover:bg-white text-left transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-between gap-3 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                    {r.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-[#990000] transition-colors">
                        {r.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 group-hover:bg-red-100 group-hover:text-red-800 transition-colors">
                        {r.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">
                      {r.titleTe} • User: {r.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {r.desc}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#990000] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Passcode Dropdown (For Extra Security) */}
        <div className="pt-2 border-t border-slate-100">
          <details className="group text-xs">
            <summary className="cursor-pointer text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-between py-1">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Security PIN / Custom Passcode Option</span>
              </span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>

            <form onSubmit={handleStandardLogin} className="mt-3 space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Passcode:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Default passcode: <code className="font-bold text-slate-700">newsroom2026</code>
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Login with PIN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </details>
        </div>

        {/* Footer Return Link */}
        <div className="text-center pt-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <a
            href="/te"
            className="hover:text-[#990000] font-semibold transition-colors"
          >
            ← తెలుగు హోమ్‌పేజీ
          </a>
          <a
            href="/en"
            className="hover:text-[#990000] font-semibold transition-colors"
          >
            English Homepage →
          </a>
        </div>
      </div>
    </div>
  );
}
