'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { adminRequest } from '@/lib/admin-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminRequest('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      setPassword('');
      router.replace('/admin');
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.'); }
    finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <Logo variant="dark" size="lg" className="mx-auto" />
        <div className="text-center">
          <LockKeyhole className="w-7 h-7 mx-auto mb-3 text-brand-orange" />
          <h1 className="text-2xl font-black text-slate-900">Newsroom sign in</h1>
          <p className="text-sm text-slate-500 mt-2">Sign in with your owner or enrolled employee account to manage Sunrise News.</p>
        </div>
        <form onSubmit={signIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">Email address</label>
            <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={1024} value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3" />
          </div>
          {error && <p role="alert" className="p-3 rounded-lg bg-red-50 text-red-800 text-sm">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-brand-navy text-white font-bold p-3 flex justify-center items-center gap-2 disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <div className="flex justify-between text-sm text-slate-600 border-t pt-4">
          <Link href="/te">తెలుగు వార్తలు</Link><Link href="/en">English website</Link>
        </div>
      </div>
    </main>
  );
}
