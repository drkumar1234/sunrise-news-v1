import { getSiteUrl } from '@/lib/site-url';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'SUNRISE NEWS — Your World. Your News. Every Day.',
    template: '%s | SUNRISE NEWS',
  },
  description: 'Premier digital news platform covering Andhra Pradesh, Telangana, Amaravati, Visakhapatnam, national politics, technology, and agriculture.',
  authors: [{ name: 'Sunrise News Editorial Board' }],
  creator: 'Sunrise News Digital Media',
  publisher: 'Sunrise News Digital Media Pvt Ltd',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-amber-200 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
