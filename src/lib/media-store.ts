import 'server-only';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { getCMSStore } from './storage';

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = {
  '.pdf': 'application/pdf', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
};
export interface MediaMetadata { name: string; contentType: string; size: number }

export function validateUpload(name: string, data: Buffer): { extension: string; contentType: string } {
  const extension = path.extname(name).toLowerCase();
  const contentType = TYPES[extension];
  if (!contentType) throw new Error('Supported files: PDF, DOCX, TXT, MD, JPG, PNG and WebP.');
  if (!data.length || data.length > MAX_UPLOAD_BYTES) throw new Error('Upload a non-empty file up to 4 MB.');
  const starts = (bytes: number[]) => bytes.every((b, i) => data[i] === b);
  const valid = extension === '.pdf' ? data.subarray(0, 5).toString() === '%PDF-'
    : extension === '.docx' ? starts([0x50,0x4b,0x03,0x04])
    : ['.jpg','.jpeg'].includes(extension) ? starts([0xff,0xd8,0xff])
    : extension === '.png' ? starts([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])
    : extension === '.webp' ? data.subarray(0,4).toString() === 'RIFF' && data.subarray(8,12).toString() === 'WEBP'
    : !data.includes(0);
  if (!valid) throw new Error('The file contents do not match the selected file type.');
  return { extension, contentType };
}

function localDirectory() { return path.join(process.env.SUNRISE_DATA_DIR || path.join(process.cwd(), 'data'), 'media'); }

export async function saveMedia(name: string, data: Buffer) {
  const { extension, contentType } = validateUpload(name, data);
  const key = `${randomUUID()}${extension}`;
  const metadata: MediaMetadata = { name: path.basename(name).slice(0,180), contentType, size: data.length };
  if (process.env.SUNRISE_STORAGE === 'netlify') {
    const result = await (await getCMSStore('sunrise-media')).set(key, new Uint8Array(data).buffer, { metadata: { ...metadata }, onlyIfNew: true });
    if (!result.modified || !result.etag?.trim()) throw new Error('Upload could not be saved. Please retry.');
  } else {
    await fs.mkdir(localDirectory(), { recursive: true });
    await fs.writeFile(path.join(localDirectory(), key), data, { flag: 'wx' });
    await fs.writeFile(path.join(localDirectory(), `${key}.json`), JSON.stringify(metadata), { flag: 'wx' });
  }
  return { key, url: `/api/media/${key}`, metadata };
}

export async function readMedia(key: string): Promise<{ data: ArrayBuffer; metadata: MediaMetadata } | null> {
  if (!/^[0-9a-f-]{36}\.(pdf|docx|txt|md|jpe?g|png|webp)$/.test(key)) return null;
  if (process.env.SUNRISE_STORAGE === 'netlify') {
    const result = await (await getCMSStore('sunrise-media')).getWithMetadata(key, { type: 'arrayBuffer' });
    return result ? { data: result.data, metadata: result.metadata as unknown as MediaMetadata } : null;
  }
  try {
    const [data, metadata] = await Promise.all([
      fs.readFile(path.join(localDirectory(), key)), fs.readFile(path.join(localDirectory(), `${key}.json`), 'utf8'),
    ]);
    return { data: new Uint8Array(data).buffer, metadata: JSON.parse(metadata) };
  } catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
}
