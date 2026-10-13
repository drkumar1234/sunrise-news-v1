import { requireAdmin, json, apiError, ApiError } from '@/lib/auth';
import { MAX_UPLOAD_BYTES, validateUpload, saveMedia } from '@/lib/media-store';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    if (Number(request.headers.get('content-length')) > MAX_UPLOAD_BYTES + 65536) throw new ApiError(413, 'Upload a file up to 4 MB.');
    const form = await request.formData();
    const file = form.get('file');
    const kind = form.get('kind');
    if (!(file instanceof File) || !['photo', 'letter'].includes(String(kind))) throw new ApiError(400, 'Select a staff photo or joining letter.');
    if (file.size > MAX_UPLOAD_BYTES) throw new ApiError(413, 'Upload a file up to 4 MB.');
    const data = Buffer.from(await file.arrayBuffer());
    let contentType: string;
    try { contentType = validateUpload(file.name, data).contentType; }
    catch (error) { throw new ApiError(400, (error as Error).message); }
    const allowed = kind === 'photo' ? ['image/jpeg', 'image/png', 'image/webp'] : ['application/pdf', 'image/jpeg'];
    if (!allowed.includes(contentType)) throw new ApiError(400, kind === 'photo' ? 'Upload a JPG, PNG or WebP photo.' : 'Upload a PDF or JPG joining letter.');
    return json(await saveMedia(file.name, data, true), 201);
  } catch (error) { return apiError(error); }
}
