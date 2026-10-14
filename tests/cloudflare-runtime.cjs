const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { Miniflare, convertV4MiniflareOptions } = require('miniflare');

test('Cloudflare runtime persists multi-chunk objects and atomically rejects competing writes', async () => {
  const runtime = new Miniflare(convertV4MiniflareOptions({
    modules: true, scriptPath: path.join(__dirname, '../worker/cms-object.mjs'),
    compatibilityDate: '2026-10-14', compatibilityFlags: ['nodejs_compat'],
    durableObjects: { CMS_DATA: { className: 'CMSData', useSQLite: true } },
  }));
  try {
    const namespace = await runtime.getDurableObjectNamespace('CMS_DATA');
    const object = namespace.get(namespace.idFromName('test-object'));
    const url = 'https://storage.internal/value';
    assert.equal((await object.fetch(url)).status, 404);
    const bytes = Buffer.alloc(4 * 1024 * 1024, 67);
    const saved = await object.fetch(url, { method: 'PUT', body: bytes, headers: { 'if-none-match': '*', 'x-media-metadata': '%7B%22name%22%3A%22paper.pdf%22%7D' } });
    assert.equal(saved.status, 201);
    const read = await object.fetch(url);
    assert.equal(read.headers.get('x-media-metadata'), '%7B%22name%22%3A%22paper.pdf%22%7D');
    assert.deepEqual(Buffer.from(await read.arrayBuffer()), bytes);
    const etag = saved.headers.get('etag');
    const writes = await Promise.all(['first', 'second'].map(body => object.fetch(url, { method: 'PUT', body, headers: { 'if-match': etag } })));
    assert.deepEqual(writes.map(response => response.status).sort(), [201, 412]);
    assert.equal((await object.fetch(url, { method: 'PUT', body: 'overwrite', headers: { 'if-none-match': '*' } })).status, 412);
    assert.ok(['first', 'second'].includes(await (await object.fetch(url)).text()));
    assert.equal((await object.fetch(url, { method: 'PUT', body: 'unguarded' })).status, 412);
  } finally { await runtime.dispose(); }
});
