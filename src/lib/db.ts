import 'server-only';
import { randomUUID } from 'node:crypto';
import { cache } from 'react';
import type {
  Article, Category, Tag, Author, AdPlacement, EditorialSettings, AuditLog,
  ArticleRevision, NewsletterSubscriber, Language, ArticleStatus, UserRole, EpaperEdition,
} from '@/types';
import {
  initialArticles, initialCategories, initialTags, initialAuthors,
  initialAdPlacements, initialSettings, initialAuditLogs,
} from './seed-data';
import importedData from '../../data/sunrise_news.json';
import { mutateJSON, readJSON } from './storage';
import { AUTHOR_ROSTER_VERSION, installNewsroomAuthors } from './author-profiles';
import { slugifyHeadline } from './article-slug';
import { EPAPER_CATEGORY } from './epaper';

type StoredRevision = ArticleRevision & { headlineTe?: string; summaryTe?: string; bodyTe?: string };
export interface DatabaseSchema {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  authorRosterVersion?: number;
  adPlacements: AdPlacement[];
  settings: EditorialSettings;
  auditLogs: AuditLog[];
  revisions: StoredRevision[];
  subscribers: NewsletterSubscriber[];
  epapers: EpaperEdition[];
  epaperVersion?: number;
}

type Editor = { id: string; name: string; role?: UserRole };
const STORE = 'sunrise-cms';
const KEY = 'database-v1';
const cleanText = (value: unknown): string => typeof value === 'string'
  ? value.replace(/[\u200B-\u200D\uFEFF]/g, '').trim() : '';
const text = (value: unknown): string => typeof value === 'string' ? value : '';
const statuses: ArticleStatus[] = ['draft', 'review', 'approved', 'published', 'archived'];

export class DatabaseValidationError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
    this.name = 'DatabaseValidationError';
  }
}

function normalizeArticle(value: Article): Article {
  return {
    ...value,
    id: text(value.id), slug: text(value.slug), headline: text(value.headline),
    summary: text(value.summary), body: text(value.body),
    categoryId: text(value.categoryId), authorId: text(value.authorId), location: text(value.location),
    featuredImage: text(value.featuredImage), imageCaption: text(value.imageCaption), imageCredit: text(value.imageCredit),
    language: value.language === 'te' ? 'te' : 'en',
    status: statuses.includes(value.status) ? value.status : 'draft',
    publishedAt: text(value.publishedAt), updatedAt: text(value.updatedAt),
    tags: Array.isArray(value.tags) ? value.tags.filter(tag => typeof tag === 'string') : [],
    readingTimeMinutes: value.readingTimeMinutes || 1,
  };
}

function normalizeDatabase(value: unknown): DatabaseSchema {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('The stored newsroom database is not a JSON object.');
  const db = value as Partial<DatabaseSchema>;
  const array = <T,>(stored: T[] | undefined, defaults: T[]): T[] => {
    if (stored === undefined) return structuredClone(defaults);
    if (!Array.isArray(stored)) throw new Error('The stored newsroom database has an invalid collection.');
    return stored;
  };
  return {
    articles: array(db.articles, initialArticles).map(normalizeArticle),
    categories: (db.epaperVersion || 0) < 1 && !array(db.categories, initialCategories).some(category => category.slug === EPAPER_CATEGORY.slug)
      ? [...array(db.categories, initialCategories), structuredClone(EPAPER_CATEGORY)]
      : array(db.categories, initialCategories),
    epapers: array(db.epapers, []),
    epaperVersion: Math.max(db.epaperVersion || 0, 1),
    tags: array(db.tags, initialTags).map(tag => ({ ...tag, aliases: Array.isArray(tag.aliases) ? tag.aliases : [] })),
    authors: (db.authorRosterVersion || 0) < AUTHOR_ROSTER_VERSION
      ? installNewsroomAuthors(array(db.authors, initialAuthors))
      : array(db.authors, initialAuthors),
    authorRosterVersion: Math.max(db.authorRosterVersion || 0, AUTHOR_ROSTER_VERSION),
    adPlacements: array(db.adPlacements, initialAdPlacements),
    settings: { ...initialSettings, ...db.settings }, auditLogs: array(db.auditLogs, initialAuditLogs),
    revisions: array(db.revisions, []), subscribers: array(db.subscribers, []),
  };
}

// Bundle the tracked snapshot into the server function as the migration source.
const seedDatabase = (): DatabaseSchema => normalizeDatabase(structuredClone(importedData));

// React memoization is scoped to a server render/request, never a global data
// cache. Route handlers (including mutations) read storage afresh on each call.
const loadDB = async (): Promise<DatabaseSchema> => {
  const stored = await readJSON<DatabaseSchema>(STORE, KEY, seedDatabase);
  if ((stored.authorRosterVersion || 0) >= AUTHOR_ROSTER_VERSION && (stored.epaperVersion || 0) >= 1) return normalizeDatabase(stored);
  // Apply roster and E-paper migrations to live storage with the same CAS
  // transaction used by editorial saves. Never overwrite newer cloud articles
  // with the bundled seed, or assign a real byline to an old sample attribution.
  return mutateJSON<DatabaseSchema, DatabaseSchema>(STORE, KEY, seedDatabase, current => {
    Object.assign(current, normalizeDatabase(current));
    return current;
  });
};
// React 18 exposes cache through Next's server component runtime, while its
// ordinary Node/route-handler entry does not. Both execution paths stay valid.
const getDB = typeof cache === 'function' ? cache(loadDB) : loadDB;

async function changeDB<R>(change: (db: DatabaseSchema) => R): Promise<R> {
  return mutateJSON<DatabaseSchema, R>(STORE, KEY, seedDatabase, stored => {
    Object.assign(stored, normalizeDatabase(stored));
    return change(stored);
  });
}

/** Server-only snapshot for authenticated administrative exports. */
export async function getAllData(): Promise<DatabaseSchema> { return getDB(); }

export async function getEpaperEditions(includePrivate = false): Promise<EpaperEdition[]> {
  return [...(await getDB()).epapers]
    .filter(edition => includePrivate || edition.status === 'published')
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export async function createEpaperEdition(input: Omit<EpaperEdition, 'id' | 'createdAt' | 'updatedAt'>, user: Editor): Promise<EpaperEdition> {
  const now = new Date().toISOString();
  const saved: EpaperEdition = { ...input, id: `epaper-${randomUUID()}`, createdAt: now, updatedAt: now };
  return changeDB(db => {
    db.epapers.unshift(saved);
    audit(db, user, saved.status === 'published' ? 'publish' : 'create', 'epaper', saved.id, saved.title, `${saved.date} • ${saved.edition}`);
    return saved;
  });
}

export async function setEpaperStatus(id: string, status: EpaperEdition['status'], user: Editor): Promise<EpaperEdition> {
  return changeDB(db => {
    const saved = db.epapers.find(edition => edition.id === id);
    if (!saved) throw new DatabaseValidationError('E-paper edition not found.', 404);
    saved.status = status; saved.updatedAt = new Date().toISOString();
    audit(db, user, status === 'published' ? 'publish' : status === 'archived' ? 'archive' : 'update', 'epaper', id, saved.title, `E-paper status: ${status}`);
    return saved;
  });
}

export interface GetArticlesOptions {
  language?: Language;
  categoryId?: string;
  categorySlug?: string;
  tagSlug?: string;
  authorId?: string;
  status?: ArticleStatus | 'all';
  isLeadStory?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  isEditorPick?: boolean;
  format?: string;
  search?: string;
  location?: string;
  limit?: number;
  offset?: number;
}

function canonicalTag(tags: Tag[], input: string): string {
  const clean = input.toLowerCase().trim();
  const found = tags.find(tag => tag.slug.toLowerCase() === clean || tag.aliases.some(alias => alias.toLowerCase() === clean));
  return found?.canonicalSlug || found?.slug || clean;
}

export async function getArticles(options: GetArticlesOptions = {}): Promise<{ articles: Article[]; total: number }> {
  const db = await getDB();
  let list = db.articles;
  if (options.status !== 'all') list = list.filter(article => article.status === (options.status || 'published'));
  if (options.categorySlug) {
    const category = db.categories.find(item => item.slug === options.categorySlug);
    list = category ? list.filter(article => article.categoryId === category.id || article.subcategoryId === category.id) : [];
  } else if (options.categoryId) {
    list = list.filter(article => article.categoryId === options.categoryId || article.subcategoryId === options.categoryId);
  }
  if (options.tagSlug) {
    const canonical = canonicalTag(db.tags, options.tagSlug);
    list = list.filter(article => article.tags.some(tag => canonicalTag(db.tags, tag) === canonical));
  }
  if (options.authorId) list = list.filter(article => article.authorId === options.authorId);
  for (const flag of ['isLeadStory', 'isBreaking', 'isTrending', 'isEditorPick'] as const) {
    if (options[flag] !== undefined) list = list.filter(article => !!article[flag] === options[flag]);
  }
  if (options.format) list = list.filter(article => article.format === options.format);
  if (options.location) {
    const location = options.location.toLowerCase().trim();
    list = list.filter(article => article.location.toLowerCase().includes(location) || text(article.locationTe).toLowerCase().includes(location));
  }
  // Both translations belong to one article and remain available in both editions.
  if (options.search?.trim()) {
    const query = options.search.toLowerCase().trim();
    list = list.filter(article => [article.headline, article.summary, article.body, article.location,
      article.headlineTe, article.summaryTe, article.bodyTe, article.locationTe]
      .some(value => text(value).toLowerCase().includes(query)));
  }
  list = [...list].sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  const total = list.length;
  const offset = Math.max(0, options.offset || 0);
  const limit = options.limit === undefined ? total : Math.max(0, options.limit);
  return { articles: list.slice(offset, offset + limit), total };
}

export function generateSafeSlug(value: string, fallbackPrefix = 'story'): string {
  return slugifyHeadline(value) || `${fallbackPrefix}-${randomUUID()}`;
}

const slugKey = (slug: string) => slug.normalize('NFKC').trim().toLowerCase();
function checkSlug<T extends { id: string; slug: string }>(items: T[], slug: string, excludeId?: string): void {
  if (items.some(item => item.id !== excludeId && slugKey(item.slug) === slugKey(slug))) {
    throw new DatabaseValidationError('That URL slug is already in use. Choose a different slug.', 409);
  }
}

type ArticleWriteOptions = { autoSlug?: boolean };
function availableArticleSlug(articles: Article[], base: string, excludeId?: string): string {
  const used = new Set(articles.filter(article => article.id !== excludeId).map(article => slugKey(article.slug)));
  let candidate = base;
  for (let number = 2; used.has(slugKey(candidate)); number++) {
    const suffix = `-${number}`;
    candidate = `${base.slice(0, 80 - suffix.length).replace(/-+$/g, '')}${suffix}`;
  }
  return candidate;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (!slug) return undefined;
  let decoded = slug;
  try { decoded = decodeURIComponent(slug); } catch { /* Keep malformed input as literal text. */ }
  const targets = [slugKey(slug), slugKey(decoded)];
  return (await getDB()).articles.find(article => targets.includes(slugKey(article.slug)) || targets.includes(article.id));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  return (await getDB()).articles.find(article => article.id === id);
}

function readingTime(article: Pick<Article, 'body' | 'bodyTe'>): number {
  const count = `${article.body || ''} ${article.bodyTe || ''}`.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(count / 200));
}

function audit(db: DatabaseSchema, user: Editor, action: AuditLog['action'], targetType: AuditLog['targetType'], targetId: string, targetTitle: string, details?: string): void {
  db.auditLogs.unshift({
    id: `log-${randomUUID()}`, userId: user.id, userName: user.name, userRole: user.role || 'editor',
    action, targetType, targetId, targetTitle, timestamp: new Date().toISOString(), details,
  });
}

export async function createArticle(
  articleData: Omit<Article, 'id' | 'publishedAt' | 'updatedAt' | 'readingTimeMinutes'>,
  user: Editor,
  options: ArticleWriteOptions = {},
): Promise<Article> {
  const now = new Date().toISOString();
  const headline = cleanText(articleData.headline) || cleanText(articleData.headlineTe);
  if (!headline) throw new DatabaseValidationError('An article headline is required.');
  if (!statuses.includes(articleData.status)) throw new DatabaseValidationError('Invalid article status.');
  const article = normalizeArticle({
    ...articleData,
    id: `art-${randomUUID()}`, headline, headlineTe: cleanText(articleData.headlineTe) || headline,
    summary: cleanText(articleData.summary) || cleanText(articleData.summaryTe),
    summaryTe: cleanText(articleData.summaryTe) || cleanText(articleData.summary),
    slug: generateSafeSlug(cleanText(articleData.slug) || headline),
    publishedAt: now, updatedAt: now, readingTimeMinutes: readingTime(articleData),
  });
  return changeDB(db => {
    const saved = options.autoSlug ? { ...article, slug: availableArticleSlug(db.articles, article.slug) } : article;
    checkSlug(db.articles, saved.slug);
    db.articles.unshift(saved);
    audit(db, user, 'create', 'article', saved.id, saved.headline, `Article created with status: ${saved.status}`);
    return saved;
  });
}

function applyArticleUpdate(db: DatabaseSchema, id: string, updates: Partial<Article>, user: Editor, changeNote?: string, options: ArticleWriteOptions = {}): Article | null {
  const index = db.articles.findIndex(article => article.id === id);
  if (index === -1) return null;
  if (updates.status !== undefined && !statuses.includes(updates.status)) throw new DatabaseValidationError('Invalid article status.');
  const current = db.articles[index];
  const now = new Date().toISOString();
  const updated = normalizeArticle({
    ...current, ...updates, id: current.id,
    slug: updates.slug === undefined ? current.slug : generateSafeSlug(cleanText(updates.slug) || updates.headline || current.headline),
    updatedAt: now,
    publishedAt: current.status !== 'published' && updates.status === 'published' ? now : current.publishedAt,
  });
  if (!cleanText(updated.headline) && !cleanText(updated.headlineTe)) throw new DatabaseValidationError('An article headline is required.');
  updated.readingTimeMinutes = readingTime(updated);
  if (options.autoSlug && updates.slug !== undefined) updated.slug = availableArticleSlug(db.articles, updated.slug, id);
  checkSlug(db.articles, updated.slug, id);
  const version = Math.max(0, ...db.revisions.filter(revision => revision.articleId === id).map(revision => revision.version)) + 1;
  db.revisions.unshift({
    id: `rev-${randomUUID()}`, articleId: id, version,
    headline: current.headline, headlineTe: text(current.headlineTe),
    summary: current.summary, summaryTe: text(current.summaryTe), body: current.body, bodyTe: text(current.bodyTe),
    editorId: user.id, editorName: user.name, createdAt: now, changeNote: changeNote || 'Article updated',
  });
  db.articles[index] = updated;
  audit(db, user, 'update', 'article', id, updated.headline, changeNote || `Updated article (Version ${version})`);
  return updated;
}

export async function updateArticle(id: string, updates: Partial<Article>, user: Editor, changeNote?: string, options: ArticleWriteOptions = {}): Promise<Article | null> {
  return changeDB(db => applyArticleUpdate(db, id, updates, user, changeNote, options));
}

export async function deleteArticle(id: string, user: Editor): Promise<boolean> {
  return changeDB(db => {
    const index = db.articles.findIndex(article => article.id === id);
    if (index === -1) return false;
    const [deleted] = db.articles.splice(index, 1);
    db.revisions = db.revisions.filter(revision => revision.articleId !== id);
    audit(db, user, 'delete', 'article', id, deleted.headline);
    return true;
  });
}

export async function getArticleRevisions(articleId: string): Promise<StoredRevision[]> {
  return (await getDB()).revisions.filter(revision => revision.articleId === articleId).sort((a, b) => b.version - a.version);
}

export async function restoreRevision(articleId: string, revisionId: string, user: Editor): Promise<Article | null> {
  return changeDB(db => {
    const revision = db.revisions.find(item => item.id === revisionId && item.articleId === articleId);
    if (!revision) return null;
    const updates: Partial<Article> = { headline: revision.headline, summary: revision.summary, body: revision.body };
    // Old revisions contain only English; do not erase current Telugu content.
    if (Object.prototype.hasOwnProperty.call(revision, 'headlineTe')) updates.headlineTe = revision.headlineTe;
    if (Object.prototype.hasOwnProperty.call(revision, 'summaryTe')) updates.summaryTe = revision.summaryTe;
    if (Object.prototype.hasOwnProperty.call(revision, 'bodyTe')) updates.bodyTe = revision.bodyTe;
    return applyArticleUpdate(db, articleId, updates, user, `Restored to Version ${revision.version}`);
  });
}

export async function getCategories(): Promise<Category[]> {
  return [...(await getDB()).categories].sort((a, b) => a.displayOrder - b.displayOrder);
}
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getDB()).categories.find(category => category.slug === slug);
}
export async function saveCategory(category: Category, user: Editor): Promise<Category> {
  const saved = { ...category, id: category.id || `cat-${randomUUID()}`, slug: generateSafeSlug(category.slug || category.nameEn || category.nameTe, 'category') };
  return changeDB(db => {
    checkSlug(db.categories, saved.slug, saved.id);
    const index = db.categories.findIndex(item => item.id === saved.id);
    if (index >= 0) db.categories[index] = saved;
    else db.categories.push(saved);
    audit(db, user, index >= 0 ? 'update' : 'create', 'category', saved.id, saved.nameEn);
    return saved;
  });
}

export async function getTags(): Promise<Tag[]> { return (await getDB()).tags; }
export async function resolveCanonicalTag(inputTag: string): Promise<string> {
  return canonicalTag((await getDB()).tags, inputTag);
}
export async function saveTag(tag: Tag, user: Editor): Promise<Tag> {
  const saved = {
    ...tag, id: tag.id || `tag-${randomUUID()}`, slug: generateSafeSlug(tag.slug || tag.nameEn || tag.nameTe, 'tag'),
    aliases: Array.isArray(tag.aliases) ? tag.aliases.map(alias => alias.toLowerCase().trim()).filter(Boolean) : [],
  };
  return changeDB(db => {
    checkSlug(db.tags, saved.slug, saved.id);
    const index = db.tags.findIndex(item => item.id === saved.id);
    if (index >= 0) db.tags[index] = saved;
    else db.tags.push(saved);
    audit(db, user, index >= 0 ? 'update' : 'create', 'tag', saved.id, saved.nameEn);
    return saved;
  });
}

export async function getAuthors(): Promise<Author[]> { return (await getDB()).authors; }
export async function getAuthorById(id: string): Promise<Author | undefined> { return (await getDB()).authors.find(author => author.id === id); }
export async function getAuthorBySlug(slug: string): Promise<Author | undefined> { return (await getDB()).authors.find(author => author.slug === slug); }
export async function getSettings(): Promise<EditorialSettings> { return (await getDB()).settings; }
export async function updateSettings(updates: Partial<EditorialSettings>, user: Editor): Promise<EditorialSettings> {
  return changeDB(db => {
    db.settings = { ...db.settings, ...updates };
    audit(db, user, 'update', 'settings', 'editorial', db.settings.siteNameEn);
    return db.settings;
  });
}

export async function getAdPlacements(): Promise<AdPlacement[]> { return (await getDB()).adPlacements; }
export async function getActiveAd(slotKey: AdPlacement['slotKey']): Promise<AdPlacement | undefined> {
  const today = new Date().toISOString().slice(0, 10);
  return (await getDB()).adPlacements.find(ad => ad.slotKey === slotKey && ad.isActive && ad.startDate <= today && ad.endDate >= today);
}
export async function saveAdPlacement(ad: AdPlacement, user?: Editor): Promise<AdPlacement> {
  const saved = { ...ad, id: ad.id || `ad-${randomUUID()}` };
  return changeDB(db => {
    const index = db.adPlacements.findIndex(item => item.id === saved.id);
    if (index >= 0) db.adPlacements[index] = saved;
    else db.adPlacements.push(saved);
    if (user) audit(db, user, index >= 0 ? 'update' : 'create', 'ad', saved.id, saved.title);
    return saved;
  });
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> { return (await getDB()).subscribers; }
export async function addSubscriber(
  email: string, language: Language = 'en', editions: NewsletterSubscriber['editions'] = ['morning_briefing'],
): Promise<{ success: boolean; message: string }> {
  const address = email.trim().toLowerCase();
  if (address.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) throw new DatabaseValidationError('Enter a valid email address.');
  return changeDB(db => {
    const existing = db.subscribers.find(subscriber => subscriber.email.toLowerCase() === address);
    if (existing) Object.assign(existing, { isActive: true, editions, language });
    else db.subscribers.push({ id: `sub-${randomUUID()}`, email: address, language, editions, subscribedAt: new Date().toISOString(), isActive: true });
    return { success: true, message: 'Thank you! Your subscription preferences have been saved.' };
  });
}
export async function getAuditLogs(): Promise<AuditLog[]> { return (await getDB()).auditLogs; }
