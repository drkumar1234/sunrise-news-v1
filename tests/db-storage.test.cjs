require('./helpers/register-server-ts.cjs');
const assert = require('node:assert/strict');
const { test, before, after } = require('node:test');
const { mkdir, mkdtemp, readFile, writeFile, rm } = require('node:fs/promises');
const path = require('node:path');
const { spawn } = require('node:child_process');
const db = require('../src/lib/db.ts');
const storage = require('../src/lib/storage.ts');
const seed = require('../data/sunrise_news.json');

// Let all writers release their locks before surfacing a failure or cleanup.
async function allSuccessful(promises) {
  const results = await Promise.allSettled(promises);
  const failures = results.filter(result => result.status === 'rejected');
  if (failures.length) throw new AggregateError(failures.map(result => result.reason), 'Concurrent operation failed');
  return results.map(result => result.value);
}

let dataDirectory;
let oldDirectory;
let oldBackend;
const editor = { id: 'test-editor', name: 'Test Editor', role: 'super_admin' };
const article = slug => ({
  slug, headline: `English ${slug}`, headlineTe: `తెలుగు ${slug}`,
  summary: 'English summary', summaryTe: 'తెలుగు సారాంశం',
  body: '<p>English body</p>', bodyTe: '<p>తెలుగు వార్త</p>',
  categoryId: seed.categories[0].id, authorId: seed.authors[0].id,
  location: 'Hyderabad', locationTe: 'హైదరాబాద్', language: 'en', status: 'draft',
  tags: [], featuredImage: '', imageCaption: '', imageCredit: '',
});

before(async () => {
  await mkdir(path.join(process.cwd(), 'work'), { recursive: true });
  dataDirectory = await mkdtemp(path.join(process.cwd(), 'work', 'db-test-'));
  oldDirectory = process.env.SUNRISE_DATA_DIR;
  oldBackend = process.env.SUNRISE_STORAGE;
  process.env.SUNRISE_DATA_DIR = dataDirectory;
  process.env.SUNRISE_STORAGE = 'local';
});

after(async () => {
  if (oldDirectory === undefined) delete process.env.SUNRISE_DATA_DIR;
  else process.env.SUNRISE_DATA_DIR = oldDirectory;
  if (oldBackend === undefined) delete process.env.SUNRISE_STORAGE;
  else process.env.SUNRISE_STORAGE = oldBackend;
  const workDirectory = path.resolve(process.cwd(), 'work');
  assert.ok(path.resolve(dataDirectory).startsWith(`${workDirectory}${path.sep}`));
  await rm(dataDirectory, { recursive: true, force: true });
});

test('initial migration preserves the checked-in newsroom articles', async () => {
  const snapshot = await db.getAllData();
  assert.deepEqual(snapshot.articles.map(item => item.id), seed.articles.map(item => item.id));
  assert.equal(snapshot.articles.length, seed.articles.length);
  assert.equal(snapshot.settings.siteNameEn, seed.settings.siteNameEn);
});

test('simultaneous saves keep every article and audit log with unique UUIDs', async () => {
  const initial = await db.getAllData();
  const created = await allSuccessful(Array.from({ length: 18 }, (_, i) => db.createArticle(article(`parallel-${i}`), editor)));
  const saved = await db.getAllData();
  assert.equal(saved.articles.length, initial.articles.length + created.length);
  assert.equal(saved.auditLogs.length, initial.auditLogs.length + created.length);
  assert.equal(new Set(created.map(item => item.id)).size, created.length);
  assert.equal(new Set(saved.auditLogs.map(item => item.id)).size, saved.auditLogs.length);
  for (const item of created) assert.equal((await db.getArticleById(item.id)).headline, item.headline);
});

test('competing writers cannot reserve the same article slug', async () => {
  const attempts = await Promise.allSettled([
    db.createArticle(article('unique-slug'), editor),
    db.createArticle(article('UNIQUE-SLUG'), editor),
  ]);
  assert.equal(attempts.filter(result => result.status === 'fulfilled').length, 1);
  const rejected = attempts.find(result => result.status === 'rejected');
  assert.equal(rejected.reason.status, 409);
  const another = await db.createArticle(article('other-slug'), editor);
  await assert.rejects(db.updateArticle(another.id, { slug: 'unique-slug' }, editor), error => error.status === 409);
  assert.equal((await db.getArticleRevisions(another.id)).length, 0);
});

test('revision restore recovers English and Telugu content atomically', async () => {
  const original = await db.createArticle(article('bilingual-revision'), editor);
  await db.updateArticle(original.id, {
    headline: 'Updated English', headlineTe: 'మార్చిన శీర్షిక', summary: 'Changed summary',
    summaryTe: 'మార్చిన సారాంశం', body: '<p>Changed body</p>', bodyTe: '<p>మార్చిన వార్త</p>',
  }, editor);
  const [revision] = await db.getArticleRevisions(original.id);
  const restored = await db.restoreRevision(original.id, revision.id, editor);
  for (const field of ['headline', 'headlineTe', 'summary', 'summaryTe', 'body', 'bodyTe']) {
    assert.equal(restored[field], original[field]);
  }
  assert.equal((await db.getArticleRevisions(original.id)).length, 2);
  assert.equal((await db.getArticleById(original.id)).bodyTe, original.bodyTe);
});

test('request reads observe saved settings and an unknown category returns no stories', async () => {
  await db.updateSettings({ siteNameEn: 'Persistence test' }, editor);
  assert.equal((await db.getSettings()).siteNameEn, 'Persistence test');
  assert.deepEqual(await db.getArticles({ categorySlug: 'does-not-exist' }), { articles: [], total: 0 });
  assert.equal((await db.getArticles({ status: 'all', limit: 0 })).articles.length, 0);
});

test('subscriber uniqueness and rate limits survive simultaneous requests', async () => {
  await allSuccessful(Array.from({ length: 8 }, () => db.addSubscriber(' TEST@example.com ', 'te')));
  assert.equal((await db.getSubscribers()).filter(item => item.email === 'test@example.com').length, 1);
  const allowed = await allSuccessful(Array.from({ length: 12 }, () => storage.consumeRateLimit('test-ip', 3, 60_000)));
  assert.equal(allowed.filter(Boolean).length, 3);
  assert.equal(await storage.consumeRateLimit('test-ip', 3, 60_000), false);
});

test('local file locking prevents lost writes across independent Node processes', async () => {
  const registration = path.join(__dirname, 'helpers', 'register-server-ts.cjs');
  const storagePath = path.join(__dirname, '..', 'src', 'lib', 'storage.ts');
  const source = `require(${JSON.stringify(registration)}); const { mutateJSON } = require(${JSON.stringify(storagePath)}); (async () => { for (let i = 0; i < 6; i++) await mutateJSON('worker-test', 'counter', () => ({ value: 0 }), data => { data.value++; }); })().catch(error => { console.error(error); process.exitCode = 1; });`;
  await allSuccessful(Array.from({ length: 8 }, () => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['-e', source], { env: process.env, windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let errorText = '';
    child.stderr.on('data', chunk => { errorText += chunk; });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(errorText || `Worker exited ${code}`)));
  })));
  assert.deepEqual(await storage.readJSON('worker-test', 'counter', () => null), { value: 48 });
});

test('cloud compare-and-swap retries preserve concurrent updates and initialize only once', async () => {
  let document = null;
  let version = 0;
  let conflicts = 0;
  const store = {
    async getWithMetadata(_key, options) {
      assert.equal(options.consistency, 'strong');
      return document === null ? null : { data: structuredClone(document), etag: String(version) };
    },
    async setJSON(_key, value, condition) {
      if ((condition.onlyIfNew && document !== null) || (condition.onlyIfMatch && condition.onlyIfMatch !== String(version))) {
        conflicts++;
        return { modified: false };
      }
      document = structuredClone(value);
      version++;
      return { modified: true };
    },
  };
  await allSuccessful(Array.from({ length: 24 }, (_, i) => storage.mutateJSONWithCAS(store, 'db', () => ({ ids: [] }), data => data.ids.push(i))));
  assert.equal(document.ids.length, 24);
  assert.equal(new Set(document.ids).size, 24);
  assert.equal(version, 24);
  assert.ok(conflicts > 0);
});

test('cloud write failures and missing ETags are propagated', async () => {
  await assert.rejects(storage.mutateJSONWithCAS({
    async getWithMetadata() { return { data: {}, etag: undefined }; },
    async setJSON() { throw new Error('Must not write'); },
  }, 'key', () => ({}), () => true), /ETag/);
  await assert.rejects(storage.mutateJSONWithCAS({
    async getWithMetadata() { return null; },
    async setJSON() { throw new Error('Cloud unavailable'); },
  }, 'key', () => ({}), () => true), /Cloud unavailable/);
});

test('a corrupt local database fails visibly and is never overwritten with sample data', async () => {
  const filename = path.join(dataDirectory, 'sunrise_news.json');
  const saved = await readFile(filename, 'utf8');
  try {
    await writeFile(filename, '{broken json', 'utf8');
    await assert.rejects(db.getArticles(), SyntaxError);
    await assert.rejects(db.createArticle(article('corruption-test'), editor), SyntaxError);
    assert.equal(await readFile(filename, 'utf8'), '{broken json');
  } finally {
    await writeFile(filename, saved, 'utf8');
  }
  // The lock is released after a failed transaction.
  assert.ok(await db.createArticle(article('after-corruption'), editor));
});
