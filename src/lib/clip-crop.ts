export interface CropRect { x: number; y: number; width: number; height: number }
export type CropHandle = 'move' | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
export const FULL_CROP: CropRect = { x: 0, y: 0, width: 100, height: 100 };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Percentage coordinates stay aligned when the reader changes screen size. */
export function adjustCrop(start: CropRect, handle: CropHandle, dx: number, dy: number): CropRect {
  if (handle === 'move') return { ...start, x: clamp(start.x + dx, 0, 100 - start.width), y: clamp(start.y + dy, 0, 100 - start.height) };
  let left = start.x, top = start.y, right = left + start.width, bottom = top + start.height;
  if (handle.includes('w')) left = clamp(left + dx, 0, right - 2);
  if (handle.includes('e')) right = clamp(right + dx, left + 2, 100);
  if (handle.includes('n')) top = clamp(top + dy, 0, bottom - 2);
  if (handle.includes('s')) bottom = clamp(bottom + dy, top + 2, 100);
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function drawCrop(x1: number, y1: number, x2: number, y2: number): CropRect {
  const x = clamp(Math.min(x1, x2), 0, 98), y = clamp(Math.min(y1, y2), 0, 98);
  return { x, y, width: clamp(Math.abs(x2 - x1), 2, 100 - x), height: clamp(Math.abs(y2 - y1), 2, 100 - y) };
}

export function cropPixels(crop: CropRect, width: number, height: number): CropRect {
  const x = clamp(Math.floor(crop.x * width / 100), 0, width - 1);
  const y = clamp(Math.floor(crop.y * height / 100), 0, height - 1);
  return { x, y, width: clamp(Math.ceil((crop.x + crop.width) * width / 100) - x, 1, width - x), height: clamp(Math.ceil((crop.y + crop.height) * height / 100) - y, 1, height - y) };
}
