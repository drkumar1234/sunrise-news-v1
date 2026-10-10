import { getSiteUrl } from '@/lib/site-url';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const robots = `# Sunrise News Robots Configuration
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${getSiteUrl()}/sitemap.xml
Sitemap: ${getSiteUrl()}/news-sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
