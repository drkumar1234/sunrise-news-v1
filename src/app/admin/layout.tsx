'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, PlusCircle, FolderTree,
  Tags, Radio, Megaphone, Users, History as HistoryIcon, Settings,
  LogOut, ExternalLink, ShieldAlert, ShieldCheck, Menu, X
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { adminRequest } from '@/lib/admin-client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; role: string; name: string } | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    if (pathname === '/admin/login') { setUser(null); return; }
    let active = true;
    adminRequest('/api/auth/session').then(data => { if (active) setUser(data.user); })
      .catch(() => { if (active) { setUser(null); router.replace('/admin/login'); } });
    return () => { active = false; };
  }, [pathname, router]);

  // If on login page, render children directly without dashboard chrome
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await adminRequest('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.replace('/admin/login');
      router.refresh();
    } catch (error) { setSessionError(error instanceof Error ? error.message : 'Sign out failed. Please retry.'); }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-slate-600">Checking newsroom session…</div>;

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ...(user.role === 'super_admin' ? [{ label: 'Employees', href: '/admin/employees', icon: Users }] : []),
    { label: 'All Articles', href: '/admin/articles', icon: FileText },
    { label: 'Write Story', href: '/admin/articles/editor', icon: PlusCircle, highlight: true },
    { label: 'E-paper Daily PDF', href: '/admin/epapers', icon: FileText },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Tags & Canonical', href: '/admin/tags', icon: Tags },
    { label: 'Breaking Ticker', href: '/admin/ticker', icon: Radio },
    { label: 'Ad Campaigns', href: '/admin/ads', icon: Megaphone },
    { label: 'Newsletter', href: '/admin/newsletter', icon: Users },
    { label: 'Audit Trail', href: '/admin/audit-logs', icon: HistoryIcon },
    { label: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen md:h-dvh md:overflow-hidden bg-slate-100 flex flex-col md:flex-row text-slate-900">
      {/* Mobile top bar */}
      <div className="md:hidden bg-brand-navy text-white p-4 flex items-center justify-between shadow">
        <Logo variant="light" size="sm" />
        <button
          type="button"
          aria-label={mobileNavOpen ? 'Close newsroom menu' : 'Open newsroom menu'}
          aria-expanded={mobileNavOpen}
          aria-controls="newsroom-sidebar"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-800"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        id="newsroom-sidebar"
        className={`w-full md:w-64 md:h-full md:overflow-y-auto bg-brand-navy-dark text-white flex-shrink-0 flex flex-col justify-between gap-6 p-4 ${
          mobileNavOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="hidden md:block pb-4 border-b border-slate-800">
            <Logo variant="light" size="md" />
            <span className="text-[10px] uppercase tracking-widest text-brand-orange font-bold block mt-1">
              NEWSROOM CMS 2.0
            </span>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Newsroom navigation" className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-orange text-white shadow'
                      : item.highlight
                      ? 'text-amber-300 hover:bg-slate-800'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Identity & Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Newsroom User'}</p>
              <span className="text-[10px] text-amber-400 font-semibold uppercase">
                {user?.role?.replace('_', ' ') || 'Super Admin'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 px-1 text-xs">
            <Link
              href="/en"
              target="_blank"
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px]"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar with quick shortcuts */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Newsroom Management:</span>
            <span className="text-xs font-bold text-brand-navy uppercase tracking-wider">
              Andhra Pradesh & Telangana Editions
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles/editor"
              className="px-3 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Story</span>
            </Link>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          {sessionError && <p role="alert" className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg">{sessionError}</p>}
          {children}
        </main>
      </div>
    </div>
  );
}
