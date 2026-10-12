import type { Category } from '@/types';

export const EPAPER_CATEGORY: Category = {
  id: 'cat-epaper-daily-pdf', slug: 'e-paper-daily-pdf',
  nameEn: 'E-paper Daily PDF', nameTe: 'ఈ-పేపర్ రోజువారీ PDF',
  descriptionEn: 'Read and download the daily newspaper in PDF or JPG format.',
  descriptionTe: 'రోజువారీ వార్తాపత్రికను PDF లేదా JPG రూపంలో చదవండి, డౌన్‌లోడ్ చేసుకోండి.',
  displayOrder: 100, featured: true,
};

export function validEditionDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
