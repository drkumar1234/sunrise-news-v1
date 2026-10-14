import 'server-only';
import { createHash } from 'node:crypto';
import type { ConditionalJSONStore } from './storage';

interface ObjectNamespace {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(request: Request): Promise<Response> };
}

async function object(store: string, key: string) {
  const { getCloudflareContext } = await import('@opennextjs/cloudflare');
  const { env } = await getCloudflareContext({ async: true });
  const namespace = (env as unknown as { CMS_DATA?: ObjectNamespace }).CMS_DATA;
  if (!namespace) throw new Error('Cloudflare CMS_DATA binding is not configured.');
  const name = createHash('sha256').update(JSON.stringify([store, key])).digest('hex');
  return namespace.get(namespace.idFromName(name));
}

async function read(store: string, key: string) {
  const response = await (await object(store, key)).fetch(new Request('https://storage.internal/value'));
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Cloudflare storage read failed.');
  return response;
}

export function cloudflareJSONStore(store: string): ConditionalJSONStore {
  return {
    async getWithMetadata(key) {
      const response = await read(store, key);
      return response ? { data: await response.json(), etag: response.headers.get('etag') || undefined } : null;
    },
    async setJSON(key, value, condition) {
      const response = await (await object(store, key)).fetch(new Request('https://storage.internal/value', {
        method: 'PUT', body: JSON.stringify(value), headers: {
          'content-type': 'application/json',
          ...('onlyIfNew' in condition ? { 'if-none-match': '*' } : { 'if-match': condition.onlyIfMatch }),
        },
      }));
      if (response.status === 412) return { modified: false };
      if (!response.ok) throw new Error('Cloudflare storage write failed.');
      return { modified: true, etag: response.headers.get('etag') || undefined };
    },
  };
}

export async function saveCloudflareMedia(key: string, data: ArrayBuffer, metadata: object) {
  const response = await (await object('sunrise-media', key)).fetch(new Request('https://storage.internal/value', {
    method: 'PUT', body: data, headers: {
      'if-none-match': '*', 'content-type': 'application/octet-stream',
      'x-media-metadata': encodeURIComponent(JSON.stringify(metadata)),
    },
  }));
  if (!response.ok || !response.headers.get('etag')) throw new Error('Cloudflare upload could not be saved.');
}

export async function readCloudflareMedia(key: string) {
  const response = await read('sunrise-media', key);
  if (!response) return null;
  return { data: await response.arrayBuffer(), metadata: JSON.parse(decodeURIComponent(response.headers.get('x-media-metadata') || '')) };
}
