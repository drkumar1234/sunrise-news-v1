import { redirect } from 'next/navigation';

export default function ArticleIndexPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = params.lang === 'te' ? 'te' : 'en';
  redirect(`/${lang}/latest`);
}
