require('./helpers/register-server-ts.cjs');
const Module = require('node:module');
const path = require('node:path');
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) { return originalLoad.call(this, request.startsWith('@/') ? path.join(process.cwd(), 'src', request.slice(2)) : request, parent, isMain); };
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateBackup, fileHash } = require('../src/lib/migration.ts');
const blank = () => ({ format: 'sunrise-netlify-backup-v1', database: { articles: [], categories: [], tags: [], authors: [], adPlacements: [], auditLogs: [], revisions: [], subscribers: [], epapers: [], settings: {} }, employees: [], media: [] });

test('migration manifest requires a complete database and every referenced upload', () => {
  const snapshot = blank();
  assert.equal(validateBackup(snapshot), snapshot);
  delete snapshot.database.subscribers;
  assert.throws(() => validateBackup(snapshot), error => error.status === 400);
  const incomplete = blank();
  incomplete.database.articles.push({ featuredImage: '/api/media/00000000-0000-0000-0000-000000000000.jpg' });
  assert.throws(() => validateBackup(incomplete), error => error.status === 400);
});
test('migration rejects privilege escalation, malformed password hashes and duplicate media keys', () => {
  const snapshot = blank();
  snapshot.employees.push({ id: 'employee-test', name: 'Reporter', email: 'reporter@example.test', role: 'super_admin', salt: '0'.repeat(64), passwordHash: '0'.repeat(128), createdAt: '2026-10-14T00:00:00.000Z' });
  assert.throws(() => validateBackup(snapshot), error => error.status === 400);
  snapshot.employees[0].role = 'editor';
  snapshot.employees[0].passwordHash = 'plain-password';
  assert.throws(() => validateBackup(snapshot), error => error.status === 400);
  const duplicate = blank();
  const item = { key: '00000000-0000-0000-0000-000000000000.jpg', sha256: fileHash(Buffer.from('image')), metadata: { name: 'image.jpg', size: 5, contentType: 'image/jpeg' } };
  duplicate.media.push(item, item);
  assert.throws(() => validateBackup(duplicate), error => error.status === 400);
});
