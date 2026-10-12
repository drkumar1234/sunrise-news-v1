import type { Author } from '@/types';

export const AUTHOR_ROSTER_VERSION = 2;

export const newsroomAuthors: Author[] = [
  { id: 'author-d-ravi-kumar', name: 'Didde Ravi Kumar', role: 'MD, Editor', slug: 'd-ravi-kumar', avatar: '/authors/d-ravi-kumar.jpg', avatarFit: 'cover' },
  { id: 'author-og-prakash', name: 'OG Prakash', role: 'Sub Editor', slug: 'og-prakash', avatar: '/authors/og-prakash.jpg', avatarFit: 'contain' },
  { id: 'author-nag-news', name: 'Nag News', role: 'Sub Editor', slug: 'nag-news', avatar: '/authors/nag-news.jpg', avatarFit: 'contain' },
].map(profile => ({
  ...profile,
  avatarFit: profile.avatarFit as Author['avatarFit'],
  bioEn: '', bioTe: '', reportingBeats: [], email: '', verified: false,
}));

const sampleNames: Record<string, string> = {
  'auth-1': 'Ramesh Varma',
  'auth-2': 'Kavitha Rao',
  'auth-3': 'S. Krishna Murthy',
  'auth-4': 'Dr. B. Venkat Reddy',
  'auth-5': 'Ananya Sharma',
};

/** Replace only the original placeholders, preserving independently edited profiles. */
export function installNewsroomAuthors(authors: Author[]): Author[] {
  const retained = authors.filter(author => sampleNames[author.id] !== author.name);
  const requestedIds = new Set(newsroomAuthors.map(author => author.id));
  return [
    ...newsroomAuthors.map(author => {
      const existing = retained.find(profile => profile.id === author.id);
      return existing
        ? { ...existing, name: author.name, role: author.role }
        : structuredClone(author);
    }),
    ...retained.filter(author => !requestedIds.has(author.id)),
  ];
}
