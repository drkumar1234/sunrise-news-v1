import { NextRequest, NextResponse } from 'next/server';
import { getSession, apiError } from '@/lib/auth';
import { getArticles, getAdPlacements, getEpaperEditions } from '@/lib/db';
import { readMedia } from '@/lib/media-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    const admin = await getSession(request);
    const url = `/api/media/${key}`;
    if (!admin) {
      const [{ articles }, ads, epapers] = await Promise.all([getArticles({ status: 'published' }), getAdPlacements(), getEpaperEditions()]);
      const referenced = articles.some(a => a.featuredImage === url || a.mediaUrl === url || a.attachedDocument?.url === url || a.galleryImages?.some(i => i.url === url))
        || ads.some(a => a.isActive && a.imageUrl === url && a.startDate <= new Date().toISOString().slice(0,10) && a.endDate >= new Date().toISOString().slice(0,10))
        || epapers.some(edition => edition.file.url === url);
      if (!referenced) return new NextResponse(null, { status: 404 });
    }
    const media = await readMedia(key);
    if (!media || (media.metadata.private && !admin)) return new NextResponse(null, { status: 404 });
    const isImage = media.metadata.contentType.startsWith('image/');
    const inline = isImage || (media.metadata.contentType === 'application/pdf' && new URL(request.url).searchParams.get('view') === '1');
    return new NextResponse(media.data, { headers: {
      'Content-Type': media.metadata.contentType,
      'Content-Length': String(media.data.byteLength),
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(media.metadata.name)}`,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Cache-Control': 'private, no-store',
    } });
  } catch (error) { return apiError(error); }
}
