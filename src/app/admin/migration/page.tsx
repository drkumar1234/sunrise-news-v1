'use client';
import { useEffect, useState } from 'react';
import { adminRequest } from '@/lib/admin-client';

type Status = { backend: string; databaseHash: string; employeesHash: string; counts: Record<string, number> };
type Backup = { format: string; database: unknown; employees: unknown[]; media: { key: string; sha256: string; metadata: { name: string; contentType: string; size: number } }[] };
export default function MigrationPage() {
  const [status, setStatus] = useState<Status>();
  const [backupFile, setBackupFile] = useState<File>();
  const [backup, setBackup] = useState<Backup>();
  const [media, setMedia] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [verified, setVerified] = useState(false);
  async function refresh() { setStatus(await adminRequest<Status>('/api/admin/migration')); }
  useEffect(() => { refresh().catch(err => setError(err.message)); }, []);
  async function selectBackup(file?: File) {
    setError(''); setVerified(false); setBackup(undefined); setBackupFile(file);
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.format !== 'sunrise-netlify-backup-v1' || !Array.isArray(data.media)) throw new Error('Select a Sunrise Netlify backup manifest.');
      setBackup(data);
    } catch (error) { setError(error instanceof Error ? error.message : 'Invalid backup.'); }
  }
  async function verifyMedia() {
    if (!backup) return;
    setBusy(true); setError(''); setVerified(false);
    try {
      const files = new Map(media.map(file => [file.name, file]));
      for (const entry of backup.media) if (!files.has(entry.key)) throw new Error(`Missing file: ${entry.key}`);
      let complete = 0;
      for (const entry of backup.media) {
        const form = new FormData();
        form.set('kind', 'media'); form.set('file', files.get(entry.key)!); form.set('key', entry.key); form.set('metadata', JSON.stringify(entry.metadata)); form.set('sha256', entry.sha256);
        setMessage(`Verifying and transferring upload ${complete + 1} of ${backup.media.length}…`);
        await adminRequest('/api/admin/migration', { method: 'POST', body: form });
        complete++;
      }
      setVerified(true); setMessage(`All ${complete} uploads are verified on Cloudflare. The source URLs have been preserved.`);
    } catch (error) { setError(error instanceof Error ? error.message : 'Upload transfer failed.'); }
    finally { setBusy(false); }
  }
  async function importDatabase() {
    if (!backupFile || !status || !verified) return;
    setBusy(true); setError('');
    try {
      const form = new FormData(); form.set('kind', 'database'); form.set('file', backupFile); form.set('expectedHash', status.databaseHash); form.set('expectedEmployeesHash', status.employeesHash);
      const result = await adminRequest<{ backupId: string; counts: Record<string, number>; verifiedMedia: number }>('/api/admin/migration', { method: 'POST', body: form });
      setMessage(`Migration complete: ${Object.entries(result.counts).map(([name, count]) => `${count} ${name}`).join(', ')}; ${result.verifiedMedia} verified uploads. Destination backup: ${result.backupId}.`);
      await refresh();
    } catch (error) { setError(error instanceof Error ? error.message : 'Import failed.'); }
    finally { setBusy(false); }
  }
  return <div className="max-w-4xl mx-auto space-y-6">
    <h1 className="text-3xl font-black">Netlify data migration</h1>
    <p className="text-slate-600">Transfer the complete newsroom backup to Cloudflare. Uploads retain their original URLs; the current destination database is backed up before import.</p>
    {error && <p role="alert" className="bg-red-50 text-red-800 rounded-xl p-4">{error}</p>}
    {message && <p role="status" className="bg-green-50 text-green-800 rounded-xl p-4">{message}</p>}
    {status && <section className="bg-white border rounded-xl p-5"><h2 className="font-bold">Current destination</h2><p>{status.backend} · {Object.entries(status.counts).map(([name,count])=>`${count} ${name}`).join(' · ')}</p></section>}
    {status?.backend === 'cloudflare' && <section className="bg-white border rounded-xl p-6 space-y-5">
      <label className="block font-semibold">Backup manifest<input disabled={busy} type="file" accept="application/json,.json" onChange={event=>selectBackup(event.target.files?.[0])} className="block mt-2" /></label>
      {backup && <p>{backup.media.length} uploads listed in the backup.</p>}
      <label className="block font-semibold">Original upload files<input disabled={busy} multiple type="file" onChange={event=>{setMedia(Array.from(event.target.files || []));setVerified(false);}} className="block mt-2" /></label>
      <button disabled={busy || !backup} onClick={verifyMedia} className="rounded-lg bg-slate-900 text-white px-4 py-3 disabled:opacity-50">Transfer and verify uploads</button>
      <p className="text-sm text-slate-600">Import replaces this destination’s article database and transfers employee password hashes. It does not change the owner password or delete Netlify data. Concurrent destination edits stop the import.</p>
      <button disabled={busy || !verified} onClick={importDatabase} className="rounded-lg bg-brand-orange text-white px-4 py-3 font-bold disabled:opacity-50">Back up destination and import database</button>
    </section>}
  </div>;
}
