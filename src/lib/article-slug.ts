/** Preserve Telugu words alongside English acronyms instead of keeping only the acronym. */
export function slugifyHeadline(value: string): string {
  return value.replace(/[\u200B-\u200D\uFEFF]/g, '').normalize('NFKC').toLowerCase()
    .replace(/[^a-z0-9\u0C00-\u0C7F\s_-]/g, '')
    .trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 80).replace(/-+$/g, '');
}
