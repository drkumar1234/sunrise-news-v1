import { NextResponse } from 'next/server';
import { getArticles } from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://sunrisenews.in';
  // Google News requires published articles within the last 48 hours
  const { articles } = getArticles({ status: 'published', limit: 50 });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

  articles.forEach((art) => {
    const isTe = art.language === 'te';
    const title = (isTe && art.headlineTe ? art.headlineTe : art.headline).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const langCode = art.language;

    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${art.language}/article/${art.slug}</loc>\n`;
    xml += `    <news:news>\n`;
    xml += `      <news:publication>\n`;
    xml += `        <news:name>Sunrise News</news:name>\n`;
    xml += `        <news:language>${langCode}</news:language>\n`;
    xml += `      </news:publication>\n`;
    xml += `      <news:publication_date>${new Date(art.publishedAt).toISOString()}</news:publication_date>\n`;
    xml += `      <news:title>${title}</news:title>\n`;
    xml += `    </news:news>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  });
}
