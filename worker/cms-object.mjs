// Each storage key has a separate Durable Object. Transactions make conditional
// writes atomic; chunks keep JSON and 4 MB uploads below the per-value limit.
const CHUNK_BYTES = 64 * 1024;
export class CMSData {
  constructor(state) { this.storage = state.storage; }

  async fetch(request) {
    if (request.method === 'GET') {
      return this.storage.transaction(async storage => {
        const metadata = await storage.get('metadata');
        if (!metadata) return new Response(null, { status: 404 });
        const chunks = [];
        for (let index = 0; index < metadata.chunks; index++) {
          const chunk = await storage.get(`chunk:${index}`);
          if (!chunk) throw new Error('Incomplete stored object.');
          chunks.push(chunk);
        }
        return new Response(new Blob(chunks), { headers: metadata.headers });
      });
    }
    if (request.method !== 'PUT') return new Response(null, { status: 405 });
    const bytes = new Uint8Array(await request.arrayBuffer());
    if (bytes.length > 24 * 1024 * 1024) return new Response(null, { status: 413 });
    return this.storage.transaction(async storage => {
      const previous = await storage.get('metadata');
      const expected = request.headers.get('if-match');
      const newOnly = request.headers.get('if-none-match') === '*';
      if ((!newOnly && !expected) || (newOnly && previous) || (expected && previous?.headers.etag !== expected)) {
        return new Response(null, { status: 412 });
      }
      const etag = `"${crypto.randomUUID()}"`;
      const chunks = Math.ceil(bytes.length / CHUNK_BYTES);
      for (let index = 0; index < chunks; index++) {
        await storage.put(`chunk:${index}`, bytes.slice(index * CHUNK_BYTES, (index + 1) * CHUNK_BYTES));
      }
      for (let index = chunks; index < (previous?.chunks || 0); index++) await storage.delete(`chunk:${index}`);
      const headers = { etag, 'content-type': request.headers.get('content-type') || 'application/octet-stream' };
      const mediaMetadata = request.headers.get('x-media-metadata');
      if (mediaMetadata) headers['x-media-metadata'] = mediaMetadata;
      await storage.put('metadata', { chunks, headers });
      return new Response(null, { status: 201, headers: { etag } });
    });
  }
}
