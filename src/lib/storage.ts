import 'server-only';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, open, readFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

/** A failed persistent write must be visible to callers; never report a false save. */
export class StorageConflictError extends Error {
  constructor() {
    super('The content changed repeatedly while saving. Please retry your change.');
    this.name = 'StorageConflictError';
  }
}

export function usesNetlifyStorage(): boolean {
  const backend = process.env.SUNRISE_STORAGE || 'local';
  if (backend !== 'local' && backend !== 'netlify') {
    throw new Error('SUNRISE_STORAGE must be local or netlify.');
  }
  return backend === 'netlify';
}

/** Site-wide stores survive deployments. No credentials are bundled in client code. */
export async function getCMSStore(name: string) {
  if (!usesNetlifyStorage()) {
    throw new Error('A Netlify store was requested while SUNRISE_STORAGE is local.');
  }
  const { getStore } = await import('@netlify/blobs');
  return getStore({ name, consistency: 'strong' });
}

export interface ConditionalJSONStore {
  getWithMetadata(key: string, options: { type: 'json'; consistency: 'strong' }): Promise<{
    data: unknown;
    etag?: string;
  } | null>;
  setJSON(key: string, value: unknown, options: { onlyIfNew: true } | { onlyIfMatch: string }): Promise<{
    modified: boolean;
  }>;
}

const pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Optimistic transaction over one JSON object. The synchronous callback may run
 * again after a conflict, so it must not send mail, upload files, or perform I/O.
 */
export async function mutateJSONWithCAS<T, R>(
  store: ConditionalJSONStore,
  key: string,
  fallback: () => T,
  change: (data: T) => R,
): Promise<R> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const current = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' });
    if (current && !current.etag) throw new Error('Persistent storage did not return an ETag.');
    const data = structuredClone(current ? current.data as T : fallback());
    const result = change(data);
    const saved = await store.setJSON(key, data, current
      ? { onlyIfMatch: current.etag! }
      : { onlyIfNew: true });
    if (saved.modified) return result;
    // Jitter avoids the same concurrent requests repeatedly colliding.
    await pause(Math.min(10 * (2 ** attempt), 200) + Math.floor(Math.random() * 20));
  }
  throw new StorageConflictError();
}

function localFilename(store: string, key: string): string {
  const root = path.resolve(process.env.SUNRISE_DATA_DIR || path.join(process.cwd(), 'data'));
  // Preserve the project's existing file for local development and migration.
  if (store === 'sunrise-cms' && key === 'database-v1') return path.join(root, 'sunrise_news.json');
  // Hash caller-supplied names so keys can never escape the private data directory.
  const storeName = createHash('sha256').update(store).digest('hex');
  const filename = createHash('sha256').update(key).digest('hex');
  return path.join(root, '.cms-store', storeName, `${filename}.json`);
}

function hasCode(error: unknown, code: string): boolean {
  return !!error && typeof error === 'object' && 'code' in error && error.code === code;
}

function isTransientWindowsError(error: unknown): boolean {
  // Windows can report sharing/deletion contention as EPERM instead of
  // EEXIST/EBUSY. Keep this workaround local; cloud authorization errors fail.
  return process.platform === 'win32' && ['EPERM', 'EACCES', 'EBUSY'].some(code => hasCode(error, code));
}

async function retryLocalFilesystem<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await operation(); }
    catch (error) {
      if (!isTransientWindowsError(error) || attempt >= 7) throw error;
      await pause(Math.min(10 * (2 ** attempt), 160));
    }
  }
}

async function readLocal<T>(filename: string, fallback: () => T): Promise<T> {
  try {
    return JSON.parse(await retryLocalFilesystem(() => readFile(filename, 'utf8'))) as T;
  } catch (error) {
    if (hasCode(error, 'ENOENT')) return structuredClone(fallback());
    // Corrupt files, permissions, and disk failures must not silently reset data.
    throw error;
  }
}

async function mutateLocal<T, R>(filename: string, fallback: () => T, change: (data: T) => R): Promise<R> {
  await retryLocalFilesystem(() => mkdir(path.dirname(filename), { recursive: true }));
  const lockPath = `${filename}.lock`;
  const deadline = Date.now() + 10_000;
  let lock;
  // Exclusive file creation coordinates both multiple processes and requests.
  while (!lock) {
    try {
      lock = await open(lockPath, 'wx', 0o600);
    } catch (error) {
      if (!hasCode(error, 'EEXIST') && !isTransientWindowsError(error)) throw error;
      if (Date.now() >= deadline) throw new Error(`Local data is locked. Retry, or remove the stale lock after stopping the server: ${lockPath}`);
      await pause(15 + Math.floor(Math.random() * 30));
    }
  }
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try {
    const data = await readLocal(filename, fallback);
    const result = change(data);
    const file = await retryLocalFilesystem(() => open(temporary, 'wx', 0o600));
    try {
      await file.writeFile(JSON.stringify(data, null, 2), 'utf8');
      await file.sync();
    } finally {
      await file.close();
    }
    await retryLocalFilesystem(() => rename(temporary, filename));
    return result;
  } finally {
    try {
      try { await retryLocalFilesystem(() => unlink(temporary)); } catch (error) { if (!hasCode(error, 'ENOENT')) throw error; }
    } finally {
      await lock.close();
      await retryLocalFilesystem(() => unlink(lockPath));
    }
  }
}

export async function readJSON<T>(store: string, key: string, fallback: () => T): Promise<T> {
  if (!usesNetlifyStorage()) return readLocal(localFilename(store, key), fallback);
  const found = await (await getCMSStore(store)).getWithMetadata(key, { type: 'json', consistency: 'strong' });
  return found ? found.data as T : structuredClone(fallback());
}

export async function mutateJSON<T, R>(
  store: string,
  key: string,
  fallback: () => T,
  change: (data: T) => R,
): Promise<R> {
  return usesNetlifyStorage()
    ? mutateJSONWithCAS(await getCMSStore(store), key, fallback, change)
    : mutateLocal(localFilename(store, key), fallback, change);
}

/** Shared across function instances and deployments; no per-process bypass. */
export async function consumeRateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs <= 0) {
    throw new Error('Invalid rate limit configuration.');
  }
  const hashedKey = createHash('sha256').update(key).digest('hex');
  return mutateJSON('sunrise-rate-limits', hashedKey, () => ({ startedAt: 0, count: 0 }), state => {
    // Measure when the transaction actually runs, not before waiting for its
    // lock: older queued requests must not reset a newer request's window.
    const now = Date.now();
    if (now - state.startedAt >= windowMs || state.startedAt > now) {
      state.startedAt = now;
      state.count = 0;
    }
    if (state.count >= limit) return false;
    state.count++;
    return true;
  });
}
