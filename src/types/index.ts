export type Language = 'en' | 'te';

export type ArticleStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export type UserRole = 'super_admin' | 'editor' | 'reporter' | 'contributor';

export interface Author {
  id: string;
  name: string;
  nameTe?: string;
  slug: string;
  avatar: string;
  avatarFit?: 'cover' | 'contain';
  role: string;
  roleTe?: string;
  bioEn: string;
  bioTe: string;
  reportingBeats: string[];
  email: string;
  twitter?: string;
  linkedin?: string;
  verified: boolean;
}

export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameTe: string;
  descriptionEn: string;
  descriptionTe: string;
  parentId?: string;
  displayOrder: number;
  featured?: boolean;
}

export interface Tag {
  id: string;
  slug: string;
  nameEn: string;
  nameTe: string;
  canonicalSlug?: string; // For resolving aliases (e.g., vizag -> visakhapatnam)
  aliases: string[];
  articleCount?: number;
}

export interface FactCheckData {
  claim: string;
  claimTe: string;
  claimedBy: string;
  originUrl?: string;
  verdict: 'True' | 'Mostly True' | 'False' | 'Misleading' | 'Unproven';
  verdictTe: 'నిజం' | 'ఎక్కువగా నిజం' | 'అబద్ధం' | 'తప్పుదోవ పట్టించేది' | 'రుజువు కాలేదు';
  evidenceSummary: string;
  evidenceSummaryTe: string;
  reviewDate: string;
}

export interface CorrectionNotice {
  id: string;
  date: string;
  originalText: string;
  correctedText: string;
  reason: string;
  editorName: string;
}

export interface ArticleRevision {
  id: string;
  articleId: string;
  version: number;
  headline: string;
  summary: string;
  body: string;
  headlineTe?: string;
  summaryTe?: string;
  bodyTe?: string;
  editorId: string;
  editorName: string;
  createdAt: string;
  changeNote?: string;
}

export interface Article {
  id: string;
  slug: string;
  headline: string;
  headlineTe?: string;
  summary: string;
  summaryTe?: string;
  body: string; // Markdown or rich formatted text
  bodyTe?: string;
  categoryId: string;
  subcategoryId?: string;
  tags: string[]; // Tag slugs
  authorId: string;
  reviewerId?: string;
  location: string;
  locationTe?: string;
  language: Language;
  status: ArticleStatus;
  featuredImage: string;
  imageCaption: string;
  imageCredit: string;
  publishedAt: string;
  updatedAt: string;
  isBreaking?: boolean;
  isLeadStory?: boolean;
  isEditorPick?: boolean;
  isTrending?: boolean;
  viewsCount?: number;
  readingTimeMinutes: number;
  factCheck?: FactCheckData;
  corrections?: CorrectionNotice[];
  internalNotes?: string; // Private newsroom notes
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  format?: 'article' | 'video' | 'photo' | 'infographic' | 'fact-check' | 'investigation' | 'opinion' | 'live';
  mediaUrl?: string; // Embedded video or podcast URL
  galleryImages?: { url: string; caption: string; credit: string }[];
  attachedDocument?: { name: string; url: string; size: string; type: 'pdf' | 'docx' | 'doc' | 'other' };
}

export interface AdPlacement {
  id: string;
  slotKey: 'leaderboard' | 'sidebar' | 'mid_content' | 'footer';
  title: string;
  imageUrl: string;
  targetUrl: string;
  advertiser: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface EpaperEdition {
  id: string;
  title: string;
  date: string;
  edition: string;
  status: 'draft' | 'published' | 'archived';
  file: { name: string; url: string; size: number; contentType: 'application/pdf' | 'image/jpeg' };
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  language: Language;
  editions: ('morning_briefing' | 'ap_telangana' | 'sunday_special')[];
  subscribedAt: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'create' | 'update' | 'publish' | 'archive' | 'revert' | 'delete' | 'login';
  targetType: 'article' | 'category' | 'tag' | 'ad' | 'settings' | 'epaper';
  targetId: string;
  targetTitle: string;
  timestamp: string;
  details?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface EditorialSettings {
  siteNameEn: string;
  siteNameTe: string;
  taglineEn: string;
  taglineTe: string;
  breakingNewsEnabled: boolean;
  breakingNewsTextEn: string;
  breakingNewsTextTe: string;
  breakingNewsUrl: string;
  contactEmail: string;
  contactPhone: string;
  addressHyderabad: string;
  addressAmaravati: string;
  addressVisakhapatnam: string;
  addressDelhi: string;
  grievanceOfficerName: string;
  grievanceOfficerEmail: string;
}
