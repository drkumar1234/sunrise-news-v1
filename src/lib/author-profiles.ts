import type { Author } from '@/types';

export const AUTHOR_ROSTER_VERSION = 1;

export const newsroomAuthors: Author[] = [
  { id: 'author-og-prakash', name: 'OG Prakash', slug: 'og-prakash', avatar: '/authors/og-prakash.jpg', avatarFit: 'contain' },
  { id: 'author-d-ravi-kumar', name: 'D Ravi Kumar', slug: 'd-ravi-kumar', avatar: '/authors/d-ravi-kumar.jpg', avatarFit: 'cover' },
  { id: 'author-nag-news', name: 'Nag News', slug: 'nag-news', avatar: '/authors/nag-news.jpg', avatarFit: 'contain' },
].map(profile => ({
  ...profile,
  avatarFit: profile.avatarFit as Author['avatarFit'],
  role: '', bioEn: '', bioTe: '', reportingBeats: [], email: '', verified: false,
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
    ...newsroomAuthors.map(author => retained.find(existing => existing.id === author.id) || structuredClone(author)),
    ...retained.filter(author => !requestedIds.has(author.id)),
  ];
}
