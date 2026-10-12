import { ApiError } from './auth';
import type { Article, Category, Tag, AdPlacement, EditorialSettings } from '@/types';
import { slugifyHeadline } from './article-slug';

type ObjectValue = Record<string, unknown>;
export function object(value: unknown): ObjectValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ApiError(400, 'Expected a JSON object.');
  return value as ObjectValue;
}
export function onlyKeys(value: ObjectValue, keys: string[]) {
  if (Object.keys(value).some(key => !keys.includes(key))) throw new ApiError(400, 'Unrecognized input field.');
}
export function string(value: unknown, name: string, max = 500, required = false): string {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new ApiError(400, `Invalid ${name}.`);
  return value.trim();
}
function boolean(value: unknown, name: string): boolean {
  if (typeof value !== 'boolean') throw new ApiError(400, `Invalid ${name}.`);
  return value;
}
function choice<T extends string>(value: unknown, values: readonly T[], name: string): T {
  if (typeof value !== 'string' || !values.includes(value as T)) throw new ApiError(400, `Invalid ${name}.`);
  return value as T;
}
export function safeUrl(value: unknown, name: string, required = false): string {
  const url = string(value, name, 2048, required);
  if (!url && !required) return url;
  if (/[\s\\\u0000-\u001f\u007f]/.test(url) || url.startsWith('//')) throw new ApiError(400, `Invalid ${name} URL.`);
  if (url.startsWith('/') || url === '#') return url;
  try { const parsed = new URL(url); if (['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password) return url; } catch {}
  throw new ApiError(400, `Invalid ${name} URL.`);
}
function slug(value: unknown, name = 'slug') {
  const result = string(value, name, 120, true);
  if (!/^[a-zA-Z0-9\u0C00-\u0C7F_-]+$/.test(result)) throw new ApiError(400, `Invalid ${name}. Use letters, numbers, and hyphens.`);
  return result;
}
function strings(value: unknown, name: string, maxItems = 50, maxLength = 120): string[] {
  if (!Array.isArray(value) || value.length > maxItems) throw new ApiError(400, `Invalid ${name}.`);
  return Array.from(new Set(value.map(item => string(item, name, maxLength, true))));
}
function date(value: unknown, name: string) {
  const result = string(value, name, 30, true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(result))) throw new ApiError(400, `Invalid ${name}.`);
  return result;
}

export async function readJson(request: Request, maxBytes = 600_000): Promise<ObjectValue> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new ApiError(415, 'Use application/json.');
  const length = Number(request.headers.get('content-length') || 0);
  if (length > maxBytes) throw new ApiError(413, 'The request is too large.');
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'A JSON body is required.');
  let size = 0;
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel(); throw new ApiError(413, 'The request is too large.'); }
    chunks.push(value);
  }
  try { return object(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
  catch (error) { if (error instanceof ApiError) throw error; throw new ApiError(400, 'Invalid JSON.'); }
}

export const STATUSES = ['draft', 'review', 'approved', 'published', 'archived'] as const;
export function articleInput(input: ObjectValue, partial = false): Partial<Article> & { autoSlug?: boolean } {
  const textFields: Record<string, number> = { headline: 500, headlineTe: 500, summary: 4000, summaryTe: 4000, body: 200000, bodyTe: 200000, categoryId: 120, subcategoryId: 120, authorId: 120, location: 200, locationTe: 200, imageCaption: 1000, imageCredit: 300, internalNotes: 20000, seoTitle: 500, seoDescription: 1000 };
  const boolFields = ['isBreaking', 'isLeadStory', 'isEditorPick', 'isTrending'];
  const urlFields = ['featuredImage', 'mediaUrl', 'canonicalUrl'];
  const otherFields = ['slug', 'autoSlug', 'tags', 'language', 'status', 'format', 'factCheck', 'galleryImages', 'attachedDocument'];
  onlyKeys(input, [...Object.keys(textFields), ...boolFields, ...urlFields, ...otherFields, 'changeNote']);
  const output: ObjectValue = {};
  for (const [key, max] of Object.entries(textFields)) if (key in input) output[key] = string(input[key], key, max, ['headline', 'categoryId', 'authorId', 'body'].includes(key));
  for (const key of boolFields) if (key in input) output[key] = boolean(input[key], key);
  for (const key of urlFields) if (key in input) output[key] = safeUrl(input[key], key);
  if ('slug' in input) output.slug = slug(input.slug);
  if ('autoSlug' in input) output.autoSlug = boolean(input.autoSlug, 'automatic URL');
  if ('tags' in input) output.tags = Array.from(new Set(strings(input.tags, 'tags').map(tag => slug(slugifyHeadline(tag), 'tag'))));
  if ('language' in input) output.language = choice(input.language, ['en', 'te'], 'language');
  if ('status' in input) output.status = choice(input.status, STATUSES, 'status');
  if ('format' in input) output.format = choice(input.format, ['article', 'video', 'photo', 'infographic', 'fact-check', 'investigation', 'opinion', 'live'], 'format');
  if ('attachedDocument' in input) {
    if (input.attachedDocument === null) output.attachedDocument = undefined;
    else {
      const document = object(input.attachedDocument);
      onlyKeys(document, ['name', 'url', 'size', 'type']);
      output.attachedDocument = { name: string(document.name, 'document name', 255, true), url: safeUrl(document.url, 'document', true), size: string(document.size, 'document size', 40), type: choice(document.type, ['pdf', 'docx', 'doc', 'other'], 'document type') };
    }
  }
  if ('galleryImages' in input) {
    if (!Array.isArray(input.galleryImages) || input.galleryImages.length > 30) throw new ApiError(400, 'Invalid image gallery.');
    output.galleryImages = input.galleryImages.map(item => {
      const image = object(item); onlyKeys(image, ['url', 'caption', 'credit']);
      return { url: safeUrl(image.url, 'gallery image', true), caption: string(image.caption, 'caption', 1000), credit: string(image.credit, 'credit', 300) };
    });
  }
  if ('factCheck' in input) {
    if (input.factCheck === null) output.factCheck = undefined;
    else {
      const fact = object(input.factCheck);
      const keys = ['claim', 'claimTe', 'claimedBy', 'originUrl', 'verdict', 'verdictTe', 'evidenceSummary', 'evidenceSummaryTe', 'reviewDate'];
      onlyKeys(fact, keys);
      const clean: ObjectValue = {};
      for (const key of ['claim', 'claimTe', 'claimedBy', 'evidenceSummary', 'evidenceSummaryTe']) clean[key] = string(fact[key], key, 10000);
      clean.verdict = choice(fact.verdict, ['True', 'Mostly True', 'False', 'Misleading', 'Unproven'], 'verdict');
      clean.verdictTe = choice(fact.verdictTe, ['నిజం', 'ఎక్కువగా నిజం', 'అబద్ధం', 'తప్పుదోవ పట్టించేది', 'రుజువు కాలేదు'], 'Telugu verdict');
      clean.reviewDate = date(fact.reviewDate, 'review date');
      if (fact.originUrl !== undefined) clean.originUrl = safeUrl(fact.originUrl, 'source');
      output.factCheck = clean;
    }
  }
  if (!partial) {
    for (const key of ['headline', 'body', 'slug', 'categoryId', 'authorId']) if (!output[key]) throw new ApiError(400, `${key} is required.`);
    Object.assign(output, { summary: '', tags: [], location: '', imageCaption: '', imageCredit: '', featuredImage: '', language: 'en', status: 'draft', ...output });
  }
  if (!Object.keys(output).length) throw new ApiError(400, 'No editable fields were supplied.');
  return output as Partial<Article> & { autoSlug?: boolean };
}

export function categoryInput(input: ObjectValue): Category {
  onlyKeys(input, ['id', 'slug', 'nameEn', 'nameTe', 'descriptionEn', 'descriptionTe', 'parentId', 'displayOrder', 'featured']);
  if (!Number.isInteger(input.displayOrder) || Number(input.displayOrder) < 0 || Number(input.displayOrder) > 10000) throw new ApiError(400, 'Invalid display order.');
  return { id: slug(input.id, 'category ID'), slug: slug(input.slug), nameEn: string(input.nameEn, 'English name', 200, true), nameTe: string(input.nameTe, 'Telugu name', 200, true), descriptionEn: string(input.descriptionEn, 'description', 4000), descriptionTe: string(input.descriptionTe, 'Telugu description', 4000), parentId: input.parentId ? slug(input.parentId, 'parent category') : undefined, displayOrder: Number(input.displayOrder), featured: input.featured === undefined ? false : boolean(input.featured, 'featured') };
}

export function tagInput(input: ObjectValue): Tag {
  onlyKeys(input, ['id', 'slug', 'nameEn', 'nameTe', 'canonicalSlug', 'aliases', 'articleCount']);
  return { id: slug(input.id, 'tag ID'), slug: slug(input.slug), nameEn: string(input.nameEn, 'English name', 200, true), nameTe: string(input.nameTe, 'Telugu name', 200, true), aliases: strings(input.aliases, 'aliases', 30), canonicalSlug: input.canonicalSlug ? slug(input.canonicalSlug) : undefined };
}

export function adInput(input: ObjectValue): AdPlacement {
  onlyKeys(input, ['id', 'slotKey', 'title', 'imageUrl', 'targetUrl', 'advertiser', 'startDate', 'endDate', 'isActive']);
  const result = { id: slug(input.id, 'ad ID'), slotKey: choice(input.slotKey, ['leaderboard', 'sidebar', 'mid_content', 'footer'], 'slot'), title: string(input.title, 'title', 300, true), imageUrl: safeUrl(input.imageUrl, 'image'), targetUrl: safeUrl(input.targetUrl, 'target'), advertiser: string(input.advertiser, 'advertiser', 300), startDate: date(input.startDate, 'start date'), endDate: date(input.endDate, 'end date'), isActive: boolean(input.isActive, 'active') };
  if (result.endDate < result.startDate) throw new ApiError(400, 'End date must follow start date.');
  return result;
}

export function settingsInput(input: ObjectValue): Partial<EditorialSettings> {
  const keys = ['siteNameEn', 'siteNameTe', 'taglineEn', 'taglineTe', 'breakingNewsEnabled', 'breakingNewsTextEn', 'breakingNewsTextTe', 'breakingNewsUrl', 'contactEmail', 'contactPhone', 'addressHyderabad', 'addressAmaravati', 'addressVisakhapatnam', 'addressDelhi', 'grievanceOfficerName', 'grievanceOfficerEmail'];
  onlyKeys(input, keys);
  const result: ObjectValue = {};
  for (const [key, value] of Object.entries(input)) {
    result[key] = key === 'breakingNewsEnabled' ? boolean(value, key) : key === 'breakingNewsUrl' ? safeUrl(value, key) : string(value, key, 2000);
    if (['contactEmail', 'grievanceOfficerEmail'].includes(key) && result[key]
      && !/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(String(result[key]))) throw new ApiError(400, `Invalid ${key}.`);
  }
  return result;
}
