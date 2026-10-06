import { 
  Article, Category, Tag, Author, AdPlacement, 
  EditorialSettings, AuditLog, ArticleRevision, NewsletterSubscriber, 
  Language, ArticleStatus 
} from '@/types';
import { 
  initialArticles, initialCategories, initialTags, 
  initialAuthors, initialAdPlacements, initialSettings, initialAuditLogs 
} from './seed-data';

interface DatabaseSchema {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  adPlacements: AdPlacement[];
  settings: EditorialSettings;
  auditLogs: AuditLog[];
  revisions: ArticleRevision[];
  subscribers: NewsletterSubscriber[];
}

function isServer(): boolean {
  return typeof window === 'undefined';
}

function loadDatabase(): DatabaseSchema {
  const defaultData: DatabaseSchema = {
    articles: [...initialArticles],
    categories: [...initialCategories],
    tags: [...initialTags],
    authors: [...initialAuthors],
    adPlacements: [...initialAdPlacements],
    settings: { ...initialSettings },
    auditLogs: [...initialAuditLogs],
    revisions: [],
    subscribers: [
      {
        id: 'sub-1',
        email: 'reader@example.com',
        language: 'en',
        editions: ['morning_briefing', 'ap_telangana'],
        subscribedAt: '2026-09-20T10:00:00Z',
        isActive: true,
      }
    ],
  };

  if (!isServer()) {
    return defaultData;
  }

  try {
    const fs = require('fs');
    const path = require('path');
    const dataDir = path.join(process.cwd(), 'data');
    const dbFile = path.join(dataDir, 'sunrise_news.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Ensure official brand logo is synchronized to public/brand
    try {
      const uploadedLogo = 'C:\\Users\\AI\\.gemini\\antigravity-ide\\brain\\90b3782b-9297-48d6-a30c-475e661af80d\\.user_uploaded\\media_1791269368090.jpg';
      const publicBrandDir = path.join(process.cwd(), 'public', 'brand');
      const publicLogoPath = path.join(publicBrandDir, 'sunrise-news-logo.jpg');
      const rootLogoPath = path.join(process.cwd(), 'public', 'logo.png');
      const rootLogoJpgPath = path.join(process.cwd(), 'public', 'logo.jpg');

      if (fs.existsSync(uploadedLogo)) {
        if (!fs.existsSync(publicBrandDir)) {
          fs.mkdirSync(publicBrandDir, { recursive: true });
        }
        fs.copyFileSync(uploadedLogo, publicLogoPath);
        fs.copyFileSync(uploadedLogo, rootLogoPath);
        fs.copyFileSync(uploadedLogo, rootLogoJpgPath);
      }
    } catch (logoErr) {
      // Ignore if source not present
    }

    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }

    const raw = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultData;
  }
}

function saveDatabase(data: DatabaseSchema): void {
  if (!isServer()) return;

  try {
    const fs = require('fs');
    const path = require('path');
    const dataDir = path.join(process.cwd(), 'data');
    const dbFile = path.join(dataDir, 'sunrise_news.json');
    const tempPath = `${dbFile}.tmp`;

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, dbFile);
  } catch (err) {
    console.error('Error saving sunrise_news.json:', err);
  }
}

// Memory cache with file backup for speed
let dbCache: DatabaseSchema | null = null;

function getDB(): DatabaseSchema {
  if (!dbCache) {
    dbCache = loadDatabase();
  }
  return dbCache;
}

function persistDB(): void {
  if (dbCache) {
    saveDatabase(dbCache);
  }
}

/* ==========================================================================
   Article Queries and Mutations
   ========================================================================== */

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

export function getArticles(options: GetArticlesOptions = {}): { articles: Article[]; total: number } {
  const db = getDB();
  let list = [...db.articles];

  // Exclude draft/review unless specifically requested
  if (!options.status || options.status !== 'all') {
    const targetStatus = options.status || 'published';
    list = list.filter(a => a.status === targetStatus);
  }

  // Category filter
  if (options.categorySlug) {
    const cat = db.categories.find(c => c.slug === options.categorySlug);
    if (cat) {
      list = list.filter(a => a.categoryId === cat.id || a.subcategoryId === cat.id);
    }
  } else if (options.categoryId) {
    list = list.filter(a => a.categoryId === options.categoryId || a.subcategoryId === options.categoryId);
  }

  // Tag filter with canonical resolution
  if (options.tagSlug) {
    const canonical = resolveCanonicalTag(options.tagSlug);
    list = list.filter(a => a.tags.includes(canonical));
  }

  // Author filter
  if (options.authorId) {
    list = list.filter(a => a.authorId === options.authorId);
  }

  // Flags
  if (options.isLeadStory !== undefined) {
    list = list.filter(a => !!a.isLeadStory === options.isLeadStory);
  }
  if (options.isBreaking !== undefined) {
    list = list.filter(a => !!a.isBreaking === options.isBreaking);
  }
  if (options.isTrending !== undefined) {
    list = list.filter(a => !!a.isTrending === options.isTrending);
  }
  if (options.isEditorPick !== undefined) {
    list = list.filter(a => !!a.isEditorPick === options.isEditorPick);
  }
  if (options.format) {
    list = list.filter(a => a.format === options.format);
  }

  // Search filter
  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    list = list.filter(a => {
      const matchEn = a.headline.toLowerCase().includes(q) || 
                      a.summary.toLowerCase().includes(q) || 
                      a.body.toLowerCase().includes(q) ||
                      a.location.toLowerCase().includes(q);
      const matchTe = (a.headlineTe && a.headlineTe.toLowerCase().includes(q)) ||
                      (a.summaryTe && a.summaryTe.toLowerCase().includes(q)) ||
                      (a.bodyTe && a.bodyTe.toLowerCase().includes(q)) ||
                      (a.locationTe && a.locationTe.toLowerCase().includes(q));
      return matchEn || matchTe;
    });
  }

  // Sort by publishedAt desc
  list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const total = list.length;
  const offset = options.offset || 0;
  const limit = options.limit || list.length;
  const paginated = list.slice(offset, offset + limit);

  return { articles: paginated, total };
}

export function generateSafeSlug(text: string, fallbackPrefix: string = 'story'): string {
  if (!text) return `${fallbackPrefix}-${Date.now().toString(36)}`;

  // Strip zero-width chars and trim
  const clean = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (!clean) return `${fallbackPrefix}-${Date.now().toString(36)}`;

  // 1. If English words exist, create clean kebab-case slug
  const english = clean
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (english.length >= 3) {
    return english.slice(0, 80);
  }

  // 2. Unicode slug preserving English and Telugu characters (\u0C00-\u0C7F)
  const unicodeSlug = clean
    .replace(/[^a-zA-Z0-9\u0C00-\u0C7F\s_-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  if (unicodeSlug.length > 0) {
    return unicodeSlug;
  }

  return `${fallbackPrefix}-${Date.now().toString(36)}`;
}

export function getArticleBySlug(slug: string): Article | undefined {
  if (!slug) return undefined;
  const db = getDB();

  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {}

  const target = slug.trim();
  const targetDecoded = decoded.trim();

  return db.articles.find(a => {
    if (!a.slug && !a.id) return false;
    const s = (a.slug || '').trim();
    if (s && (s === target || s === targetDecoded || s.toLowerCase() === target.toLowerCase() || s.toLowerCase() === targetDecoded.toLowerCase())) {
      return true;
    }
    // Also match by ID if slug not found
    if (a.id === target || a.id === targetDecoded) {
      return true;
    }
    return false;
  });
}

export function getArticleById(id: string): Article | undefined {
  const db = getDB();
  return db.articles.find(a => a.id === id);
}

export function createArticle(articleData: Omit<Article, 'id' | 'publishedAt' | 'updatedAt' | 'readingTimeMinutes'>, user: { id: string; name: string }): Article {
  const db = getDB();
  const id = `art-${Date.now()}`;
  const now = new Date().toISOString();
  
  // Clean zero-width chars and ensure valid strings
  let cleanHeadline = (articleData.headline || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  let cleanHeadlineTe = (articleData.headlineTe || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  let cleanSummary = (articleData.summary || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  let cleanSummaryTe = (articleData.summaryTe || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

  if (!cleanHeadline && cleanHeadlineTe) cleanHeadline = cleanHeadlineTe;
  if (!cleanHeadlineTe && cleanHeadline) cleanHeadlineTe = cleanHeadline;
  if (!cleanHeadline && !cleanHeadlineTe) {
    cleanHeadline = 'Breaking News Story';
    cleanHeadlineTe = 'తాజా వార్త';
  }

  if (!cleanSummary && cleanSummaryTe) cleanSummary = cleanSummaryTe;
  if (!cleanSummaryTe && cleanSummary) cleanSummaryTe = cleanSummary;

  let cleanSlug = (articleData.slug || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  if (!cleanSlug) {
    cleanSlug = generateSafeSlug(cleanHeadline || cleanHeadlineTe);
  }

  // Word count estimate reading time
  const words = ((articleData.body || '') + ' ' + (articleData.bodyTe || '')).split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const newArticle: Article = {
    ...articleData,
    id,
    headline: cleanHeadline,
    headlineTe: cleanHeadlineTe,
    summary: cleanSummary,
    summaryTe: cleanSummaryTe,
    slug: cleanSlug,
    publishedAt: articleData.status === 'published' ? now : (now),
    updatedAt: now,
    readingTimeMinutes: readingTime,
  };

  db.articles.unshift(newArticle);

  // Add audit log
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userRole: 'editor',
    action: 'create',
    targetType: 'article',
    targetId: id,
    targetTitle: newArticle.headline,
    timestamp: now,
    details: `Article created with status: ${newArticle.status}`,
  });

  persistDB();
  return newArticle;
}

export function updateArticle(
  id: string, 
  updates: Partial<Article>, 
  user: { id: string; name: string },
  changeNote?: string
): Article | null {
  const db = getDB();
  const index = db.articles.findIndex(a => a.id === id);
  if (index === -1) return null;

  const current = db.articles[index];
  const now = new Date().toISOString();

  // Save current version as a revision
  const versionNum = (db.revisions.filter(r => r.articleId === id).length) + 1;
  const revision: ArticleRevision = {
    id: `rev-${id}-${versionNum}-${Date.now()}`,
    articleId: id,
    version: versionNum,
    headline: current.headline,
    summary: current.summary,
    body: current.body,
    editorId: user.id,
    editorName: user.name,
    createdAt: now,
    changeNote: changeNote || 'Article updated',
  };
  db.revisions.unshift(revision);

  // Apply updates
  let cleanSlug = updates.slug !== undefined
    ? updates.slug.replace(/[\u200B-\u200D\uFEFF]/g, '').trim()
    : current.slug;
  if (!cleanSlug) {
    cleanSlug = generateSafeSlug(updates.headline || current.headline || updates.headlineTe || current.headlineTe || '');
  }

  const updated: Article = {
    ...current,
    ...updates,
    slug: cleanSlug,
    id: current.id,
    updatedAt: now,
  };

  db.articles[index] = updated;

  // Add audit log
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userRole: 'editor',
    action: 'update',
    targetType: 'article',
    targetId: id,
    targetTitle: updated.headline,
    timestamp: now,
    details: changeNote || `Updated article (Version ${versionNum})`,
  });

  persistDB();
  return updated;
}

export function deleteArticle(id: string, user: { id: string; name: string }): boolean {
  const db = getDB();
  const index = db.articles.findIndex(a => a.id === id);
  if (index === -1) return false;

  const deleted = db.articles.splice(index, 1)[0];

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userRole: 'super_admin',
    action: 'delete',
    targetType: 'article',
    targetId: id,
    targetTitle: deleted.headline,
    timestamp: new Date().toISOString(),
  });

  persistDB();
  return true;
}

export function getArticleRevisions(articleId: string): ArticleRevision[] {
  const db = getDB();
  return db.revisions.filter(r => r.articleId === articleId).sort((a, b) => b.version - a.version);
}

export function restoreRevision(articleId: string, revisionId: string, user: { id: string; name: string }): Article | null {
  const db = getDB();
  const revision = db.revisions.find(r => r.id === revisionId && r.articleId === articleId);
  if (!revision) return null;

  return updateArticle(
    articleId, 
    {
      headline: revision.headline,
      summary: revision.summary,
      body: revision.body,
    }, 
    user, 
    `Restored to Version ${revision.version}`
  );
}

/* ==========================================================================
   Categories
   ========================================================================== */

export function getCategories(): Category[] {
  const db = getDB();
  return [...db.categories].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const db = getDB();
  return db.categories.find(c => c.slug === slug);
}

export function saveCategory(category: Category, user: { id: string; name: string }): Category {
  const db = getDB();
  const index = db.categories.findIndex(c => c.id === category.id);
  if (index >= 0) {
    db.categories[index] = category;
  } else {
    db.categories.push(category);
  }

  persistDB();
  return category;
}

/* ==========================================================================
   Tags and Canonical Aliases
   ========================================================================== */

export function getTags(): Tag[] {
  const db = getDB();
  return db.tags;
}

export function resolveCanonicalTag(inputTag: string): string {
  const db = getDB();
  const clean = inputTag.toLowerCase().trim();

  // Check direct slug match
  const direct = db.tags.find(t => t.slug === clean);
  if (direct) return direct.slug;

  // Check alias mappings (e.g. 'vizag' -> 'visakhapatnam')
  for (const tag of db.tags) {
    if (tag.aliases && tag.aliases.map(a => a.toLowerCase()).includes(clean)) {
      return tag.slug;
    }
  }

  return clean;
}

export function saveTag(tag: Tag, user: { id: string; name: string }): Tag {
  const db = getDB();
  const index = db.tags.findIndex(t => t.id === tag.id);
  if (index >= 0) {
    db.tags[index] = tag;
  } else {
    db.tags.push(tag);
  }

  persistDB();
  return tag;
}

/* ==========================================================================
   Authors
   ========================================================================== */

export function getAuthors(): Author[] {
  const db = getDB();
  return db.authors;
}

export function getAuthorById(id: string): Author | undefined {
  const db = getDB();
  return db.authors.find(a => a.id === id);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  const db = getDB();
  return db.authors.find(a => a.slug === slug);
}

/* ==========================================================================
   Editorial Settings
   ========================================================================== */

export function getSettings(): EditorialSettings {
  const db = getDB();
  return db.settings;
}

export function updateSettings(updates: Partial<EditorialSettings>, user: { id: string; name: string }): EditorialSettings {
  const db = getDB();
  db.settings = { ...db.settings, ...updates };
  persistDB();
  return db.settings;
}

/* ==========================================================================
   Advertisements
   ========================================================================== */

export function getAdPlacements(): AdPlacement[] {
  const db = getDB();
  return db.adPlacements;
}

export function getActiveAd(slotKey: 'leaderboard' | 'sidebar' | 'mid_content' | 'footer'): AdPlacement | undefined {
  const db = getDB();
  const today = new Date().toISOString().split('T')[0];
  return db.adPlacements.find(
    ad => ad.slotKey === slotKey && ad.isActive && ad.startDate <= today && ad.endDate >= today
  );
}

export function saveAdPlacement(ad: AdPlacement): AdPlacement {
  const db = getDB();
  const index = db.adPlacements.findIndex(a => a.id === ad.id);
  if (index >= 0) {
    db.adPlacements[index] = ad;
  } else {
    db.adPlacements.push(ad);
  }
  persistDB();
  return ad;
}

/* ==========================================================================
   Newsletter Subscribers
   ========================================================================== */

export function getSubscribers(): NewsletterSubscriber[] {
  const db = getDB();
  return db.subscribers || [];
}

export function addSubscriber(
  email: string, 
  language: Language = 'en', 
  editions: ('morning_briefing' | 'ap_telangana' | 'sunday_special')[] = ['morning_briefing']
): { success: boolean; message: string } {
  const db = getDB();
  if (!db.subscribers) db.subscribers = [];

  const existing = db.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    existing.isActive = true;
    existing.editions = editions;
    existing.language = language;
    persistDB();
    return { success: true, message: 'Subscription preferences updated!' };
  }

  db.subscribers.push({
    id: `sub-${Date.now()}`,
    email: email.trim().toLowerCase(),
    language,
    editions,
    subscribedAt: new Date().toISOString(),
    isActive: true,
  });

  persistDB();
  return { success: true, message: 'Thank you for subscribing to Sunrise News!' };
}

/* ==========================================================================
   Audit Logs
   ========================================================================== */

export function getAuditLogs(): AuditLog[] {
  const db = getDB();
  return db.auditLogs || [];
}
