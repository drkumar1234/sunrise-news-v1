/** Set NEXT_PUBLIC_SITE_URL at build time when using a custom domain. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL;
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === 'https:' || url.protocol === 'http:') return url.origin;
    } catch {
      // Fall back to the current browser origin or local development URL.
    }
  }
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
}
