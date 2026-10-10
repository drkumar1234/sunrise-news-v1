import { redirect } from 'next/navigation';

export default async function ArticleIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'te' ? 'te' : 'en';
  redirect(`/${lang}/latest`);
}
