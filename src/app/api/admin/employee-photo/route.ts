import { requireOwner, json, apiError, ApiError } from '@/lib/auth';
import { MAX_UPLOAD_BYTES, saveMedia, validateUpload } from '@/lib/media-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    await requireOwner(request);
    if (Number(request.headers.get('content-length') || 0) > MAX_UPLOAD_BYTES + 65536) throw new ApiError(413, 'Maximum photo size is 4 MB.');
    const file = (await request.formData()).get('file');
    if (!(file instanceof File) || !file.size || file.size > MAX_UPLOAD_BYTES) throw new ApiError(400, 'Choose a photo up to 4 MB.');
    const bytes = Buffer.from(await file.arrayBuffer());
    let type;
    try { type = validateUpload(file.name, bytes); } catch { throw new ApiError(400, 'Choose a valid JPG, PNG or WebP photo up to 4 MB.'); }
    if (!type.contentType.startsWith('image/')) throw new ApiError(400, 'Choose a JPG, PNG or WebP photo.');
    return json({ avatar: (await saveMedia(file.name, bytes)).url }, 201);
  } catch (error) { return apiError(error); }
}
