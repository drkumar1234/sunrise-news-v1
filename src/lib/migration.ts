import { createHash } from 'node:crypto';
import { ApiError } from './auth';
import { object } from './validation';
import type { Employee } from './employees';
import type { MediaMetadata } from './media-store';

export type MigrationMedia = { key: string; sha256: string; metadata: MediaMetadata };
export type MigrationBackup = { format: 'sunrise-netlify-backup-v1'; database: Record<string, unknown>; employees: Employee[]; media: MigrationMedia[] };
export const MEDIA_KEY = /^[0-9a-f-]{36}\.(pdf|docx|txt|md|jpe?g|png|webp)$/;
export function fingerprint(value: unknown) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
export function fileHash(value: Uint8Array) { return createHash('sha256').update(value).digest('hex'); }
export function validateBackup(value: unknown): MigrationBackup {
  const input = object(value);
  if (input.format !== 'sunrise-netlify-backup-v1') throw new ApiError(400, 'Unsupported backup format.');
  const database = object(input.database);
  for (const name of ['articles', 'categories', 'tags', 'authors', 'adPlacements', 'auditLogs', 'revisions', 'subscribers', 'epapers']) {
    if (!Array.isArray(database[name])) throw new ApiError(400, `Backup is missing ${name}.`);
  }
  object(database.settings);
  if (!Array.isArray(input.employees) || !Array.isArray(input.media)) throw new ApiError(400, 'Incomplete backup manifest.');
  const identities = new Set<string>();
  const activeEmails = new Set<string>();
  for (const value of input.employees) {
    const employee = object(value);
    if (typeof employee.id !== 'string' || !employee.id.startsWith('employee-') || identities.has(employee.id)
      || employee.role !== 'editor' || typeof employee.name !== 'string' || typeof employee.email !== 'string'
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email) || typeof employee.createdAt !== 'string'
      || typeof employee.salt !== 'string' || !/^[0-9a-f]{64}$/.test(employee.salt)
      || typeof employee.passwordHash !== 'string' || !/^[0-9a-f]{128}$/.test(employee.passwordHash)) throw new ApiError(400, 'Invalid employee registry.');
    identities.add(employee.id);
    if (!employee.removedAt) {
      const email = employee.email.toLowerCase();
      if (activeEmails.has(email) || email === process.env.ADMIN_EMAIL?.trim().toLowerCase()) throw new ApiError(400, 'Employee emails conflict with the owner or each other.');
      activeEmails.add(email);
    }
  }
  const keys = new Set<string>();
  for (const value of input.media) {
    const entry = object(value);
    const metadata = object(entry.metadata);
    if (typeof entry.key !== 'string' || !MEDIA_KEY.test(entry.key) || keys.has(entry.key)
      || typeof entry.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(entry.sha256)
      || typeof metadata.name !== 'string' || !metadata.name || metadata.name.length > 180
      || typeof metadata.contentType !== 'string' || typeof metadata.size !== 'number'
      || !Number.isSafeInteger(metadata.size) || metadata.size < 1 || metadata.size > 4 * 1024 * 1024) throw new ApiError(400, 'Invalid media manifest.');
    keys.add(entry.key);
  }
  const referencedKeys = JSON.stringify(database).matchAll(/\/api\/media\/([0-9a-f-]{36}\.(?:pdf|docx|txt|md|jpe?g|png|webp))/g);
  for (const reference of Array.from(referencedKeys)) if (!keys.has(reference[1])) throw new ApiError(400, 'The backup manifest omits a referenced upload.');
  return input as unknown as MigrationBackup;
}
