'use client';

import { useEffect, useRef, useState } from 'react';
import { adminRequest } from '@/lib/admin-client';
import type { StaffInput, StaffMember } from '@/types/staff';

const empty: StaffInput = { name: '', idNumber: '', age: 18, fatherName: '', designation: '', experience: '', accreditationNumber: '', dateOfJoining: '', photoUrl: '', joiningLetterUrl: '' };
const fields = [
  { key: 'name', label: 'Name', max: 200 },
  { key: 'idNumber', label: 'ID number', max: 80 },
  { key: 'age', label: 'Age', type: 'number', max: 3 },
  { key: 'fatherName', label: 'Father’s name', max: 200 },
  { key: 'designation', label: 'Designation', max: 200 },
  { key: 'experience', label: 'Experience in the field', max: 2000 },
  { key: 'accreditationNumber', label: 'Accreditation number (optional)', max: 100 },
  { key: 'dateOfJoining', label: 'Date of joining', type: 'date', max: 10 },
] as const;

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [form, setForm] = useState<StaffInput>({ ...empty });
  const [editing, setEditing] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [letter, setLetter] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => { adminRequest<{ staff: StaffMember[] }>('/api/admin/staff').then(data => setStaff(data.staff)).catch(error => setError(error.message)).finally(() => setLoading(false)); }, []);
  function reset() { setForm({ ...empty }); setEditing(''); setPhoto(null); setLetter(null); setFileKey(key => key + 1); }
  async function upload(file: File, kind: string) {
    const data = new FormData(); data.set('file', file); data.set('kind', kind);
    return (await adminRequest<{ url: string }>('/api/admin/staff/upload', { method: 'POST', body: data })).url;
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const values = { ...form };
      if (photo) { values.photoUrl = await upload(photo, 'photo'); setForm(current => ({ ...current, photoUrl: values.photoUrl })); setPhoto(null); }
      if (letter) { values.joiningLetterUrl = await upload(letter, 'letter'); setForm(current => ({ ...current, joiningLetterUrl: values.joiningLetterUrl })); setLetter(null); }
      const { member } = await adminRequest<{ member: StaffMember }>(editing ? `/api/admin/staff/${editing}` : '/api/admin/staff', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      setStaff(current => [member, ...current.filter(item => item.id !== member.id)]);
      setMessage(editing ? 'Staff details updated.' : 'Staff member enrolled.'); reset();
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to save staff details.'); }
    finally { setBusy(false); }
  }
  async function remove(member: StaffMember) {
    if (!window.confirm(`Remove ${member.name} (${member.idNumber}) from the staff register?`)) return;
    setBusy(true); setError(''); setMessage('');
    try {
      await adminRequest(`/api/admin/staff/${member.id}`, { method: 'DELETE' });
      setStaff(current => current.filter(item => item.id !== member.id));
      if (editing === member.id) reset();
      setMessage('Staff member removed.');
    } catch (error) { setError(error instanceof Error ? error.message : 'Unable to remove staff member.'); }
    finally { setBusy(false); }
  }
  function selectFile(file: File | undefined, kind: 'photo' | 'letter') {
    if (file && (!file.size || file.size > 4 * 1024 * 1024)) { setError('Select a non-empty file up to 4 MB.'); return; }
    setError(''); if (kind === 'photo') setPhoto(file || null); else setLetter(file || null);
  }
  const visible = staff.filter(member => [member.name, member.idNumber, member.designation].some(value => value.toLowerCase().includes(search.toLowerCase())));
  return <div className="max-w-5xl mx-auto space-y-6">
    <div><h1 className="text-2xl font-black">Editors &amp; Reporters</h1><p className="text-sm text-slate-500 mt-1">Enroll staff, update their details, and remove members from the register.</p></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 text-red-800 p-3">{error}</p>}
    {message && <p role="status" className="rounded-lg bg-emerald-50 text-emerald-800 p-3">{message}</p>}
    <form ref={formRef} onSubmit={save} className="bg-white border rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-bold">{editing ? 'Edit staff member' : 'Enroll editor or reporter'}</h2>
      <fieldset disabled={busy || loading} className="space-y-5 disabled:opacity-60">
        <div className="grid sm:grid-cols-2 gap-5">{fields.map(field => <label key={field.key} className="text-sm font-semibold">{field.label}
          <input required={field.key !== 'accreditationNumber'} type={'type' in field ? field.type : 'text'} min={field.key === 'age' ? 18 : undefined} max={field.key === 'age' ? 100 : undefined} step={field.key === 'age' ? 1 : undefined} maxLength={field.max} value={form[field.key]} onChange={event => setForm({ ...form, [field.key]: field.key === 'age' ? (event.target.value === '' ? '' : Number(event.target.value)) : event.target.value } as StaffInput)} className="block w-full border rounded-lg p-2.5 mt-1 font-normal" />
        </label>)}</div>
        <div key={fileKey} className="grid sm:grid-cols-2 gap-5">
          <div><label className="text-sm font-semibold">Upload reporter photo<input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={event => selectFile(event.target.files?.[0], 'photo')} className="block w-full text-sm mt-2 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:p-2" /></label><p className="text-xs text-slate-500 mt-2">JPG, PNG or WebP · Up to 4 MB</p>{form.photoUrl && <div className="flex items-center gap-3 mt-3"><img src={form.photoUrl} alt="Staff photo" className="w-16 h-16 rounded-lg object-cover" /><button type="button" onClick={() => { setForm({ ...form, photoUrl: '' }); setPhoto(null); setFileKey(key => key + 1); }} className="text-sm text-red-700">Remove photo</button></div>}</div>
          <div><label className="text-sm font-semibold">Upload joining letter<input type="file" accept=".pdf,.jpg,.jpeg" onChange={event => selectFile(event.target.files?.[0], 'letter')} className="block w-full text-sm mt-2 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:p-2" /></label><p className="text-xs text-slate-500 mt-2">PDF or JPG · Up to 4 MB</p>{form.joiningLetterUrl && <div className="flex gap-3 mt-3 text-sm"><a href={form.joiningLetterUrl} target="_blank" rel="noreferrer" className="underline">View joining letter</a><button type="button" onClick={() => { setForm({ ...form, joiningLetterUrl: '' }); setLetter(null); setFileKey(key => key + 1); }} className="text-red-700">Remove letter</button></div>}</div>
        </div>
        <div className="flex gap-3"><button className="px-5 py-2.5 rounded-lg bg-brand-navy text-white font-bold">{busy ? 'Saving…' : editing ? 'Save changes' : 'Enroll staff member'}</button>{editing && <button type="button" onClick={reset} className="px-4 py-2 border rounded-lg">Cancel editing</button>}</div>
      </fieldset>
    </form>
    <section className="bg-white border rounded-xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold">Staff register ({staff.length})</h2><input aria-label="Search staff by name, ID or designation" placeholder="Search name, ID or designation" value={search} onChange={event => setSearch(event.target.value)} className="border rounded-lg p-2 text-sm w-full sm:w-72" /></div>
      {loading ? <p role="status">Loading staff…</p> : visible.length === 0 ? <p className="text-slate-500">{search ? 'No matching staff members.' : 'No staff enrolled yet.'}</p> : <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr className="border-b text-slate-500"><th className="p-3">Name / ID</th><th className="p-3">Designation</th><th className="p-3">Date of joining</th><th className="p-3">Actions</th></tr></thead><tbody>{visible.map(member => <tr key={member.id} className="border-b last:border-0"><td className="p-3"><strong>{member.name}</strong><div className="text-slate-500">{member.idNumber}</div></td><td className="p-3">{member.designation}</td><td className="p-3 whitespace-nowrap">{member.dateOfJoining}</td><td className="p-3"><div className="flex gap-4"><button disabled={busy} className="font-semibold underline" onClick={() => { const { id, createdAt, updatedAt, ...values } = member; setEditing(id); setForm(values); setPhoto(null); setLetter(null); setFileKey(key => key + 1); setError(''); setMessage(''); formRef.current?.scrollIntoView({ behavior: 'smooth' }); }}>Edit</button><button disabled={busy} className="text-red-700 font-semibold" onClick={() => remove(member)}>Remove</button></div></td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}
