import { NextResponse } from 'next/server';
import { getArticles, getCategories } from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://sunrisenews.in';
  const { articles } = getArticles({ status: 'published' });
  const categories = getCategories();

  const staticRoutes = [
    '',
    '/en',
    '/te',
    '/en/latest',
    '/te/latest',
    '/en/trending',
    '/te/trending',
    '/en/top-stories',
    '/te/top-stories',
    '/en/breaking',
    '/te/breaking',
    '/en/fact-checks',
    '/te/fact-checks',
    '/en/editorial-opinion',
    '/te/editorial-opinion',
    '/en/special-reports',
    '/te/special-reports',
    '/en/investigations',
    '/te/investigations',
    '/en/explainers',
    '/te/explainers',
    '/en/corrections',
    '/te/corrections',
    '/en/authors',
    '/te/authors',
    '/en/videos',
    '/te/videos',
    '/en/photos',
    '/te/photos',
    '/en/infographics',
    '/te/infographics',
    '/en/podcasts',
    '/te/podcasts',
    '/en/live',
    '/te/live',
    '/en/newsletter',
    '/te/newsletter',
    '/en/about',
    '/te/about',
    '/en/contact',
    '/te/contact',
    '/en/editorial-standards',
    '/te/editorial-standards',
    '/en/privacy',
    '/te/privacy',
    '/en/terms',
    '/te/terms',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static routes
  staticRoutes.forEach((route) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>${route === '' || route === '/en' || route === '/te' ? '1.0' : '0.8'}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Category routes
  categories.forEach((cat) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/en/category/${cat.slug}</loc>\n`;
    xml += `    <changefreq>hourly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/te/category/${cat.slug}</loc>\n`;
    xml += `    <changefreq>hourly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  // Article routes
  articles.forEach((art) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${art.language}/article/${art.slug}</loc>\n`;
    xml += `    <lastmod>${new Date(art.updatedAt).toISOString()}</lastmod>\n`;
    xml += `    <changefreq>never</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
