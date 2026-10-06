-- ==============================================================================
-- SUNRISE NEWS — Production PostgreSQL Database Schema & Migration Script
-- Compatible with PostgreSQL 14, 15, 16+ (Supabase, AWS RDS, Neon, Railway)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Authors & Journalists Table
CREATE TABLE IF NOT EXISTS authors (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'auth_' || uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_te VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(1024),
    role VARCHAR(255) NOT NULL,
    role_te VARCHAR(255),
    bio_en TEXT,
    bio_te TEXT,
    reporting_beats TEXT[],
    email VARCHAR(255) UNIQUE,
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Hierarchy Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'cat_' || uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name_en VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_te TEXT,
    parent_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    display_order INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- 3. Canonical Tags and Alias Mapping
CREATE TABLE IF NOT EXISTS tags (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'tag_' || uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name_en VARCHAR(255) NOT NULL,
    name_te VARCHAR(255) NOT NULL,
    canonical_slug VARCHAR(255),
    aliases TEXT[] DEFAULT '{}',
    article_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- 4. Articles Core Table
CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'art_' || uuid_generate_v4(),
    slug VARCHAR(500) NOT NULL UNIQUE,
    headline VARCHAR(500) NOT NULL,
    headline_te VARCHAR(500),
    summary TEXT NOT NULL,
    summary_te TEXT,
    body TEXT NOT NULL,
    body_te TEXT,
    category_id VARCHAR(64) NOT NULL REFERENCES categories(id),
    subcategory_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    author_id VARCHAR(64) NOT NULL REFERENCES authors(id),
    reviewer_id VARCHAR(64),
    location VARCHAR(255) NOT NULL,
    location_te VARCHAR(255),
    language VARCHAR(8) NOT NULL DEFAULT 'en',
    status VARCHAR(32) NOT NULL DEFAULT 'draft', -- draft, review, approved, published, archived
    featured_image VARCHAR(1024) NOT NULL,
    image_caption TEXT,
    image_credit VARCHAR(255),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_breaking BOOLEAN DEFAULT FALSE,
    is_lead_story BOOLEAN DEFAULT FALSE,
    is_editor_pick BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    reading_time_minutes INT DEFAULT 3,
    format VARCHAR(32) DEFAULT 'article',
    media_url VARCHAR(1024),
    internal_notes TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    canonical_url VARCHAR(1024)
);

CREATE INDEX IF NOT EXISTS idx_articles_status_pub ON articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- 5. Article Revisions (Version Control for Editorial Audits)
CREATE TABLE IF NOT EXISTS article_revisions (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'rev_' || uuid_generate_v4(),
    article_id VARCHAR(64) NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    headline VARCHAR(500) NOT NULL,
    summary TEXT,
    body TEXT NOT NULL,
    editor_id VARCHAR(64) NOT NULL,
    editor_name VARCHAR(255) NOT NULL,
    change_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_revisions_article ON article_revisions(article_id, version_number DESC);

-- 6. Fact Check Data Records
CREATE TABLE IF NOT EXISTS fact_checks (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'fc_' || uuid_generate_v4(),
    article_id VARCHAR(64) NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    claim TEXT NOT NULL,
    claim_te TEXT,
    claimed_by VARCHAR(255) NOT NULL,
    verdict VARCHAR(64) NOT NULL, -- True, Mostly True, False, Misleading, Unproven
    verdict_te VARCHAR(64),
    evidence_summary TEXT NOT NULL,
    evidence_summary_te TEXT,
    review_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Corrections & Transparency Table
CREATE TABLE IF NOT EXISTS article_corrections (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'corr_' || uuid_generate_v4(),
    article_id VARCHAR(64) NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    reason TEXT NOT NULL,
    editor_name VARCHAR(255) NOT NULL,
    correction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Advertising Campaigns Table
CREATE TABLE IF NOT EXISTS ad_placements (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'ad_' || uuid_generate_v4(),
    slot_key VARCHAR(64) NOT NULL, -- leaderboard, sidebar, mid_content, footer
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(1024) NOT NULL,
    target_url VARCHAR(1024) NOT NULL,
    advertiser VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'sub_' || uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    language VARCHAR(8) DEFAULT 'en',
    editions TEXT[] DEFAULT '{"morning_briefing"}',
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Administrative Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'log_' || uuid_generate_v4(),
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    target_type VARCHAR(64) NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    target_title VARCHAR(500),
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
