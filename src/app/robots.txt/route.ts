import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `# Sunrise News Robots Configuration
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://sunrisenews.in/sitemap.xml
Sitemap: https://sunrisenews.in/news-sitemap.xml
`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
