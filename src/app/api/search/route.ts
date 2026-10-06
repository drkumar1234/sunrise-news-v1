import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || undefined;
    const categorySlug = searchParams.get('category') || undefined;
    const tagSlug = searchParams.get('tag') || undefined;
    const authorId = searchParams.get('author') || undefined;

    const result = getArticles({
      status: 'published',
      search: q,
      categorySlug,
      tagSlug,
      authorId,
    });

    return NextResponse.json({
      articles: result.articles,
      total: result.total,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
