require('./helpers/register-server-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { slugifyHeadline } = require('../src/lib/article-slug.ts');

test('Telugu headlines sharing an English acronym retain their different Telugu words', () => {
  const first = slugifyHeadline('జాతీయస్థాయి సమావేశంలో ASR జిల్లా అధికారి');
  const second = slugifyHeadline('ASR జిల్లాలో కొత్త కార్యక్రమం ప్రారంభం');
  assert.notEqual(first, 'asr');
  assert.notEqual(second, 'asr');
  assert.notEqual(first, second);
  assert.match(first, /జాతీయస్థాయి-సమావేశంలో-asr-జిల్లా-అధికారి/);
  assert.match(second, /asr-జిల్లాలో-కొత్త-కార్యక్రమం-ప్రారంభం/);
});
