require('./helpers/register-server-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { adjustCrop, drawCrop, cropPixels, FULL_CROP } = require('../src/lib/clip-crop.ts');

test('crop moves and resizes within the newspaper without flipping or collapsing', () => {
  const crop = { x: 20, y: 10, width: 50, height: 60 };
  assert.deepEqual(adjustCrop(crop, 'move', 80, -80), { x: 50, y: 0, width: 50, height: 60 });
  assert.deepEqual(adjustCrop(crop, 'nw', -80, -80), { x: 0, y: 0, width: 70, height: 70 });
  assert.deepEqual(adjustCrop(crop, 'se', 80, 80), { x: 20, y: 10, width: 80, height: 90 });
  assert.equal(adjustCrop(crop, 'w', 80, 0).width, 2);
  assert.equal(adjustCrop(crop, 'n', 0, 80).height, 2);
});
test('new crops support dragging in either direction and stay inside the page', () => {
  assert.deepEqual(drawCrop(80, 90, 10, 20), { x: 10, y: 20, width: 70, height: 70 });
  assert.deepEqual(drawCrop(99, 99, 110, 110), { x: 98, y: 98, width: 2, height: 2 });
});
test('export crops the exact selected pixels at any rendered resolution', () => {
  assert.deepEqual(cropPixels({ x: 25, y: 10, width: 50, height: 40 }, 1600, 2400), { x: 400, y: 240, width: 800, height: 960 });
  assert.deepEqual(cropPixels(FULL_CROP, 768, 1301), { x: 0, y: 0, width: 768, height: 1301 });
  const tiny = cropPixels({ x: 99.9, y: 99.9, width: 0.1, height: 0.1 }, 31, 41);
  assert.deepEqual(tiny, { x: 30, y: 40, width: 1, height: 1 });
});
