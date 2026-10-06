'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Save, Eye, ArrowLeft, History as HistoryIcon, Check, 
  Sparkles, ShieldCheck, Image as ImageIcon, RotateCcw,
  FileText, Upload, Download, Trash2, Camera, Paperclip,
  CheckCircle2, AlertCircle, FileCheck
} from 'lucide-react';
import { Category, Tag, Author, ArticleStatus, Language, ArticleRevision } from '@/types';
import { getCategories, getTags, getAuthors } from '@/lib/db';

import { Suspense } from 'react';

function ArticleEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [categories, setCategories] = useState<Category[]>([]);
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [revisions, setRevisions] = useState<ArticleRevision[]>([]);
  const [revisionsOpen, setRevisionsOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Document Upload & Attachment State
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [attachedDocument, setAttachedDocument] = useState<{
    name: string;
    url: string;
    size: string;
    type: 'pdf' | 'docx' | 'doc' | 'other';
  } | null>(null);
  const [docUploadSuccess, setDocUploadSuccess] = useState<string | null>(null);

  // Photo Upload State
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Form State
  const [headline, setHeadline] = useState('');
  const [headlineTe, setHeadlineTe] = useState('');
  const [slug, setSlug] = useState('');
  const [manualSlug, setManualSlug] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryTe, setSummaryTe] = useState('');
  const [body, setBody] = useState('');
  const [bodyTe, setBodyTe] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [location, setLocation] = useState('Amaravati');
  const [locationTe, setLocationTe] = useState('అమరావతి');
  const [language, setLanguage] = useState<Language>('en');
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [featuredImage, setFeaturedImage] = useState('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('Sunrise News');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isLeadStory, setIsLeadStory] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Fact check toggle
  const [isFactCheck, setIsFactCheck] = useState(false);
  const [claim, setClaim] = useState('');
  const [claimTe, setClaimTe] = useState('');
  const [claimedBy, setClaimedBy] = useState('');
  const [verdict, setVerdict] = useState<'True' | 'Mostly True' | 'False' | 'Misleading' | 'Unproven'>('False');
  const [evidenceSummary, setEvidenceSummary] = useState('');

  // Auto-slug generator supporting English and Telugu Unicode
  const generateSlug = (text: string) => {
    if (!text) return `story-${Date.now().toString(36)}`;
    const clean = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    if (!clean) return `story-${Date.now().toString(36)}`;

    // Try English words first
    const english = clean
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (english.length >= 3) {
      return english.slice(0, 80);
    }

    // Preserve Telugu (\u0C00-\u0C7F) and English characters
    const unicodeSlug = clean
      .replace(/[^a-zA-Z0-9\u0C00-\u0C7F\s_-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);

    if (unicodeSlug.length > 0) {
      return unicodeSlug;
    }

    return `story-${Date.now().toString(36)}`;
  };

  const handleHeadlineChange = (val: string) => {
    setHeadline(val);
    if (!manualSlug && !editId) {
      setSlug(generateSlug(val || headlineTe));
    }
  };

  const handleHeadlineTeChange = (val: string) => {
    setHeadlineTe(val);
    if (!manualSlug && !editId && !headline) {
      setSlug(generateSlug(val));
    }
  };

  // Load existing article if editing
  useEffect(() => {
    setCategories(getCategories());
    setTagsList(getTags());
    setAuthors(getAuthors());

    if (editId) {
      fetch(`/api/articles/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.article) {
            const a = data.article;
            setHeadline(a.headline || '');
            setHeadlineTe(a.headlineTe || '');
            setSlug(a.slug || '');
            setManualSlug(true);
            setSummary(a.summary || '');
            setSummaryTe(a.summaryTe || '');
            setBody(a.body || '');
            setBodyTe(a.bodyTe || '');
            setCategoryId(a.categoryId || '');
            setSubcategoryId(a.subcategoryId || '');
            setSelectedTags(a.tags || []);
            setAuthorId(a.authorId || '');
            setLocation(a.location || 'Amaravati');
            setLocationTe(a.locationTe || 'అమరావతి');
            setLanguage(a.language || 'en');
            setStatus(a.status || 'draft');
            setFeaturedImage(a.featuredImage || '');
            setImageCaption(a.imageCaption || '');
            setImageCredit(a.imageCredit || 'Sunrise News');
            setIsBreaking(!!a.isBreaking);
            setIsLeadStory(!!a.isLeadStory);
            setInternalNotes(a.internalNotes || '');
            setSeoTitle(a.seoTitle || '');
            setSeoDescription(a.seoDescription || '');

            if (a.attachedDocument) {
              setAttachedDocument(a.attachedDocument);
            }

            if (a.factCheck) {
              setIsFactCheck(true);
              setClaim(a.factCheck.claim || '');
              setClaimTe(a.factCheck.claimTe || '');
              setClaimedBy(a.factCheck.claimedBy || '');
              setVerdict(a.factCheck.verdict || 'False');
              setEvidenceSummary(a.factCheck.evidenceSummary || '');
            }

            // Load revisions
            if (data.revisions) {
              setRevisions(data.revisions);
            }
          }
        })
        .catch(console.error);
    }
  }, [editId]);

  // Document upload handler (.docx, .doc, .pdf, .txt, .md)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    setDocUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-doc', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to parse file');

      // Populate form fields based on detected language
      if (data.isTelugu) {
        if (data.title) setHeadlineTe(data.title);
        if (data.summary) setSummaryTe(data.summary);
        if (data.body) setBodyTe(data.body);
        setLanguage('te');
        if (!headline) setHeadline(data.title);
        if (!summary) setSummary(data.summary);
        if (!body) setBody(data.body);
        if (!slug || !manualSlug) {
          setSlug(data.suggestedSlug || generateSlug(data.title));
        }
      } else {
        if (data.title) {
          setHeadline(data.title);
          if (!manualSlug) setSlug(data.suggestedSlug || generateSlug(data.title));
        }
        if (data.summary) setSummary(data.summary);
        if (!body) setBody(data.body);
      }

      if (data.detectedLocation) {
        setLocationTe(data.detectedLocation);
      }

      if (data.file) {
        setAttachedDocument(data.file);
      }

      setDocUploadSuccess(`Successfully extracted text from "${file.name}"! Form fields and document attachment are ready.`);
    } catch (err: any) {
      alert(`Document upload error: ${err.message}`);
    } finally {
      setUploadingDoc(false);
    }
  };

  // Device Photo upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload-doc', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        setFeaturedImage(data.imageUrl);
        setToastMessage('Photo uploaded and set as featured image!');
        setTimeout(() => setToastMessage(''), 2500);
      }
    } catch (err) {
      alert('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Visual formatting toolbar insertion
  const insertFormat = (tag: 'h2' | 'h3' | 'bold' | 'italic' | 'quote' | 'bullet' | 'telugu-date', isTe: boolean = false) => {
    const targetSetter = isTe ? setBodyTe : setBody;
    const currentVal = isTe ? bodyTe : body;

    let snippet = '';
    if (tag === 'h2') snippet = '\n\n## Subheading Title\n';
    if (tag === 'h3') snippet = '\n\n### Section Details\n';
    if (tag === 'bold') snippet = ' **Important Note** ';
    if (tag === 'italic') snippet = ' *key insight* ';
    if (tag === 'quote') snippet = '\n\n> "Official quotation or public statement."\n';
    if (tag === 'bullet') snippet = '\n* Key fact 1\n* Key fact 2\n* Key fact 3\n';
    if (tag === 'telugu-date') {
      const today = new Date().toLocaleDateString('te-IN', { dateStyle: 'full' });
      snippet = `\n**అమరావతి (${today}):** `;
    }

    targetSetter(currentVal + snippet);
  };

  // Tag helper with canonical alias mapping
  const addTag = (rawTag: string) => {
    const clean = rawTag.toLowerCase().trim();
    if (!clean) return;

    const matchedTag = tagsList.find(t => 
      t.slug === clean || t.aliases.includes(clean)
    );

    const canonical = matchedTag ? (matchedTag.canonicalSlug || matchedTag.slug) : clean;

    if (!selectedTags.includes(canonical)) {
      setSelectedTags([...selectedTags, canonical]);
    }
    setNewTagInput('');
  };

  const removeTag = (tagSlug: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagSlug));
  };

  const handleSubmit = async (e?: React.FormEvent, forceStatus?: ArticleStatus) => {
    if (e) e.preventDefault();
    setSaving(true);

    const activeStatus = forceStatus || status;

    const cleanHeadline = headline.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const cleanHeadlineTe = headlineTe.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const finalHeadline = cleanHeadline || cleanHeadlineTe || 'Breaking News Story';
    const finalHeadlineTe = cleanHeadlineTe || cleanHeadline || 'తాజా వార్త';

    const cleanSummary = summary.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const cleanSummaryTe = summaryTe.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const finalSummary = cleanSummary || cleanSummaryTe || finalHeadline;
    const finalSummaryTe = cleanSummaryTe || cleanSummary || finalHeadlineTe;

    const cleanBody = body.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const cleanBodyTe = bodyTe.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const finalBody = cleanBody || cleanBodyTe || finalSummary;
    const finalBodyTe = cleanBodyTe || cleanBody || finalSummaryTe;

    const rawSlug = (slug || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const finalSlug = rawSlug || generateSlug(finalHeadline || finalHeadlineTe);

    const payload = {
      headline: finalHeadline,
      headlineTe: finalHeadlineTe,
      slug: finalSlug,
      summary: finalSummary,
      summaryTe: finalSummaryTe,
      body: finalBody,
      bodyTe: finalBodyTe,
      categoryId: categoryId || categories[0]?.id || 'cat-ap',
      subcategoryId: subcategoryId || undefined,
      tags: selectedTags,
      authorId: authorId || authors[0]?.id || 'auth-1',
      location: location || 'Amaravati',
      locationTe: locationTe || 'అమరావతి',
      language,
      status: activeStatus,
      featuredImage,
      imageCaption,
      imageCredit,
      isBreaking,
      isLeadStory,
      internalNotes,
      seoTitle: seoTitle || finalHeadline,
      seoDescription: seoDescription || finalSummary,
      attachedDocument: attachedDocument || undefined,
      format: isFactCheck ? 'fact-check' : 'article',
      factCheck: isFactCheck ? {
        claim,
        claimTe,
        claimedBy,
        verdict,
        verdictTe: verdict === 'False' ? 'అబద్ధం' : 'నిజం',
        evidenceSummary,
        evidenceSummaryTe: evidenceSummary,
        reviewDate: new Date().toISOString().split('T')[0],
      } : undefined,
    };

    try {
      const url = editId ? `/api/articles/${editId}` : '/api/articles';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const responseData = await res.json();
        const savedArt = responseData.article;
        const targetSlug = savedArt?.slug || finalSlug;
        const targetLang = savedArt?.language || language || 'te';

        setToastMessage(
          activeStatus === 'published' 
            ? '🎉 Article published live on website! Redirecting to live story...' 
            : 'Article successfully saved as draft!'
        );
        setTimeout(() => {
          if (activeStatus === 'published') {
            router.push(`/${targetLang}/article/${encodeURIComponent(targetSlug)}`);
          } else {
            router.push('/admin/articles');
          }
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to save article: ${errData.error || 'Server error'}`);
      }
    } catch (err: any) {
      console.error(err);
      setToastMessage('Error saving article. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  // Restore revision handler
  const handleRestoreRevision = (rev: ArticleRevision) => {
    if (!confirm(`Restore content from Version ${rev.version}? Current unsaved text will be replaced.`)) return;
    setHeadline(rev.headline);
    setSummary(rev.summary);
    setBody(rev.body);
    setRevisionsOpen(false);
    setToastMessage(`Restored to Version ${rev.version}`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>{editId ? 'Edit News Article' : 'Code-Free News Studio'}</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold uppercase">
                Writing & Uploads
              </span>
            </h1>
            <span className="text-xs text-slate-500">
              Bilingual Telugu & English Newsroom • MS Word & PDF Integration
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {editId && (
            <button
              type="button"
              onClick={() => setRevisionsOpen(!revisionsOpen)}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
            >
              <HistoryIcon className="w-3.5 h-3.5 text-brand-orange" />
              <span>History ({revisions.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Exit Preview' : 'Live Preview'}</span>
          </button>

          {/* 1-Click Save Draft */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={saving}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors shadow flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* 1-Click Publish Live */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={saving}
            className="px-5 py-1.5 bg-[#990000] hover:bg-[#800000] text-white rounded-lg text-xs font-bold transition-colors shadow flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>{saving ? 'Publishing...' : 'Publish Live Now'}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Left 8 Cols (Content & Document Uploader) + Right 4 Cols (Settings) */}
      <form onSubmit={(e) => handleSubmit(e)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: EDITORIAL CONTENT & DOCUMENT IMPORTER */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. CODE-FREE MS WORD & PDF UPLOADER BOX */}
          <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-dashed border-red-300 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#990000] text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>Upload Everyday Document (MS Word / PDF)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-700 text-white font-bold uppercase">
                      Code-Free
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select any .docx, .doc, .pdf or text press release. The system automatically extracts headlines, paragraphs & Telugu text.
                  </p>
                </div>
              </div>

              {/* Upload Action Button */}
              <label className="cursor-pointer px-5 py-2.5 bg-[#990000] hover:bg-[#800000] text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 flex-shrink-0 active:scale-95">
                <Upload className="w-4 h-4" />
                <span>{uploadingDoc ? 'Extracting Text...' : 'Choose Word / PDF File'}</span>
                <input
                  type="file"
                  accept=".docx,.doc,.pdf,.txt,.rtf,.md"
                  disabled={uploadingDoc}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Extracted success notification */}
            {docUploadSuccess && (
              <div className="p-3 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>{docUploadSuccess}</span>
              </div>
            )}

            {/* Attached document badge */}
            {attachedDocument && (
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-black rounded uppercase">
                    {attachedDocument.type.toUpperCase()}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {attachedDocument.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {attachedDocument.size} • Attached for public reader download
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={attachedDocument.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Preview</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setAttachedDocument(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Remove attachment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. HEADLINES (Bilingual) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                English Headline: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => handleHeadlineChange(e.target.value)}
                placeholder="Clear, authoritative headline in English..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Telugu Headline (తెలుగు శీర్షిక):
              </label>
              <input
                type="text"
                value={headlineTe}
                onChange={(e) => setHeadlineTe(e.target.value)}
                placeholder="ప్రామాణిక పత్రికా భాషలో తెలుగు శీర్షిక..."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-base font-bold text-slate-900 font-telugu bg-white"
              />
            </div>

            {/* Permanent Slug Field */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 flex items-center justify-between">
                <span>Canonical URL Slug:</span>
                <button
                  type="button"
                  onClick={() => setManualSlug(!manualSlug)}
                  className="text-brand-orange hover:underline text-[10px]"
                >
                  {manualSlug ? 'Auto-generate from title' : 'Customize manually'}
                </button>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-xs font-mono text-slate-500">
                  /{language}/article/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setManualSlug(true);
                  }}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-r-lg text-xs font-mono text-slate-700 bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. SUMMARIES / LEAD PARAGRAPHS */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                English Summary / Standfirst: <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="1-2 sentences summarizing the essential news angle..."
                className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Telugu Summary (తెలుగు సారాంశం):
              </label>
              <textarea
                rows={3}
                value={summaryTe}
                onChange={(e) => setSummaryTe(e.target.value)}
                placeholder="కథనం ప్రధాన సారాంశం తెలుగులో..."
                className="w-full p-3 border border-slate-300 rounded-lg text-sm font-telugu bg-white"
              />
            </div>
          </div>

          {/* 4. ARTICLE BODY (Visual Toolbar + Rich Text) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Article Body (Rich Formatting): <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Use toolbar below to format without writing any code
              </span>
            </div>

            {/* Code-Free Visual Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100/80 border border-slate-200 rounded-lg text-xs">
              <span className="text-[11px] font-bold text-slate-500 px-1">Quick Tools:</span>
              <button
                type="button"
                onClick={() => insertFormat('h2')}
                className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded border border-slate-200 text-xs"
                title="Heading 2 (విభాగం)"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertFormat('h3')}
                className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded border border-slate-200 text-xs"
                title="Heading 3 (ఉప శీర్షిక)"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertFormat('bold')}
                className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 font-black rounded border border-slate-200 text-xs"
                title="Bold (బోల్డ్)"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertFormat('italic')}
                className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-800 italic font-serif rounded border border-slate-200 text-xs"
                title="Italic (ఇటాలిక్)"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertFormat('quote')}
                className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded border border-slate-200 text-xs"
                title="Quote Box (ప్రముఖుల వ్యాఖ్య)"
              >
                &ldquo; Quote &rdquo;
              </button>
              <button
                type="button"
                onClick={() => insertFormat('bullet')}
                className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-800 rounded border border-slate-200 text-xs"
                title="Bullet Points (ముఖ్యాంశాలు)"
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => insertFormat('telugu-date', true)}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded border border-amber-300 text-xs ml-auto"
                title="Insert Telugu Dateline (అమరావతి)"
              >
                📅 అమరావతి డేట్‌లైన్
              </button>
            </div>

            {previewMode ? (
              <div className="prose prose-slate max-w-none p-4 bg-slate-50 rounded-lg border border-slate-200 min-h-[300px]">
                <div dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, '<br/>') }} />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">English Body:</span>
                  <textarea
                    rows={12}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write or paste your comprehensive news article content..."
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm font-sans bg-white leading-relaxed"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">Telugu Body (తెలుగు పాఠం):</span>
                  <textarea
                    rows={8}
                    value={bodyTe}
                    onChange={(e) => setBodyTe(e.target.value)}
                    placeholder="తెలుగు పాఠం ఇక్కడ రాయండి..."
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm font-telugu bg-white leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. FACT-CHECK SECTION (Optional) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFactCheck}
                  onChange={(e) => setIsFactCheck(e.target.checked)}
                  className="h-4 w-4 text-brand-orange rounded"
                />
                <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-orange" />
                  <span>Mark as Official Fact-Check Story</span>
                </span>
              </label>
            </div>

            {isFactCheck && (
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Claim Under Review:</label>
                  <input
                    type="text"
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    placeholder="Viral claim being verified..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Claimed By:</label>
                    <input
                      type="text"
                      value={claimedBy}
                      onChange={(e) => setClaimedBy(e.target.value)}
                      placeholder="e.g. Social media forwards"
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Verdict:</label>
                    <select
                      value={verdict}
                      onChange={(e: any) => setVerdict(e.target.value)}
                      className="w-full p-2 border rounded-lg bg-white"
                    >
                      <option value="False">False (అబద్ధం)</option>
                      <option value="Misleading">Misleading (తప్పుదోవ)</option>
                      <option value="True">True (నిజం)</option>
                      <option value="Mostly True">Mostly True (ఎక్కువగా నిజం)</option>
                      <option value="Unproven">Unproven (రుజువు కాలేదు)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Evidence Summary:</label>
                  <textarea
                    rows={3}
                    value={evidenceSummary}
                    onChange={(e) => setEvidenceSummary(e.target.value)}
                    placeholder="Summary of primary sources and verification evidence..."
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PUBLISHING & TAXONOMY SETTINGS */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication Workflow Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">
              Publishing Workflow
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Workflow Stage:</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs font-bold bg-white"
              >
                <option value="draft">Draft (Private to Reporter)</option>
                <option value="review">Submitted for Review</option>
                <option value="approved">Approved by Senior Editor</option>
                <option value="published">Published (Live on Website)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-red-600"
                />
                <span className="font-semibold text-slate-800">Breaking News Flash (Ticker)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isLeadStory}
                  onChange={(e) => setIsLeadStory(e.target.checked)}
                  className="rounded text-brand-orange"
                />
                <span className="font-semibold text-slate-800">Homepage Hero Lead Story</span>
              </label>
            </div>
          </div>

          {/* Taxonomy & Tags */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">
              Category & Tags
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Primary Category:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn} ({c.nameTe})
                  </option>
                ))}
              </select>
            </div>

            {/* Canonical Tags Manager */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tags (e.g. amaravati, vizag):
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTagInput))}
                  placeholder="e.g. vizag, polavaram..."
                  className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => addTag(newTagInput)}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedTags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 bg-slate-100 text-slate-800 rounded-md text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Author & Location */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">
              Attribution & Location
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Author:</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs bg-white"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Location (En):</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Location (Te):</label>
                <input
                  type="text"
                  value={locationTe}
                  onChange={(e) => setLocationTe(e.target.value)}
                  className="w-full p-2 border rounded-lg text-xs font-telugu"
                />
              </div>
            </div>
          </div>

          {/* Featured Image with Local Device Upload Support */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Article Photo
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                Upload Supported
              </span>
            </div>

            {/* Direct Device Upload Button */}
            <div>
              <label className="cursor-pointer w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Camera className="w-4 h-4 text-brand-orange" />
                <span>{uploadingPhoto ? 'Uploading Photo...' : '📷 Upload Photo from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingPhoto}
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-400 mt-1 block text-center">
                JPG, PNG, WebP supported
              </span>
            </div>

            {featuredImage && (
              <div className="aspect-video rounded-lg overflow-hidden border bg-slate-100 my-2">
                <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Photo Caption:</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Descriptive caption..."
                className="w-full p-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Photo Credit:</label>
              <input
                type="text"
                value={imageCredit}
                onChange={(e) => setImageCredit(e.target.value)}
                placeholder="Photographer or agency..."
                className="w-full p-2 border rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Private Internal Notes (Hidden from Public) */}
          <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 space-y-2">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Private Newsroom Notes (Internal Only)
            </h3>
            <p className="text-[11px] text-amber-800">
              Never exposed to the public API or readers. Used for source contacts, editor notes, and follow-ups.
            </p>
            <textarea
              rows={3}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="e.g. Verified with Government spokesperson..."
              className="w-full p-2 border border-amber-300 rounded-lg text-xs bg-white"
            />
          </div>
        </div>
      </form>

      {/* Revision History Modal Drawer */}
      {revisionsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-brand-orange" />
                <span>Article Revisions</span>
              </h3>
              <button
                type="button"
                onClick={() => setRevisionsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {revisions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No previous revisions recorded yet. Revisions are created upon each update.
              </p>
            ) : (
              <div className="space-y-4">
                {revisions.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-navy">Version {rev.version}</span>
                      <span className="text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-semibold text-slate-900 truncate">{rev.headline}</p>
                    <p className="text-slate-500 text-[11px]">{rev.changeNote}</p>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRestoreRevision(rev)}
                        className="px-3 py-1 bg-brand-navy hover:bg-brand-navy-light text-white rounded text-xs font-bold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore this version</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArticleEditorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading Article Editor...</div>}>
      <ArticleEditorContent />
    </Suspense>
  );
}
