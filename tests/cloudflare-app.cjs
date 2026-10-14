// Exercise the built Next.js application in workerd with isolated local storage.
const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const { test } = require('node:test');

test('built Cloudflare CMS supports owner navigation, employee revocation and persistent uploads', { timeout: 120000 }, async () => {
  await fs.mkdir('work', { recursive: true });
  const directory = await fs.mkdtemp(path.resolve('work/worker-test-'));
  const config = JSON.parse(await fs.readFile('wrangler.jsonc', 'utf8'));
  delete config.build;
  delete config.previews;
  delete config.services;
  config.main = path.resolve(config.main);
  config.assets.directory = path.resolve(config.assets.directory);
  config.vars = { SUNRISE_STORAGE: 'cloudflare', ADMIN_EMAIL: 'owner@example.test', ADMIN_PASSWORD: 'RuntimeTestOnly-2026!' };
  const configPath = path.join(directory, 'wrangler.json');
  await fs.writeFile(configPath, JSON.stringify(config));
  const server = spawn(process.execPath, ['node_modules/wrangler/bin/wrangler.js', 'dev', '--local', '--config', configPath, '--port', '8790', '--persist-to', path.join(directory, 'storage')], { stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  server.stdout.on('data', data => { output += data.toString(); });
  server.stderr.on('data', data => { output += data.toString(); });
  const origin = 'http://localhost:8790';
  async function request(route, method = 'GET', body, cookie) {
    return fetch(origin + route, { method, headers: { origin, ...(cookie ? { cookie } : {}), ...(body ? { 'content-type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  }
  try {
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (server.exitCode !== null) throw new Error(output);
      try { ready = (await request('/api/catalog')).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    assert.ok(ready, output);
    const login = await request('/api/auth/login', 'POST', { email: config.vars.ADMIN_EMAIL, password: config.vars.ADMIN_PASSWORD });
    assert.equal(login.status, 200, await login.clone().text());
    const cookie = login.headers.get('set-cookie').split(';')[0];
    const dashboard = await request('/admin', 'GET', undefined, cookie);
    const html = await dashboard.text();
    assert.equal(dashboard.status, 200);
    assert.match(html, /Manage Employees/);
    const enrolled = await request('/api/admin/employees', 'POST', { name: 'Runtime Reporter', email: 'reporter@example.test', password: 'ReporterTestOnly-2026!' }, cookie);
    assert.equal(enrolled.status, 201, await enrolled.clone().text());
    const { employee } = await enrolled.json();
    const employeeLogin = await request('/api/auth/login', 'POST', { email: employee.email, password: 'ReporterTestOnly-2026!' });
    assert.equal(employeeLogin.status, 200, await employeeLogin.clone().text());
    const employeeCookie = employeeLogin.headers.get('set-cookie').split(';')[0];
    assert.equal((await request('/api/admin/employees', 'GET', undefined, employeeCookie)).status, 403);
    const form = new FormData();
    form.append('file', new File(['Sunrise runtime story\nCloudflare upload persistence'], 'story.txt', { type: 'text/plain' }));
    const upload = await fetch(origin + '/api/admin/upload-doc', { method: 'POST', body: form, headers: { origin, cookie } });
    assert.equal(upload.status, 200, await upload.clone().text());
    const uploaded = await upload.json();
    assert.match(uploaded.rawText, /Cloudflare upload persistence/);
    assert.equal(await (await request(uploaded.file.url, 'GET', undefined, cookie)).text(), 'Sunrise runtime story\nCloudflare upload persistence');
    assert.equal((await request('/api/admin/employees', 'DELETE', { id: employee.id }, cookie)).status, 200);
    assert.equal((await request('/api/auth/session', 'GET', undefined, employeeCookie)).status, 401);
    const migrationStatus = await (await request('/api/admin/migration', 'GET', undefined, cookie)).json();
    assert.equal((await request('/api/admin/migration')).status, 401);
    const exported = await (await request('/api/admin/migration?export=1', 'GET', undefined, cookie)).json();
    const { createHash } = require('node:crypto');
    const originalBytes = Buffer.from('Sunrise runtime story\nCloudflare upload persistence');
    const originalKey = uploaded.file.url.split('/').pop();
    const sourceHash = createHash('sha256').update(originalBytes).digest('hex');
    const metadata = { name: 'story.txt', contentType: 'text/plain; charset=utf-8', size: originalBytes.length };
    const migrationUpload = new FormData();
    migrationUpload.set('kind', 'media'); migrationUpload.set('file', new File([originalBytes], originalKey)); migrationUpload.set('key', originalKey); migrationUpload.set('metadata', JSON.stringify(metadata)); migrationUpload.set('sha256', sourceHash);
    const verified = await fetch(origin + '/api/admin/migration', { method: 'POST', body: migrationUpload, headers: { origin, cookie } });
    assert.equal(verified.status, 200, await verified.clone().text());
    exported.database.articles[0].headline = 'Imported newsroom headline';
    const migrationBackup = { format: 'sunrise-netlify-backup-v1', database: exported.database, employees: exported.registry.employees, media: [{ key: originalKey, metadata, sha256: sourceHash }] };
    async function importSnapshot(expectedHash) {
      const payload = new FormData(); payload.set('kind', 'database'); payload.set('file', new File([JSON.stringify(migrationBackup)], 'backup.json')); payload.set('expectedHash', expectedHash); payload.set('expectedEmployeesHash', migrationStatus.employeesHash);
      return fetch(origin + '/api/admin/migration', { method: 'POST', body: payload, headers: { origin, cookie } });
    }
    assert.equal((await importSnapshot('changed-destination')).status, 409);
    const imported = await importSnapshot(migrationStatus.databaseHash);
    assert.equal(imported.status, 200, await imported.clone().text());
    const result = await imported.json();
    assert.equal(result.databaseHash, result.sourceDatabaseHash);
    assert.equal(result.verifiedMedia, 1);
    const destinationBackup = await (await request('/api/admin/migration?backup=' + result.backupId, 'GET', undefined, cookie)).json();
    assert.notEqual(destinationBackup.backup.database.articles[0].headline, 'Imported newsroom headline');
    assert.equal((await (await request('/api/admin/migration?export=1', 'GET', undefined, cookie)).json()).database.articles[0].headline, 'Imported newsroom headline');
  } catch (error) {
    process.stderr.write(output);
    throw error;
  } finally {
    server.kill('SIGTERM');
    await new Promise(resolve => server.exitCode !== null ? resolve() : server.once('exit', resolve));
    await fs.rm(directory, { recursive: true, force: true });
  }
});
