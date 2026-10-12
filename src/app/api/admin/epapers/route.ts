import { requireAdmin, apiError, ApiError, json } from '@/lib/auth';
import { createEpaperEdition, getEpaperEditions, setEpaperStatus } from '@/lib/db';
import { MAX_UPLOAD_BYTES, saveMedia, validateUpload } from '@/lib/media-store';
import { onlyKeys, readJson, string } from '@/lib/validation';
import { validEditionDate } from '@/lib/epaper';
import type { EpaperEdition } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try { await requireAdmin(request); return json({ editions: await getEpaperEditions(true) }); }
  catch (error) { return apiError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin(request);
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('multipart/form-data;')) throw new ApiError(415, 'Choose a JPG or PDF file.');
    const maximum = MAX_UPLOAD_BYTES + 65536;
    if (Number(request.headers.get('content-length') || 0) > maximum) throw new ApiError(413, 'Maximum file size is 4 MB.');
    const reader = request.body?.getReader();
    if (!reader) throw new ApiError(400, 'Choose a JPG or PDF file.');
    const chunks: Uint8Array[] = []; let total = 0;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximum) { await reader.cancel(); throw new ApiError(413, 'Maximum file size is 4 MB.'); }
      chunks.push(value);
    }
    let form: FormData;
    try { form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': contentType } }).formData(); }
    catch { throw new ApiError(400, 'The upload could not be read. Choose the file again.'); }
    if (Array.from(form.keys()).some(key => !['file', 'title', 'date', 'edition', 'status'].includes(key))) throw new ApiError(400, 'Unrecognized upload field.');
    const title = string(form.get('title'), 'title', 160, true);
    const date = string(form.get('date'), 'edition date', 10, true);
    if (!validEditionDate(date)) throw new ApiError(400, 'Choose a valid edition date.');
    const edition = string(form.get('edition'), 'edition / region', 100, true);
    const status = form.get('status');
    if (status !== 'draft' && status !== 'published') throw new ApiError(400, 'Choose Draft or Published.');
    const file = form.get('file');
    if (!file || typeof file === 'string') throw new ApiError(400, 'Choose a JPG or PDF file.');
    if (!/\.(pdf|jpe?g)$/i.test(file.name)) throw new ApiError(400, 'Only JPG, JPEG or PDF files are supported.');
    if (file.size > MAX_UPLOAD_BYTES) throw new ApiError(413, 'Maximum file size is 4 MB.');
    const bytes = Buffer.from(await file.arrayBuffer());
    try { validateUpload(file.name, bytes); } catch (error) { throw new ApiError(400, (error as Error).message); }
    const saved = await saveMedia(file.name, bytes);
    const result = await createEpaperEdition({ title, date, edition, status,
      file: { name: saved.metadata.name, url: saved.url, size: saved.metadata.size, contentType: saved.metadata.contentType as EpaperEdition['file']['contentType'] },
    }, user);
    return json({ edition: result }, 201);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAdmin(request);
    const input = await readJson(request, 10000);
    onlyKeys(input, ['id', 'status']);
    const id = string(input.id, 'edition ID', 100, true);
    if (!['draft', 'published', 'archived'].includes(input.status as string)) throw new ApiError(400, 'Invalid edition status.');
    const exists = (await getEpaperEditions(true)).some(edition => edition.id === id);
    if (!exists) throw new ApiError(404, 'E-paper edition not found.');
    return json({ edition: await setEpaperStatus(id, input.status as EpaperEdition['status'], user) });
  } catch (error) { return apiError(error); }
}
