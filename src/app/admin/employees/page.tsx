'use client';
import { useEffect, useState, FormEvent } from 'react';
import { adminRequest } from '@/lib/admin-client';
import { AuthorAvatar } from '@/components/article/AuthorAvatar';

type Employee = { id: string; name: string; email: string; avatar?: string; createdAt: string; removedAt?: string };
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [search, setSearch] = useState('');
  const [removing, setRemoving] = useState<Employee | null>(null);
  async function refresh() {
    const data = await adminRequest<{ employees: Employee[] }>('/api/admin/employees');
    setEmployees(data.employees); setAllowed(true);
  }
  useEffect(() => { refresh().catch(err => setError(err.message)).finally(() => setLoading(false)); }, []);
  async function enroll(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const { employee } = await adminRequest<{ employee: Employee }>('/api/admin/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, avatar }) });
      setEmployees(items => [...items, employee]); setName(''); setEmail(''); setPassword(''); setAvatar('');
      setMessage(`${employee.name} enrolled and added to Assigned Author. They can now sign in at /admin/login.`);
    } catch (err) { setError(err instanceof Error ? err.message : 'Enrollment failed.'); }
    finally { setBusy(false); }
  }
  async function uploadPhoto(file?: File, employee?: Employee) {
    if (!file) return;
    setBusy(true); setError(''); setMessage('');
    try {
      if (file.size > 4 * 1024 * 1024 || !/\.(jpe?g|png|webp)$/i.test(file.name)) throw new Error('Choose a JPG, PNG or WebP photo up to 4 MB.');
      const form = new FormData(); form.set('file', file);
      const photo = await adminRequest<{ avatar: string }>('/api/admin/employee-photo', { method: 'POST', body: form });
      if (employee) {
        const saved = await adminRequest<{ employee: Employee }>('/api/admin/employees', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: employee.id, avatar: photo.avatar }) });
        setEmployees(items => items.map(item => item.id === employee.id ? saved.employee : item));
        setMessage(`${employee.name}'s author photo has been updated.`);
      } else { setAvatar(photo.avatar); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Photo upload failed.'); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!removing) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const { employee } = await adminRequest<{ employee: Employee }>('/api/admin/employees', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: removing.id }) });
      setEmployees(items => items.map(item => item.id === employee.id ? employee : item));
      setRemoving(null); setMessage(`${employee.name}'s CMS access has been removed.`);
    } catch (err) { setError(err instanceof Error ? err.message : 'Removal failed.'); }
    finally { setBusy(false); }
  }
  const visible = employees.filter(item => `${item.name} ${item.email}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="max-w-6xl mx-auto space-y-6">
    <div><h1 className="text-3xl font-black text-brand-navy">Employees</h1><p className="text-slate-600 mt-2">Enroll newsroom employees and manage their CMS access.</p></div>
    {error && <p role="alert" className="bg-red-50 text-red-800 p-4 rounded-xl">{error}</p>}
    {message && <p role="status" className="bg-green-50 text-green-800 p-4 rounded-xl">{message}</p>}
    {loading ? <p role="status">Loading employees…</p> : allowed && <>
      <form onSubmit={enroll} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-xl font-bold">Enroll employee</h2>
        <p className="text-sm text-slate-600">Employees receive Editor access to the existing newsroom tools, including publishing, uploads, settings and subscriber records. Only the owner can manage employees. Share the login details privately.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="text-sm font-semibold">Full name<input required maxLength={120} value={name} onChange={e => setName(e.target.value)} className="block w-full border rounded-lg p-3 mt-1" autoComplete="name" /></label>
          <label className="text-sm font-semibold">Email address<input required type="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="block w-full border rounded-lg p-3 mt-1" autoComplete="off" /></label>
          <label className="text-sm font-semibold">Login password<input required type="password" minLength={12} maxLength={1024} value={password} onChange={e => setPassword(e.target.value)} className="block w-full border rounded-lg p-3 mt-1" autoComplete="new-password" /><span className="text-xs text-slate-500">At least 12 characters</span></label>
        </div>
        <div className="flex items-center gap-4">
          <AuthorAvatar author={{ name: name || 'Employee photo', avatar: avatar || '/brand/sunrise-news-logo.jpg', avatarFit: avatar ? 'cover' : 'contain' }} className="h-16 w-16 border" />
          <label className="text-sm font-semibold">Profile photo (optional)
            <input disabled={busy} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; void uploadPhoto(file); }} className="block mt-2 max-w-full text-sm" />
            <span className="block text-xs font-normal text-slate-500 mt-1">JPG, PNG or WebP · Up to 4 MB. Shown beside their published articles.</span>
          </label>
        </div>
        <p className="text-sm text-slate-600">Employees automatically appear in Assigned Author when writing a story.</p>
        <button disabled={busy} className="bg-brand-orange text-white rounded-lg px-5 py-3 font-bold disabled:opacity-50">{busy ? 'Saving…' : 'Enroll employee'}</button>
      </form>
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-bold">Employee directory <span className="text-sm text-slate-500">({employees.filter(item => !item.removedAt).length} active)</span></h2><label className="text-sm">Search employees<input type="search" value={search} onChange={e => setSearch(e.target.value)} className="border rounded-lg p-2 ml-2" /></label></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="p-3">Employee</th><th className="p-3">Access</th><th className="p-3">Enrolled</th><th className="p-3">Action</th></tr></thead><tbody>
          {visible.map(item => <tr key={item.id} className="border-b"><td className="p-3"><div className="flex items-center gap-3"><AuthorAvatar author={{ name: item.name, avatar: item.avatar || '/brand/sunrise-news-logo.jpg', avatarFit: item.avatar ? 'cover' : 'contain' }} className="h-12 w-12 border" /><div><p className="font-bold">{item.name}</p><p className="text-slate-500">{item.email}</p></div></div></td><td className="p-3">{item.removedAt ? 'Removed' : 'Active · Editor'}</td><td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td><td className="p-3">{!item.removedAt && <div className="space-y-3"><label className="block text-brand-navy font-semibold">{item.avatar ? 'Change photo' : 'Add photo'}<input aria-label={`Photo for ${item.name}`} disabled={busy} type="file" accept="image/jpeg,image/png,image/webp" className="block mt-1 text-xs max-w-52" onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; void uploadPhoto(file, item); }} /></label><button disabled={busy} onClick={() => setRemoving(item)} className="text-red-700 font-semibold disabled:opacity-50" aria-label={`Remove ${item.name}`}>Remove access</button></div>}</td></tr>)}
          {!visible.length && <tr><td colSpan={4} className="p-6 text-center text-slate-500">{employees.length ? 'No matching employees.' : 'No employees enrolled yet.'}</td></tr>}
        </tbody></table></div>
      </section>
      {removing && <section role="alertdialog" aria-labelledby="remove-title" aria-describedby="remove-description" className="border border-red-200 rounded-xl bg-red-50 p-5 space-y-3"><h2 id="remove-title" className="font-bold">Remove {removing.name}'s access?</h2><p id="remove-description">{removing.email} will be unable to sign in and existing sessions will be revoked. Their articles and audit history will be retained.</p><div className="flex gap-3"><button disabled={busy} onClick={remove} className="bg-red-700 text-white rounded-lg px-4 py-2 disabled:opacity-50">Confirm removal</button><button disabled={busy} onClick={() => setRemoving(null)} className="border rounded-lg px-4 py-2">Cancel</button></div></section>}
    </>}
  </div>;
}
