require('./helpers/register-server-ts.cjs');
const Module = require('node:module');
const path = require('node:path');
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  return originalLoad.call(this, request.startsWith('@/') ? path.join(process.cwd(), 'src', request.slice(2)) : request, parent, isMain);
};
const assert = require('node:assert/strict');
const { test, beforeEach, afterEach } = require('node:test');
const { mkdir, mkdtemp, rm } = require('node:fs/promises');
const auth = require('../src/lib/auth.ts');
const validation = require('../src/lib/validation.ts');
const storage = require('../src/lib/storage.ts');
const db = require('../src/lib/db.ts');
const login = require('../src/app/api/auth/login/route.ts');
const logout = require('../src/app/api/auth/logout/route.ts');
const session = require('../src/app/api/auth/session/route.ts');
const articles = require('../src/app/api/articles/route.ts');
const article = require('../src/app/api/articles/[id]/route.ts');
const restore = require('../src/app/api/articles/[id]/restore/route.ts');
const newsletter = require('../src/app/api/newsletter/route.ts');
const settings = require('../src/app/api/settings/route.ts');
const categories = require('../src/app/api/admin/categories/route.ts');
const tags = require('../src/app/api/admin/tags/route.ts');
const ads = require('../src/app/api/admin/ads/route.ts');
const audit = require('../src/app/api/admin/audit-logs/route.ts');
const search = require('../src/app/api/search/route.ts');
const catalog = require('../src/app/api/catalog/route.ts');
const epapers = require('../src/app/api/admin/epapers/route.ts');
const publicEpapers = require('../src/app/api/epapers/route.ts');
const employees = require('../src/app/api/admin/employees/route.ts');
const employeePhoto = require('../src/app/api/admin/employee-photo/route.ts');
const media = require('../src/app/api/media/[key]/route.ts');
const origin = 'https://sunrise.example';
let dataDirectory, oldEnvironment;
const environmentKeys = ['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'SESSION_SECRET', 'SUNRISE_DATA_DIR', 'SUNRISE_STORAGE', 'NETLIFY', 'NODE_ENV'];
const context = id => ({ params: Promise.resolve({ id }) });
const request = (method = 'GET', pathname = '/api/articles', data, cookie, suppliedOrigin = origin) => new Request(origin + pathname, {
  method,
  headers: { ...(method !== 'GET' ? { origin: suppliedOrigin, 'Content-Type': 'application/json' } : {}), ...(cookie ? { cookie } : {}) },
  ...(data === undefined ? {} : { body: JSON.stringify(data) }),
});
const signedCookie = async () => `${auth.SESSION_COOKIE}=${await auth.createSession()}`;

test('employee authors include existing accounts, keep credentials private, and publish their uploaded portrait with articles', async () => {
  const ownerCookie = await signedCookie();
  const accountResponse = await employees.POST(request('POST', '/api/admin/employees', { name: 'Photo Editor', email: 'private-editor@example.test', password: 'photo-editor-test-password' }, ownerCookie));
  assert.equal(accountResponse.status, 201);
  const account = (await accountResponse.json()).employee;
  const byline = (await db.getAuthors()).find(author => author.id === account.id);
  assert.equal(byline.name, account.name);
  assert.equal((await db.getAuthorBySlug(byline.slug)).id, account.id);
  assert.equal((await db.getAuthors()).filter(author => author.id === account.id).length, 1);
  const catalogData = await (await catalog.GET(request())).text();
  assert.ok(catalogData.includes('Photo Editor'));
  assert.ok(!catalogData.includes(account.email));
  assert.ok(!catalogData.includes('passwordHash'));
  const editorCookie = `${auth.SESSION_COOKIE}=${await auth.createSession(Date.now(), { id: account.id, name: account.name, role: 'editor' })}`;
  const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aG3sAAAAASUVORK5CYII=', 'base64');
  const upload = (cookie, name = 'portrait.png') => {
    const form = new FormData(); form.set('file', new File([bytes], name));
    return employeePhoto.POST(new Request(origin + '/api/admin/employee-photo', { method: 'POST', headers: { origin, ...(cookie ? { cookie } : {}) }, body: form }));
  };
  assert.equal((await upload()).status, 401);
  assert.equal((await upload(editorCookie)).status, 403);
  assert.equal((await upload(ownerCookie, 'portrait.pdf')).status, 400);
  const uploaded = await upload(ownerCookie);
  assert.equal(uploaded.status, 201);
  const { avatar } = await uploaded.json();
  const patch = cookie => employees.PATCH(request('PATCH', '/api/admin/employees', { id: account.id, avatar }, cookie));
  assert.equal((await patch(editorCookie)).status, 403);
  assert.equal((await employees.PATCH(request('PATCH', '/api/admin/employees', { id: account.id, avatar: 'https://example.test/photo.png' }, ownerCookie))).status, 400);
  assert.equal((await patch(ownerCookie)).status, 200);
  assert.equal((await db.getAuthorById(account.id)).avatar, avatar);
  const mediaContext = { params: Promise.resolve({ key: avatar.split('/').at(-1) }) };
  assert.equal((await media.GET(request('GET', avatar), mediaContext)).status, 404, 'Unused employee portraits remain private');
  const articleId = (await db.getAllData()).articles[0].id;
  await db.updateArticle(articleId, { authorId: account.id, status: 'published' }, { id: 'site-owner', name: 'Owner', role: 'super_admin' });
  const publicPhoto = await media.GET(request('GET', avatar), mediaContext);
  assert.equal(publicPhoto.status, 200);
  assert.deepEqual(Buffer.from(await publicPhoto.arrayBuffer()), bytes);
  await employees.DELETE(request('DELETE', '/api/admin/employees', { id: account.id }, ownerCookie));
  assert.equal((await db.getAuthorById(account.id)).avatar, avatar, 'Access removal preserves published bylines and portraits');
  assert.equal((await media.GET(request('GET', avatar), mediaContext)).status, 200);
});

test('owner enrolls employees, editor cannot manage accounts, and removal revokes sessions', async () => {
  const ownerCookie = await signedCookie();
  const input = { name: 'Test Editor', email: 'EDITOR@example.test', password: ' test-editor-password ' };
  assert.equal((await employees.GET(request('GET', '/api/admin/employees'))).status, 401);
  assert.equal((await employees.POST(request('POST', '/api/admin/employees', input, ownerCookie, 'https://attacker.example'))).status, 403);
  const created = await employees.POST(request('POST', '/api/admin/employees', input, ownerCookie));
  assert.equal(created.status, 201);
  const account = (await created.json()).employee;
  assert.equal(account.email, 'editor@example.test');
  assert.equal(account.role, 'editor');
  assert.ok(!('passwordHash' in account));
  assert.ok(!('salt' in account));
  assert.equal((await employees.POST(request('POST', '/api/admin/employees', input, ownerCookie))).status, 409);
  assert.equal((await employees.POST(request('POST', '/api/admin/employees', { ...input, email: 'owner@example.test' }, ownerCookie))).status, 409);
  assert.equal((await employees.POST(request('POST', '/api/admin/employees', { ...input, password: 'short' }, ownerCookie))).status, 400);
  assert.equal((await login.POST(request('POST', '/api/auth/login', { email: input.email, password: input.password.trim() }))).status, 401);
  const signed = await login.POST(request('POST', '/api/auth/login', { email: input.email, password: input.password }));
  assert.equal(signed.status, 200);
  const cookie = signed.headers.get('set-cookie').split(';')[0];
  assert.equal((await (await session.GET(request('GET', '/api/auth/session', undefined, cookie))).json()).user.id, account.id);
  assert.equal((await articles.GET(request('GET', '/api/articles?status=all', undefined, cookie))).status, 200);
  for (const [handler, method, body] of [[employees.GET, 'GET'], [employees.POST, 'POST', input], [employees.DELETE, 'DELETE', { id: account.id }]]) {
    assert.equal((await handler(request(method, '/api/admin/employees', body, cookie))).status, 403);
  }
  const stored = await storage.readJSON('sunrise-auth', 'employees-v1', () => ({}));
  assert.equal(stored.employees[0].passwordHash.length, 128);
  assert.ok(!JSON.stringify(stored).includes(input.password));
  assert.equal((await employees.DELETE(request('DELETE', '/api/admin/employees', { id: account.id }, ownerCookie))).status, 200);
  assert.equal((await session.GET(request('GET', '/api/auth/session', undefined, cookie))).status, 401);
  assert.equal((await login.POST(request('POST', '/api/auth/login', { email: input.email, password: input.password }))).status, 401);
  const enrolledAgain = await employees.POST(request('POST', '/api/admin/employees', input, ownerCookie));
  assert.equal(enrolledAgain.status, 201);
  assert.notEqual((await enrolledAgain.json()).employee.id, account.id);
  assert.equal((await session.GET(request('GET', '/api/auth/session', undefined, cookie))).status, 401);
  assert.equal((await session.GET(request('GET', '/api/auth/session', undefined, ownerCookie))).status, 200);
});

beforeEach(async () => {
  oldEnvironment = Object.fromEntries(environmentKeys.map(key => [key, process.env[key]]));
  await mkdir(path.join(process.cwd(), 'work'), { recursive: true });
  dataDirectory = await mkdtemp(path.join(process.cwd(), 'work', 'auth-test-'));
  process.env.SUNRISE_DATA_DIR = dataDirectory;
  process.env.SUNRISE_STORAGE = 'local';
  process.env.ADMIN_EMAIL = 'owner@example.test';
  process.env.ADMIN_PASSWORD = 'a-test-only-password-with-entropy';
  delete process.env.SESSION_SECRET;
  delete process.env.NETLIFY;
});
afterEach(async () => {
  for (const [key, value] of Object.entries(oldEnvironment)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
  assert.ok(path.resolve(dataDirectory).startsWith(path.resolve(process.cwd(), 'work') + path.sep));
  await rm(dataDirectory, { recursive: true, force: true });
});

test('first concurrent sign-ins share one persistent random signing key', async () => {
  const tokens = await Promise.all(Array.from({ length: 12 }, () => auth.createSession()));
  for (const token of tokens) assert.equal((await auth.verifySession(token)).role, 'super_admin');
  const stored = await storage.readJSON('sunrise-auth', 'signing-key-v1', () => ({}));
  assert.ok(stored.secret.length >= 32);
  delete require.cache[require.resolve('../src/lib/auth.ts')];
  const freshProcessModule = require('../src/lib/auth.ts');
  assert.equal((await freshProcessModule.verifySession(tokens[0])).id, 'site-owner');
});

test('sessions reject tampering, expiry, future issuance, and credential rotation', async () => {
  const now = Date.now();
  const token = await auth.createSession(now);
  assert.equal((await auth.verifySession(token, now)).id, 'site-owner');
  assert.equal(await auth.verifySession(token + 'x', now), null);
  assert.equal(await auth.verifySession(token, now + auth.SESSION_SECONDS * 1000), null);
  assert.equal(await auth.verifySession(token, now - 31_000), null);
  process.env.ADMIN_PASSWORD = 'another-test-only-password';
  assert.equal(await auth.verifySession(token, now), null);
  assert.equal(await auth.getSession(request('GET', '/api/auth/session', undefined, 'sr_user={"role":"super_admin"}')), null);
});

test('login validates credentials and emits a secure HttpOnly expiring cookie', async () => {
  const invalid = await login.POST(request('POST', '/api/auth/login', { email: 'owner@example.test', password: 'newsroom2026' }));
  assert.equal(invalid.status, 401);
  process.env.NODE_ENV = 'production';
  const response = await login.POST(request('POST', '/api/auth/login', { email: 'OWNER@example.test', password: process.env.ADMIN_PASSWORD }));
  assert.equal(response.status, 200);
  const cookie = response.headers.get('set-cookie');
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=strict', 'Max-Age=28800']) assert.ok(cookie.includes(flag), flag);
  assert.match(response.headers.get('cache-control'), /no-store/);
  const authenticated = await session.GET(request('GET', '/api/auth/session', undefined, cookie.split(';')[0]));
  assert.equal(authenticated.status, 200);
  const loggedOut = await logout.POST(request('POST', '/api/auth/logout', undefined, cookie.split(';')[0]));
  assert.equal(loggedOut.status, 200);
  assert.match(loggedOut.headers.get('set-cookie'), /Max-Age=0/);
});

test('login fails closed without configured password and blocks repeated guessing across module reloads', async () => {
  delete process.env.ADMIN_PASSWORD;
  assert.equal((await login.POST(request('POST', '/api/auth/login', { email: 'owner@example.test', password: 'anything' }))).status, 503);
  process.env.ADMIN_PASSWORD = 'a-test-only-password-with-entropy';
  for (let i = 0; i < 8; i++) assert.equal((await login.POST(request('POST', '/api/auth/login', { email: 'owner@example.test', password: 'incorrect' }))).status, 401);
  delete require.cache[require.resolve('../src/lib/auth.ts')];
  const anotherInstance = require('../src/lib/auth.ts');
  await assert.rejects(anotherInstance.authenticate(request('POST', '/api/auth/login'), 'owner@example.test', process.env.ADMIN_PASSWORD), error => error.status === 429);
});

test('private APIs and every write reject anonymous and cross-origin requests', async () => {
  const endpoints = [
    [articles.POST, '/api/articles'], [article.PUT, '/api/articles/missing', context('missing')],
    [article.DELETE, '/api/articles/missing', context('missing')], [restore.POST, '/api/articles/missing/restore', context('missing')],
    [settings.PUT, '/api/settings'], [categories.PUT, '/api/admin/categories'], [tags.PUT, '/api/admin/tags'], [ads.PUT, '/api/admin/ads'],
    [epapers.POST, '/api/admin/epapers'], [epapers.PUT, '/api/admin/epapers'],
  ];
  for (const [handler, url, ctx] of endpoints) {
    assert.equal((await handler(request('POST', url, {}), ctx)).status, 401, url);
    assert.equal((await handler(request('POST', url, {}, await signedCookie(), 'https://attacker.example'), ctx)).status, 403, url);
  }
  for (const [handler, url] of [[epapers.GET, '/api/admin/epapers'], [newsletter.GET, '/api/newsletter'], [categories.GET, '/api/admin/categories'], [tags.GET, '/api/admin/tags'], [ads.GET, '/api/admin/ads'], [audit.GET, '/api/admin/audit-logs']]) {
    assert.equal((await handler(request('GET', url))).status, 401, url);
  }
  assert.throws(() => auth.requireSameOrigin(new Request(origin + '/api/auth/login', { method: 'POST' })), error => error.status === 403);
  assert.equal((await login.POST(request('POST', '/api/auth/login', { email: 'owner@example.test', password: process.env.ADMIN_PASSWORD }, undefined, 'https://attacker.example'))).status, 403);
});

const editionUpload = (cookie, { name = 'daily.pdf', bytes = Buffer.from('%PDF-1.7\nTest edition\n%%EOF'), date = '2026-10-12', status = 'draft', extra } = {}) => {
  const form = new FormData();
  for (const [key, value] of Object.entries({ title: 'Daily test edition', date, edition: 'AP & Telangana', status })) form.set(key, value);
  form.set('file', new Blob([bytes]), name);
  if (extra) form.set(extra, 'untrusted value');
  return new Request(origin + '/api/admin/epapers', { method: 'POST', headers: { origin, cookie }, body: form });
};

test('daily editions persist with private drafts, public publishing, PDF viewing and reversible archiving', async () => {
  const cookie = await signedCookie();
  const created = await epapers.POST(editionUpload(cookie));
  assert.equal(created.status, 201);
  const item = (await created.json()).edition;
  const key = item.file.url.split('/').at(-1);
  const mediaContext = { params: Promise.resolve({ key }) };
  assert.equal(item.status, 'draft');
  assert.equal(item.file.contentType, 'application/pdf');
  assert.equal((await db.getEpaperEditions(true))[0].id, item.id);
  assert.deepEqual((await (await publicEpapers.GET()).json()).editions, []);
  assert.equal((await media.GET(request('GET', item.file.url), mediaContext)).status, 404);
  assert.equal((await media.GET(request('GET', item.file.url, undefined, cookie), mediaContext)).status, 200);
  assert.equal((await epapers.PUT(request('PUT', '/api/admin/epapers', { id: item.id, status: 'published' }, cookie))).status, 200);
  assert.equal((await (await publicEpapers.GET()).json()).editions[0].id, item.id);
  const opened = await media.GET(request('GET', item.file.url + '?view=1'), mediaContext);
  assert.equal(opened.status, 200);
  assert.match(opened.headers.get('content-disposition'), /^inline;/);
  assert.match(await opened.text(), /Test edition/);
  const download = await media.GET(request('GET', item.file.url), mediaContext);
  assert.match(download.headers.get('content-disposition'), /^attachment;/);
  assert.equal((await epapers.PUT(request('PUT', '/api/admin/epapers', { id: item.id, status: 'archived' }, cookie))).status, 200);
  assert.deepEqual((await (await publicEpapers.GET()).json()).editions, []);
  assert.equal((await media.GET(request('GET', item.file.url), mediaContext)).status, 404);
  assert.equal((await epapers.PUT(request('PUT', '/api/admin/epapers', { id: item.id, status: 'published' }, cookie))).status, 200);
  assert.equal((await media.GET(request('GET', item.file.url), mediaContext)).status, 200);
  assert.ok((await db.getAuditLogs()).some(log => log.targetType === 'epaper' && log.targetId === item.id && log.action === 'archive'));
});

test('JPG editions publish and unsafe or oversized edition uploads leave the archive unchanged', async () => {
  const cookie = await signedCookie();
  const jpeg = await require('node:fs/promises').readFile(path.join(process.cwd(), 'public/brand/news-clip-logo.jpg'));
  const response = await epapers.POST(editionUpload(cookie, { name: 'front-page.jpg', bytes: jpeg, status: 'published' }));
  assert.equal(response.status, 201);
  assert.equal((await response.json()).edition.file.contentType, 'image/jpeg');
  const failures = [
    [{ name: 'unsupported.png' }, 400], [{ bytes: Buffer.from('not a PDF') }, 400],
    [{ date: '2026-02-30' }, 400], [{ status: 'admin' }, 400], [{ extra: 'url' }, 400],
    [{ bytes: Buffer.alloc(4 * 1024 * 1024 + 1) }, 413],
  ];
  for (const [input, expected] of failures) assert.equal((await epapers.POST(editionUpload(cookie, input))).status, expected);
  assert.equal((await db.getEpaperEditions(true)).length, 1);
  assert.equal((await epapers.PUT(request('PUT', '/api/admin/epapers', { id: 'missing', status: 'published' }, cookie))).status, 404);
});

test('drafts, revisions and internal notes stay private; publishing and restore persist', async () => {
  const cookie = await signedCookie();
  const data = await (await catalog.GET()).json();
  const draft = { slug: 'private-test-story', headline: 'Private headline', summary: 'Summary', body: 'Original story', headlineTe: 'మొదటి శీర్షిక', bodyTe: 'మొదటి కథనం', categoryId: data.categories[0].id, authorId: data.authors[0].id, tags: [], status: 'draft', language: 'en', internalNotes: 'PRIVATE-SOURCE-NOTE' };
  const createdResponse = await articles.POST(request('POST', '/api/articles', draft, cookie));
  assert.equal(createdResponse.status, 201);
  const created = (await createdResponse.json()).article;
  assert.equal((await article.GET(request(), context(created.id))).status, 404);
  assert.equal((await articles.GET(request('GET', '/api/articles?status=all'))).status, 401);
  assert.equal((await articles.GET(request('GET', '/api/articles?status=draft'))).status, 401);
  const published = await article.PUT(request('PUT', '/api/articles/' + created.id, { status: 'published', headline: 'Updated headline', body: 'Updated story' }, cookie), context(created.id));
  assert.equal(published.status, 200);
  const publicResult = await (await article.GET(request(), context(created.id))).json();
  assert.equal(publicResult.article.status, 'published');
  assert.ok(!('internalNotes' in publicResult.article));
  assert.ok(!('revisions' in publicResult));
  assert.ok(!JSON.stringify(await (await search.GET(request('GET', '/api/search?q=Updated'))).json()).includes('PRIVATE-SOURCE-NOTE'));
  const privateResult = await (await article.GET(request('GET', '/api/articles/' + created.id, undefined, cookie), context(created.id))).json();
  assert.equal(privateResult.article.internalNotes, 'PRIVATE-SOURCE-NOTE');
  assert.equal(privateResult.revisions.length, 1);
  const restored = await restore.POST(request('POST', '/api/articles/' + created.id + '/restore', { revisionId: privateResult.revisions[0].id }, cookie), context(created.id));
  assert.equal(restored.status, 200);
  assert.equal((await db.getArticleById(created.id)).headline, draft.headline);
  assert.equal((await db.getArticleById(created.id)).bodyTe, draft.bodyTe);
  assert.equal((await db.getArticleRevisions(created.id)).length, 2);
});

test('metadata, advertising and settings save through authenticated APIs', async () => {
  const cookie = await signedCookie();
  const category = { id: 'cat-api-test', slug: 'api-test', nameEn: 'API test', nameTe: 'పరీక్ష', descriptionEn: '', descriptionTe: '', displayOrder: 50, featured: false };
  assert.equal((await categories.PUT(request('PUT', '/api/admin/categories', category, cookie))).status, 200);
  assert.equal((await db.getCategories()).find(c => c.id === category.id).nameEn, 'API test');
  const tag = { id: 'tag-api-test', slug: 'api-test', nameEn: 'Test', nameTe: 'పరీక్ష', aliases: ['test-alias'] };
  assert.equal((await tags.PUT(request('PUT', '/api/admin/tags', tag, cookie))).status, 200);
  assert.equal(await db.resolveCanonicalTag('test-alias'), 'api-test');
  const ad = { id: 'ad-api-test', slotKey: 'footer', title: 'Test campaign', imageUrl: 'https://example.com/image.png', targetUrl: 'https://example.com', advertiser: 'Test', startDate: '2026-01-01', endDate: '2030-01-01', isActive: true };
  assert.equal((await ads.PUT(request('PUT', '/api/admin/ads', ad, cookie))).status, 200);
  assert.equal((await db.getAdPlacements()).find(a => a.id === ad.id).title, ad.title);
  assert.equal((await settings.PUT(request('PUT', '/api/settings', { breakingNewsTextEn: 'Saved ticker' }, cookie))).status, 200);
  assert.equal((await db.getSettings()).breakingNewsTextEn, 'Saved ticker');
  assert.ok((await (await audit.GET(request('GET', '/api/admin/audit-logs', undefined, cookie))).json()).logs.some(log => log.targetId === ad.id));
});

test('automatic article URLs resolve concurrent collisions while custom URLs remain protected', async () => {
  const cookie = await signedCookie();
  const current = await db.getAllData();
  const { slugifyHeadline } = require('../src/lib/article-slug.ts');
  const headline = 'జాతీయస్థాయి సమావేశంలో ASR జిల్లా అధికారి';
  const input = {
    slug: slugifyHeadline(headline), autoSlug: true, headline, headlineTe: headline,
    body: 'తెలుగు వార్తా కథనం', bodyTe: 'తెలుగు వార్తా కథనం', language: 'te', status: 'draft',
    categoryId: current.categories[0].id, authorId: current.authors[0].id, tags: ['new delhi', 'New Delhi'],
  };
  const responses = await Promise.all(Array.from({ length: 4 }, () => articles.POST(request('POST', '/api/articles', input, cookie))));
  const saved = [];
  for (const response of responses) {
    assert.equal(response.status, 201);
    saved.push((await response.json()).article);
  }
  assert.equal(new Set(saved.map(story => story.slug)).size, 4);
  assert.ok(saved.some(story => story.slug === input.slug));
  for (const story of saved) {
    assert.ok(story.slug.length <= 80);
    assert.ok(!('autoSlug' in story));
    assert.deepEqual(story.tags, ['new-delhi']);
    assert.equal((await db.getArticleBySlug(story.slug)).id, story.id);
  }
  const original = saved[0];
  const updatedResponse = await article.PUT(request('PUT', '/api/articles/' + original.id,
    { slug: original.slug, headline: 'Updated Telugu story' }, cookie), context(original.id));
  assert.equal(updatedResponse.status, 200);
  assert.equal((await updatedResponse.json()).article.id, original.id);
  assert.equal((await db.getAllData()).articles.length, current.articles.length + 4);
  assert.equal((await articles.POST(request('POST', '/api/articles', { ...input, slug: original.slug, autoSlug: false }, cookie))).status, 409);
  assert.equal((await articles.POST(request('POST', '/api/articles', { ...input, autoSlug: 'true' }, cookie))).status, 400);
});

test('partial edits retain multimedia and explicit removals clear document and fact-check data', async () => {
  const cookie = await signedCookie();
  const current = await db.getAllData();
  const input = {
    slug: 'preserve-media', headline: 'Preserved media', body: 'Story text', categoryId: current.categories[0].id, authorId: current.authors[0].id,
    format: 'photo', galleryImages: [{ url: '/api/media/example-image.png', caption: 'Caption', credit: 'Photographer' }],
    mediaUrl: 'https://www.youtube.com/embed/example', attachedDocument: { name: 'release.pdf', url: '/api/media/example-document.pdf', size: '10 KB', type: 'pdf' },
    factCheck: { claim: 'Claim', claimTe: 'ప్రకటన', claimedBy: 'Source', verdict: 'Unproven', verdictTe: 'రుజువు కాలేదు', evidenceSummary: 'Evidence', evidenceSummaryTe: 'సాక్ష్యం', reviewDate: '2026-10-10' },
  };
  const result = await articles.POST(request('POST', '/api/articles', input, cookie));
  assert.equal(result.status, 201);
  const created = (await result.json()).article;
  assert.equal((await article.PUT(request('PUT', '/api/articles/' + created.id, { headline: 'Edited headline' }, cookie), context(created.id))).status, 200);
  const updated = await db.getArticleById(created.id);
  assert.deepEqual(updated.galleryImages, input.galleryImages);
  assert.equal(updated.format, 'photo');
  assert.equal(updated.mediaUrl, input.mediaUrl);
  assert.deepEqual(updated.attachedDocument, input.attachedDocument);
  assert.equal((await article.PUT(request('PUT', '/api/articles/' + created.id, { attachedDocument: null, factCheck: null }, cookie), context(created.id))).status, 200);
  const removed = await db.getArticleById(created.id);
  assert.equal(removed.attachedDocument, undefined);
  assert.equal(removed.factCheck, undefined);
  assert.deepEqual(removed.galleryImages, input.galleryImages);
});

test('input validation rejects executable URLs, unexpected identity fields, invalid types and oversized bodies', async () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '//attacker.example', '/\\attacker.example', 'https://user:pass@example.com']) {
    assert.throws(() => validation.safeUrl(url, 'test'), error => error.status === 400);
  }
  assert.throws(() => validation.articleInput({ id: 'override' }, true), error => error.status === 400);
  assert.throws(() => validation.articleInput({ status: 'admin' }, true), error => error.status === 400);
  assert.throws(() => validation.articleInput({ isBreaking: 'true' }, true), error => error.status === 400);
  const huge = request('POST', '/api/settings', { text: 'x'.repeat(100) });
  await assert.rejects(validation.readJson(huge, 50), error => error.status === 413);
  assert.equal((await newsletter.POST(request('POST', '/api/newsletter', { email: 'bad-email' }))).status, 400);
  assert.equal((await newsletter.POST(request('POST', '/api/newsletter', { email: 'reader@example.test', editions: ['invalid'] }))).status, 400);
  assert.equal((await newsletter.POST(request('POST', '/api/newsletter', { email: 'reader@example.test', language: 'en', editions: ['morning_briefing'] }))).status, 200);
  assert.ok((await db.getSubscribers()).some(s => s.email === 'reader@example.test'));
});

test('employee designations update public bylines without changing CMS permissions', async () => {
  const owner = await signedCookie();
  const enrolled = await employees.POST(request('POST', '/api/admin/employees', {name:'Designation Test',email:'designation@example.test',password:'designation-test-password',designation:'Reporter'}, owner));
  assert.equal(enrolled.status,201);
  const employee = (await enrolled.json()).employee;
  assert.equal(employee.designation,'Reporter');
  assert.equal(employee.role,'editor');
  assert.equal((await db.getAuthorById(employee.id)).role,'Reporter');
  const updated = await employees.PATCH(request('PATCH','/api/admin/employees',{id:employee.id,designation:'Sub Editor'},owner));
  assert.equal(updated.status,200);
  assert.equal((await db.getAuthorById(employee.id)).role,'Sub Editor');
  assert.equal((await employees.PATCH(request('PATCH','/api/admin/employees',{id:employee.id,designation:'Owner'},owner))).status,400);
  assert.equal((await employees.PATCH(request('PATCH','/api/admin/employees',{id:employee.id,designation:'Editor'}))).status,401);
});
