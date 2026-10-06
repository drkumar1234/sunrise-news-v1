import { NextRequest, NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle, getArticleRevisions } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = getArticleById(params.id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const revisions = getArticleRevisions(params.id);
    return NextResponse.json({ article, revisions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const defaultUser = { id: 'usr-admin', name: 'Editorial Desk' };
    const updated = updateArticle(params.id, body, defaultUser, body.changeNote);

    if (!updated) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const defaultUser = { id: 'usr-admin', name: 'Super Admin' };
    const success = deleteArticle(params.id, defaultUser);
    if (!success) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
