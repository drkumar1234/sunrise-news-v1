import React from 'react';
import { getCategories, getSettings } from '@/lib/public-articles';
import { Header } from '@/components/layout/Header';
import { BreakingNewsTicker } from '@/components/layout/BreakingNewsTicker';
import { Footer } from '@/components/layout/Footer';
import { Language } from '@/types';

export const dynamic = 'force-dynamic';

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Language = resolvedParams.lang === 'te' ? 'te' : 'en';
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  return (
    <div className={`flex flex-col min-h-screen ${lang === 'te' ? 'lang-te' : ''}`}>
      <Header lang={lang} categories={categories} />
      <BreakingNewsTicker
        lang={lang}
        textEn={settings.breakingNewsTextEn}
        textTe={settings.breakingNewsTextTe}
        url={settings.breakingNewsUrl}
        enabled={settings.breakingNewsEnabled}
      />
      <main className="flex-1 bg-white">
        {children}
      </main>
      <Footer lang={lang} categories={categories} settings={settings} />
    </div>
  );
}
