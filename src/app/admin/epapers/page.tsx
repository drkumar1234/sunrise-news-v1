import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { EpaperUploadPanel } from '@/components/epaper/EpaperUploadPanel';

export const dynamic = 'force-dynamic';
export default async function EpaperAdminPage() {
  if (!await getSession(new Request('http://cms.local/admin/epapers', { headers: { cookie: (await cookies()).toString() } }))) redirect('/admin/login');
  return <div className="max-w-6xl mx-auto space-y-6"><h1 className="text-2xl md:text-3xl font-black text-slate-900">Daily E-paper Publishing</h1><EpaperUploadPanel /></div>;
}
