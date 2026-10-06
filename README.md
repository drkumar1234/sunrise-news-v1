# SUNRISE NEWS — Advanced Digital Newsroom Publishing Platform

> **"Your World. Your News. Every Day."**  
> **"మీ ప్రపంచం. మీ వార్తలు. అనునిత్యం."**

**SUNRISE NEWS** is a complete, production-grade digital news publishing platform built for an Indian audience, with dedicated editorial architecture for Andhra Pradesh, Telangana, regional journalism, Telugu-language readers, and English-language readers.

---

## 🌟 Key Platform Features

### 1. Brand Identity & Visual Aesthetics
- **Original Vector Brand Logo**: Features an iconic rising sun motif over horizon lines with bilingual English ("SUNRISE NEWS") and Telugu ("సన్‌రైజ్ న్యూస్") treatments.
- **Harmonious Color Palette**:
  - **Navy Primary**: `#0B192C` (Deep, authoritative navy)
  - **Sunrise Orange**: `#FF6B35` (Energizing morning accent)
  - **Morning Gold**: `#FFB703` (Warm glow highlights)
  - **Breaking Red**: `#DC2626` (Urgent news pulse)
  - **Clean Surfaces**: `#FFFFFF` and `#F8FAFC`
- **Bilingual Web Typography**: Seamless rendering with `Inter` (English) and `Noto Sans Telugu` (Telugu).

### 2. Full Public Website Architecture (33 Pages)
- **Core Pages**: Homepage (`/[lang]`), Latest News (`/[lang]/latest`), Trending Stories (`/[lang]/trending`), Top Stories (`/[lang]/top-stories`), Breaking News Feed (`/[lang]/breaking`), Rich Article (`/[lang]/article/[slug]`), Category Archives (`/[lang]/category/[slug]`), Multilingual Search (`/[lang]/search`), About Us (`/[lang]/about`), Contact Us (`/[lang]/contact`).
- **Editorial Credibility Pages**: Editorial & Opinion (`/[lang]/editorial-opinion`), Special Reports (`/[lang]/special-reports`), Investigations (`/[lang]/investigations`), Explainers (`/[lang]/explainers`), Fact-Check Registry (`/[lang]/fact-checks`), Corrections & Updates Log (`/[lang]/corrections`), Authors Directory (`/[lang]/authors`), Editorial Standards Charter (`/[lang]/editorial-standards`), Corrections Policy (`/[lang]/corrections-policy`), Ethics & Financial Transparency (`/[lang]/ethics-transparency`).
- **Multimedia Pages**: Video News Hub (`/[lang]/videos`), Photo Stories Gallery (`/[lang]/photos`), Infographics & Data Charts (`/[lang]/infographics`), Podcasts & Audio (`/[lang]/podcasts`), Live Blog Updates (`/[lang]/live`).
- **Audience & Regulatory**: Newsletter Signup (`/[lang]/newsletter`), Privacy Policy compliant with Indian DPDP Act 2023 (`/[lang]/privacy`), Terms of Service (`/[lang]/terms`), Cookie Policy (`/[lang]/cookie-policy`), Media Kit & Advertising (`/[lang]/advertise`), Accessibility Statement (`/[lang]/accessibility`), HTML Sitemap (`/[lang]/sitemap`), Custom 404 Page.

### 3. Advanced Newsroom CMS (`/admin`)
- **Role-Based Access Control (RBAC)**:
  - **Super Administrator**: Complete system configuration, advertising campaigns, category management, and audit logs.
  - **Senior Editor**: Story approval queue, corrections management, revision restores, and publishing.
  - **Field Reporter**: Draft creation, personal beat submissions, and fact-check submissions.
- **Bilingual Rich Article Editor**:
  - Bilingual headline, summary, and formatted markdown bodies.
  - Automatic SEO URL slug generator with manual override.
  - Canonical Tag autocomplete with duplicate prevention (e.g. mapping `vizag` -> `visakhapatnam`).
  - Private internal newsroom notes (never leaked to public APIs).
  - Version Control / Revision History drawer with 1-click restore.
  - Fact-check verdict evaluation generator.
- **Breaking News Ticker Manager**: Toggle live ticker on/off and update alerts in real-time.
- **Ad Campaigns Manager**: Control leaderboard (728x90), sidebar (300x250), and mid-content native ads.
- **Newsletter Subscribers**: Filter list with 1-click CSV export.
- **Editorial Audit Trail**: Immutable timeline of who modified, approved, or published any content.

### 4. SEO & Google News Readiness
- Schema.org JSON-LD `NewsArticle`, `BreadcrumbList`, and `Organization` structured data on every story.
- Dynamic XML Sitemap: `/sitemap.xml`.
- Official Google News XML Sitemap: `/news-sitemap.xml` with `<news:news>` and `<news:publication>` tags.
- Search Engine Crawler Directives: `/robots.txt`.

---

## 🚀 Quick Start & Local Development

### Prerequisites
Node.js v18+ or v20+ LTS is pre-configured in the environment.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Access the Newsroom CMS
Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

**Demo Credentials**:
- **Super Administrator**: Click "Super Administrator" or login with passcode `newsroom2026`.
- **Senior Editor**: Click "Senior Editor".
- **Field Reporter**: Click "Field Reporter".

---

## 🗄️ Database Architecture & Deployment

### 1. Local Zero-Setup Transactional Store
By default, Sunrise News operates on an atomic, file-backed transactional repository located at:
```
data/sunrise_news.json
```
This requires zero external database configuration to run immediately, allowing full offline development, testing, and demonstration.

### 2. Production PostgreSQL Migration
For enterprise newsroom cloud deployments (Vercel, AWS RDS, Supabase, Neon, Railway), use the production SQL schema provided in:
```
database/schema.sql
```
This script creates all tables, foreign keys, full-text indexes, and audit logs.

---

## 🔒 Compliance & Standards
- **Indian IT Rules, 2021 (Rule 11)**: Grievance Redressal Officer published on every page footer.
- **Digital Personal Data Protection Act, 2023 (DPDP)**: Explicit consent collection for newsletters with 1-click withdrawal.
- **WCAG 2.1 AA Accessibility**: High-contrast ratios, keyboard focus rings, font resizer (A- / A+), screen reader ARIA landmarks, and reduced motion support.
- **Press Council of India Guidelines**: Non-stealth corrections policy and mandatory commercial separation.
