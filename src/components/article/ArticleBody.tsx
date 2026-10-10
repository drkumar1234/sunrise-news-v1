'use client';

import React from 'react';
import { Quote, Info, FileText, Download } from 'lucide-react';
import { Article, Language } from '@/types';
import { formatInline, safeUrl, safeEmbedUrl } from '@/lib/content-safety';

interface ArticleBodyProps {
  article: Article;
  lang: Language;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl';
}

export const ArticleBody: React.FC<ArticleBodyProps> = ({
  article,
  lang,
  fontSize = 'base',
}) => {
  const isTelugu = lang === 'te';
  const bodyText = isTelugu && article.bodyTe ? article.bodyTe : article.body;
  const mediaUrl = safeEmbedUrl(article.mediaUrl);
  const documentUrl = safeUrl(article.attachedDocument?.url, '');

  // Font size classes
  const fontSizes = {
    sm: 'text-sm md:text-base leading-relaxed',
    base: 'text-base md:text-lg leading-relaxed',
    lg: 'text-lg md:text-xl leading-loose',
    xl: 'text-xl md:text-2xl leading-loose',
  }[fontSize];

  // Render markdown-like sections (##, ###, bullets)
  const renderFormattedParagraphs = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentBulletList: string[] = [];

    const flushBulletList = (key: number) => {
      if (currentBulletList.length > 0) {
        elements.push(
          <ul key={`ul-${key}`} className="my-4 space-y-2 list-disc list-inside text-slate-800">
            {currentBulletList.map((item, i) => (
              <li key={i} className="pl-1">
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ul>
        );
        currentBulletList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushBulletList(index);
        return;
      }

      // H2 Header
      if (trimmed.startsWith('## ')) {
        flushBulletList(index);
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-2xl md:text-3xl font-bold text-slate-900 mt-8 mb-4 pt-4 border-t border-slate-100"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      // H3 Header
      else if (trimmed.startsWith('### ')) {
        flushBulletList(index);
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl md:text-2xl font-bold text-slate-900 mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      // Bullet Item
      else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        currentBulletList.push(trimmed.slice(2));
      }
      // Numbered item
      else if (/^\d+\.\s/.test(trimmed)) {
        flushBulletList(index);
        const itemText = trimmed.replace(/^\d+\.\s/, '');
        elements.push(
          <div key={`num-${index}`} className="my-2 flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center mt-1">
              {trimmed.match(/^\d+/)?.[0]}
            </span>
            <p
              className="text-slate-800 flex-1"
              dangerouslySetInnerHTML={{ __html: formatInline(itemText) }}
            />
          </div>
        );
      }
      // Blockquote
      else if (trimmed.startsWith('> ') || trimmed.startsWith('"')) {
        flushBulletList(index);
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className="my-6 pl-4 border-l-4 border-brand-orange italic bg-amber-50/40 p-4 rounded-r-lg text-slate-800 font-serif"
          >
            <Quote className="w-5 h-5 text-brand-orange mb-1" />
            <p className="text-lg md:text-xl font-medium">
              {trimmed.replace(/^>\s*/, '').replace(/^"|"$/g, '')}
            </p>
          </blockquote>
        );
      }
      // Standard Paragraph
      else {
        flushBulletList(index);
        elements.push(
          <p
            key={`p-${index}`}
            className={`my-4 text-slate-800 ${fontSizes}`}
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />
        );
      }
    });

    flushBulletList(lines.length);
    return elements;
  };

  return (
    <div className="article-body max-w-3xl">
      {/* Featured Video Embed if format is video */}
      {article.format === 'video' && mediaUrl && (
        <div className="my-6 aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
          <iframe
            src={mediaUrl}
            title={article.headline}
            className="w-full h-full"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}

      {/* Main Text Content */}
      <div className="prose prose-slate max-w-none">
        {renderFormattedParagraphs(bodyText)}
      </div>

      {/* Photo Gallery if format is photo */}
      {article.galleryImages && article.galleryImages.length > 0 && (
        <div className="my-8 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 border-b pb-2">
            {isTelugu ? 'చిత్ర మాలిక (Photo Gallery)' : 'Photo Gallery'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.galleryImages.map((img, idx) => (
              <figure key={idx} className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                <img src={safeUrl(img.url, '/brand/sunrise-news-logo.jpg')} alt={img.caption} className="w-full aspect-[4/3] object-cover" />
                <figcaption className="p-3 text-xs text-slate-600">
                  <p className="font-medium text-slate-900">{img.caption}</p>
                  <p className="text-slate-400 mt-0.5">Photo: {img.credit}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* Official Attached Document (MS Word / PDF / Press Release) */}
      {article.attachedDocument && documentUrl && (
        <div className="my-8 p-5 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#990000] text-white flex items-center justify-center font-black text-xs uppercase flex-shrink-0 shadow">
                {article.attachedDocument.type === 'pdf' ? 'PDF' : 'DOC'}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-800 block">
                  {isTelugu ? 'అధికారిక పత్రం / ప్రెస్ నోట్ జతచేయబడింది' : 'Official Press Release / Attached Document'}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  {article.attachedDocument.name}
                </h4>
                <span className="text-xs text-slate-500">
                  {article.attachedDocument.size} • {isTelugu ? 'ధ్రువీకరించబడిన పత్రం' : 'Verified Digital Attachment'}
                </span>
              </div>
            </div>

            <a
              href={documentUrl}
              download={article.attachedDocument.name}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#990000] hover:bg-[#800000] text-white rounded-xl text-xs font-bold transition-all shadow flex items-center justify-center gap-2 flex-shrink-0 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isTelugu ? 'పత్రం డౌన్‌లోడ్' : 'Download Document'}</span>
            </a>
          </div>
        </div>
      )}

      {/* Reporting Methodology & Trust Transparency Box */}
      <div className="my-8 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800 block mb-0.5">
            {isTelugu ? 'రిపోర్టింగ్ పద్ధతి & విశ్వసనీయత:' : 'Reporting Methodology & Standards:'}
          </span>
          <p>
            {isTelugu
              ? 'ఈ కథనం సన్‌రైజ్ న్యూస్ ఎడిటోరియల్ చార్టర్ ప్రకారం ప్రత్యక్ష సమాచారం, అధికారిక పత్రాలు మరియు స్వతంత్ర ధ్రువీకరణలతో ప్రచురించబడింది. మా నిబంధనల ప్రకారం ఎటువంటి ప్రకటనల ప్రయోజనాలు కథనాన్ని ప్రభావితం చేయవు.'
              : 'This report was prepared in accordance with the Sunrise News Editorial Code. Information has been verified through primary official records, expert consultations, and field checks. Advertisers have no influence over our journalism.'}
          </p>
        </div>
      </div>
    </div>
  );
};
