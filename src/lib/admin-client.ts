'use client';

export async function adminRequest<T = any>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, cache: 'no-store', credentials: 'same-origin' });
  const result = await response.json().catch(() => ({}));
  if (response.status === 401 && !url.startsWith('/api/auth/')) window.location.assign('/admin/login');
  if (!response.ok) throw new Error(result.error || 'Unable to complete the request. Please try again.');
  return result as T;
}
export function saveAdmin<T = any>(url: string, data: unknown): Promise<T> {
  return adminRequest<T>(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}
