/** Only allow HTTP(S) links and ordinary absolute paths on this website. */
export function safeUrl(value: string | undefined, fallback = '#'): string {
  if (!value) return fallback;
  const url = value.trim();
  if (/[\u0000-\u001f\u007f\\]/.test(url)) return fallback;
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'https:' || parsed.protocol === 'http:') && !parsed.username && !parsed.password
      ? parsed.href : fallback;
  } catch {
    return fallback;
  }
}

/** Embedded media runs only on trusted video players, never on our own origin. */
export function safeEmbedUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return undefined;
    const allowed = ((url.hostname === 'www.youtube.com' || url.hostname === 'www.youtube-nocookie.com') && url.pathname.startsWith('/embed/'))
      || (url.hostname === 'player.vimeo.com' && url.pathname.startsWith('/video/'));
    return allowed ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function formatInline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
