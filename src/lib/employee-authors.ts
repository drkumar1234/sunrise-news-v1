import type { Author } from '@/types';
import type { Employee } from './employees';

/** Project only public byline fields; never expose login email or credentials. */
export function withEmployeeAuthors(authors: Author[], employees: Employee[]): Author[] {
  const ids = new Set(employees.map(employee => employee.id));
  // Removed accounts remain authors so historical article bylines are retained.
  return [...authors.filter(author => !ids.has(author.id)), ...employees.map(employee => ({
    id: employee.id, slug: employee.id, name: employee.name,
    avatar: employee.avatar || '/brand/sunrise-news-logo.jpg', avatarFit: employee.avatar ? 'cover' as const : 'contain' as const,
    role: employee.designation || 'Editor', bioEn: '', bioTe: '', reportingBeats: [], email: '', verified: false,
  }))];
}
