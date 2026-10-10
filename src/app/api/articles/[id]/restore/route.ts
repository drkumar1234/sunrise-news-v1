import { restoreRevision, getArticleRevisions } from '@/lib/db';
import { requireAdmin, json, apiError, ApiError } from '@/lib/auth';
import { readJson, string, onlyKeys } from '@/lib/validation';
export const dynamic = 'force-dynamic';
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const user = await requireAdmin(request);
    const input = await readJson(request, 4096);
    onlyKeys(input, ['revisionId']);
    const article = await restoreRevision(params.id, string(input.revisionId, 'revision ID', 200, true), user);
    if (!article) throw new ApiError(404, 'Article revision not found.');
    return json({ article, revisions: await getArticleRevisions(params.id) });
  } catch (error) { return apiError(error); }
}
