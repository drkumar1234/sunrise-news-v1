import { randomUUID } from 'node:crypto';
import { apiError, ApiError, json, requireOwner } from '@/lib/auth';
import { getAllData } from '@/lib/db';
import { readJSON, mutateJSON } from '@/lib/storage';
import { fileHash, fingerprint, MEDIA_KEY, validateBackup } from '@/lib/migration';
import { MAX_UPLOAD_BYTES, validateUpload } from '@/lib/media-store';
import type { Employee } from '@/lib/employees';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const emptyRegistry = () => ({ employees: [] as Employee[] });

async function state() {
  await getAllData();
  const [database, registry] = await Promise.all([
    readJSON<Record<string, unknown>>('sunrise-cms', 'database-v1', () => ({})),
    readJSON('sunrise-auth', 'employees-v1', emptyRegistry),
  ]);
  return { database, registry };
}

export async function GET(request: Request) {
  try {
    await requireOwner(request);
    const backupId = new URL(request.url).searchParams.get('backup');
    if (backupId) {
      if (!/^[0-9a-f-]{36}$/.test(backupId)) throw new ApiError(400, 'Invalid backup ID.');
      const backup = await readJSON('sunrise-migration', `backup-${backupId}`, () => null);
      if (!backup) throw new ApiError(404, 'Backup not found.');
      return json({ backup });
    }
    const { database, registry } = await state();
    if (new URL(request.url).searchParams.get('export') === '1') return json({ database, registry });
    return json({ backend: process.env.SUNRISE_STORAGE || 'local', databaseHash: fingerprint(database), employeesHash: fingerprint(registry), counts: {
      articles: (database.articles as unknown[]).length, revisions: (database.revisions as unknown[]).length,
      epapers: (database.epapers as unknown[]).length, subscribers: (database.subscribers as unknown[]).length,
      employees: registry.employees.length,
    } });
  } catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    await requireOwner(request);
    if (process.env.SUNRISE_STORAGE !== 'cloudflare') throw new ApiError(400, 'Imports are available only on the Cloudflare destination.');
    if (Number(request.headers.get('content-length') || 0) > 24 * 1024 * 1024) throw new ApiError(413, 'Import request is too large.');
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw new ApiError(400, 'Select a backup file.');
    const kind = form.get('kind');
    const { readCloudflareMedia, saveCloudflareMedia } = await import('@/lib/cloudflare-store');
    if (kind === 'media') {
      const key = String(form.get('key') || '');
      if (!MEDIA_KEY.test(key) || !file.size || file.size > MAX_UPLOAD_BYTES) throw new ApiError(400, 'Invalid upload key or size.');
      const metadata = JSON.parse(String(form.get('metadata') || '{}'));
      const bytes = new Uint8Array(await file.arrayBuffer());
      const validated = validateUpload(metadata.name, Buffer.from(bytes));
      if (!key.endsWith(validated.extension) || metadata.contentType !== validated.contentType || metadata.size !== bytes.byteLength
        || fileHash(bytes) !== form.get('sha256')) throw new ApiError(400, 'Upload does not match the backup manifest.');
      const existing = await readCloudflareMedia(key);
      if (existing) {
        if (fileHash(new Uint8Array(existing.data)) !== fileHash(bytes) || fingerprint(existing.metadata) !== fingerprint(metadata)) throw new ApiError(409, 'An upload with this key already has different content.');
      } else { await saveCloudflareMedia(key, bytes.buffer, metadata); }
      await mutateJSON<Record<string, { sha256: string; metadataHash: string }>, void>('sunrise-migration', 'verified-media-v1', () => ({}), current => {
        current[key] = { sha256: fileHash(bytes), metadataHash: fingerprint(metadata) };
      });
      return json({ key, sha256: fileHash(bytes), size: bytes.length });
    }
    if (kind !== 'database' || file.size > 20 * 1024 * 1024) throw new ApiError(400, 'Invalid database backup.');
    const backup = validateBackup(JSON.parse(await file.text()));
    // Import files first; published records never point at missing destination bytes.
    // Upload keys are immutable. Proofs are written only after byte verification,
    // so the final import can check the complete manifest in one storage read.
    const proofs = await readJSON<Record<string, { sha256: string; metadataHash: string }>>('sunrise-migration', 'verified-media-v1', () => ({}));
    for (const entry of backup.media) if (proofs[entry.key]?.sha256 !== entry.sha256 || proofs[entry.key]?.metadataHash !== fingerprint(entry.metadata)) throw new ApiError(409, `Upload ${entry.key} has not been verified on Cloudflare.`);
    const expectedHash = String(form.get('expectedHash') || '');
    const expectedEmployeesHash = String(form.get('expectedEmployeesHash') || '');
    const before = await state();
    if (fingerprint(before.database) !== expectedHash || fingerprint(before.registry) !== expectedEmployeesHash) throw new ApiError(409, 'Destination data changed. Refresh and review before importing.');
    if (before.registry.employees.length && fingerprint(before.registry.employees) !== fingerprint(backup.employees)) throw new ApiError(409, 'Existing destination employee accounts must be reconciled before importing.');
    const backupId = randomUUID();
    await mutateJSON('sunrise-migration', `backup-${backupId}`, () => before, () => undefined);
    const registry = { employees: backup.employees };
    await mutateJSON('sunrise-auth', 'employees-v1', emptyRegistry, current => {
      if (fingerprint(current) !== expectedEmployeesHash) throw new ApiError(409, 'Destination employees changed during import.');
      current.employees = backup.employees;
    });
    try {
      await mutateJSON<Record<string, unknown>, void>('sunrise-cms', 'database-v1', () => ({}), current => {
        if (fingerprint(current) !== expectedHash) throw new ApiError(409, 'Destination database changed during import.');
        for (const key of Object.keys(current)) delete current[key];
        Object.assign(current, backup.database);
      });
    } catch (error) {
      // Restore only if nobody edited the imported registry in the meantime.
      await mutateJSON('sunrise-auth', 'employees-v1', emptyRegistry, current => {
        if (fingerprint(current) === fingerprint(registry)) current.employees = before.registry.employees;
      });
      throw error;
    }
    const after = await state();
    return json({ imported: true, backupId, databaseHash: fingerprint(after.database), sourceDatabaseHash: fingerprint(backup.database), verifiedMedia: backup.media.length,
      counts: { articles: (after.database.articles as unknown[]).length, revisions: (after.database.revisions as unknown[]).length, epapers: (after.database.epapers as unknown[]).length, subscribers: (after.database.subscribers as unknown[]).length, employees: after.registry.employees.length } });
  } catch (error) { return apiError(error); }
}
