const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function loadSource(relativePath, dependencies = {}) {
  const filename = path.join(__dirname, '..', relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    URL,
    require(name) {
      if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  }, { filename });
  return module.exports;
}

const safety = loadSource('src/lib/content-safety.ts');

test('article formatting escapes raw markup while retaining supported inline formatting', () => {
  const html = safety.formatInline('**News** <img src=x onerror="alert(1)"> *details* `<script>bad()</script>`');
  assert.ok(html.includes('<strong class="font-bold text-slate-900">News</strong>'));
  assert.ok(html.includes('<em class="italic">details</em>'));
  assert.ok(html.includes('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('<script'));
  assert.ok(safety.formatInline('&lt;script&gt;').includes('&amp;lt;script&amp;gt;'));
});

test('navigation blocks executable, protocol-relative, obfuscated and credential URLs', () => {
  for (const unsafe of ['javascript:alert(1)', 'data:text/html,<script>x</script>', '//evil.example/path', '/\\evil.example', 'java\nscript:alert(1)', 'https://user:pass@example.com', 'file:///tmp/file']) {
    assert.equal(safety.safeUrl(unsafe, '/safe'), '/safe', unsafe);
  }
  assert.equal(safety.safeUrl('/api/media/example.pdf'), '/api/media/example.pdf');
  assert.equal(safety.safeUrl('https://example.com/report?q=1'), 'https://example.com/report?q=1');
});

test('embeds allow trusted video players and reject arbitrary documents', () => {
  assert.equal(safety.safeEmbedUrl('https://www.youtube.com/embed/abc'), 'https://www.youtube.com/embed/abc');
  assert.equal(safety.safeEmbedUrl('https://player.vimeo.com/video/123'), 'https://player.vimeo.com/video/123');
  for (const unsafe of ['javascript:alert(1)', '/uploads/document.html', 'https://evil.example/embed/abc', 'https://www.youtube.com.evil.example/embed/abc', 'http://www.youtube.com/embed/abc', 'https://www.youtube.com/watch?v=abc']) {
    assert.equal(safety.safeEmbedUrl(unsafe), undefined, unsafe);
  }
});

test('JSON-LD cannot terminate its script element', () => {
  const value = { headline: '</script><script>alert(1)</script>' };
  const serialized = safety.serializeJsonLd(value);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), value);
});

test('public article queries enforce published-only and remove private fields', async () => {
  let requestedOptions;
  const published = { id: 'published', status: 'published', headline: 'Public', internalNotes: 'SECRET', reviewerId: 'private-user' };
  const draft = { id: 'draft', status: 'draft', headline: 'Unreleased', internalNotes: 'SECRET' };
  const readers = loadSource('src/lib/public-articles.ts', {
    'server-only': {},
    './db': {
      getArticles: async options => { requestedOptions = options; return { articles: [published, draft], total: 1 }; },
      getArticleBySlug: async slug => slug === 'published' ? published : draft,
    },
  });
  const results = await readers.getArticles({ status: 'all', limit: 5 });
  assert.equal(requestedOptions.status, 'published');
  assert.equal(requestedOptions.limit, 5);
  assert.equal(results.articles.length, 1);
  assert.equal(results.articles[0].id, 'published');
  assert.ok(!JSON.stringify(results).includes('SECRET'));
  assert.ok(!Object.hasOwn(results.articles[0], 'internalNotes'));
  assert.ok(!Object.hasOwn(results.articles[0], 'reviewerId'));
  assert.equal(await readers.getArticleBySlug('draft'), undefined);
  assert.equal((await readers.getArticleBySlug('published')).headline, 'Public');
  assert.equal(published.internalNotes, 'SECRET', 'scrubbing must not mutate stored article');
});
