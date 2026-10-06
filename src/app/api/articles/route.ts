import { NextRequest, NextResponse } from 'next/server';
import { getArticles, createArticle } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') || 'published') as any;
    const categorySlug = searchParams.get('category') || undefined;
    const tagSlug = searchParams.get('tag') || undefined;
    const authorId = searchParams.get('author') || undefined;
    const format = searchParams.get('format') || undefined;
    const search = searchParams.get('q') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const result = getArticles({
      status,
      categorySlug,
      tagSlug,
      authorId,
      format,
      search,
      limit,
    });

    // Strip internal notes if not admin requested
    const cleanArticles = result.articles.map(art => {
      if (status !== 'all') {
        const { internalNotes, ...safeArt } = art;
        return safeArt;
      }
      return art;
    });

    return NextResponse.json({
      articles: cleanArticles,
      total: result.total,
    });
  } catch (error) {
    console.error('API Error /api/articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const defaultUser = { id: 'usr-admin', name: 'Editorial Desk' };
    const created = createArticle(body, defaultUser);
    return NextResponse.json({ article: created }, { status: 201 });
  } catch (error) {
    console.error('API Error POST /api/articles:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
