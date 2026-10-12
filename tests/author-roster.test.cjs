require('./helpers/register-server-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs/promises');
const path = require('node:path');
const { installNewsroomAuthors, newsroomAuthors, AUTHOR_ROSTER_VERSION } = require('../src/lib/author-profiles.ts');
const db = require('../src/lib/db.ts');
const seed = require('../data/sunrise_news.json');

const names = ['Ramesh Varma', 'Kavitha Rao', 'S. Krishna Murthy', 'Dr. B. Venkat Reddy', 'Ananya Sharma'];
const oldAuthors = names.map((name, index) => ({ ...newsroomAuthors[0], id: `auth-${index + 1}`, name }));

test('roster contains the three supplied profiles and keeps customized profiles', () => {
  assert.deepEqual(installNewsroomAuthors(oldAuthors).map(author => author.name), ['OG Prakash', 'D Ravi Kumar', 'Nag News']);
  const customized = { ...oldAuthors[0], name: 'A separately edited author' };
  const migrated = installNewsroomAuthors([customized, ...oldAuthors.slice(1)]);
  assert.deepEqual(migrated.at(-1), customized);
  assert.deepEqual(installNewsroomAuthors(migrated), migrated);
  for (const author of newsroomAuthors) {
    assert.equal(author.bioEn, '');
    assert.equal(author.email, '');
    assert.equal(author.verified, false);
  }
});

test('stored roster migration preserves live content and persists once', async () => {
  const work = path.resolve(process.cwd(), 'work');
  await fs.mkdir(work, { recursive: true });
  const directory = await fs.mkdtemp(path.join(work, 'author-roster-'));
  const originalDirectory = process.env.SUNRISE_DATA_DIR;
  const originalBackend = process.env.SUNRISE_STORAGE;
  try {
    process.env.SUNRISE_DATA_DIR = directory;
    process.env.SUNRISE_STORAGE = 'local';
    const current = structuredClone(seed);
    current.authors = oldAuthors;
    delete current.authorRosterVersion;
    current.articles[0].headline = 'A newer story saved after deployment';
    current.settings.siteNameEn = 'Live newsroom setting';
    const file = path.join(directory, 'sunrise_news.json');
    await fs.writeFile(file, JSON.stringify(current));
    const migrated = await db.getAllData();
    assert.equal(migrated.authorRosterVersion, AUTHOR_ROSTER_VERSION);
    assert.deepEqual(migrated.authors, newsroomAuthors);
    for (const collection of ['articles', 'settings', 'subscribers', 'revisions', 'auditLogs']) {
      assert.deepEqual(migrated[collection], current[collection] || []);
    }
    const saved = await fs.readFile(file, 'utf8');
    assert.deepEqual(JSON.parse(saved).authors, newsroomAuthors);
    await db.getAllData();
    assert.equal(await fs.readFile(file, 'utf8'), saved);
    assert.ok(migrated.articles.some(article => article.authorId.startsWith('auth-')),
      'Legacy article attribution must not be silently assigned to a new author');
  } finally {
    if (originalDirectory === undefined) delete process.env.SUNRISE_DATA_DIR;
    else process.env.SUNRISE_DATA_DIR = originalDirectory;
    if (originalBackend === undefined) delete process.env.SUNRISE_STORAGE;
    else process.env.SUNRISE_STORAGE = originalBackend;
    assert.ok(path.resolve(directory).startsWith(work + path.sep));
    await fs.rm(directory, { recursive: true, force: true });
  }
});
