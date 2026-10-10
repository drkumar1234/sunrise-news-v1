import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { generateSafeSlug } from '@/lib/db';
import { requireAdmin, apiError } from '@/lib/auth';
import { MAX_UPLOAD_BYTES, saveMedia, validateUpload } from '@/lib/media-store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_UPLOAD_BYTES + 65536) return NextResponse.json({ error: 'Maximum upload size is 4 MB.' }, { status: 413 });
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: 'Maximum upload size is 4 MB.' }, { status: 413 });
    const buffer = Buffer.from(await file.arrayBuffer());
    try { validateUpload(file.name, buffer); } catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
    const originalName = file.name;
    const extension = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, extension);

    const saved = await saveMedia(originalName, buffer);
    const publicUrl = saved.url;
    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;

    let extractedText = '';
    let extractionWarning: string | undefined;

    // 1. Process MS Word Document (.docx)
    if (extension === '.docx') {
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } catch (docErr) {
        console.error('Error parsing docx:', docErr);
        extractionWarning = 'The file was saved, but its text could not be extracted. Enter article text manually.';
      }
    } 
    // 2. Process PDF Document (.pdf)
    else if (extension === '.pdf') {
      try {
        // Keep PDF.js and its native canvas module out of ordinary request startup.
        const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({ data: buffer });
        try { const pdfData = await parser.getText(); extractedText = pdfData.text || ''; }
        finally { await parser.destroy(); }
      } catch (pdfErr) {
        console.error('Error parsing PDF:', pdfErr);
        extractionWarning = 'The file was saved, but its text could not be extracted. Enter article text manually.';
      }
    } 
    // 3. Process Plain Text / Markdown (.txt, .rtf, .md)
    else if (extension === '.txt' || extension === '.md' || extension === '.rtf') {
      extractedText = buffer.toString('utf-8');
    }
    // 4. Photos / Images (.jpg, .png, etc.)
    else if (['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) {
      return NextResponse.json({
        success: true,
        isImage: true,
        imageUrl: publicUrl,
        file: {
          name: originalName,
          url: publicUrl,
          size: sizeStr,
          type: 'image',
        },
      });
    }


    // Clean and split lines: remove zero-width chars and trailing/leading spaces
    const cleanExtractedText = extractedText.replace(/[\u200B-\u200D\uFEFF]/g, '');
    const rawLines = cleanExtractedText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0 && !/^[\s\u200B-\u200D\uFEFF]+$/.test(l));

    // Extract Title, Summary, and Body
    let title = '';
    let summary = '';
    let body = '';
    let detectedLocation = '';

    if (rawLines.length > 0) {
      // Check if line 0 is a dateline (e.g. "ఏ ఎస్ ఆర్ జిల్లా పాడేరు /​అరకు వ్యాలీ, అక్టోబర్ :05," or "AMARAVATI, Oct 5 -")
      const datelinePattern = /(అక్టోబర్|నవంబర్|డిసెంబర్|జనవరి|ఫిబ్రవరి|మార్చి|ఏప్రిల్|మే|జూన్|జూలై|ఆగస్టు|సెప్టెంబర్|జిల్లా|October|November|December|January|February|March|April|May|June|July|August|September|\d{1,2}[:\-]\d{1,2})/i;
      
      let headlineIndex = 0;
      if (rawLines.length > 1 && datelinePattern.test(rawLines[0]) && rawLines[0].length < 100 && rawLines[1].length > 10) {
        // Line 0 is dateline, Line 1 is the main headline!
        detectedLocation = rawLines[0];
        headlineIndex = 1;
      }

      title = rawLines[headlineIndex].replace(/^[#*-]\s*/, '').slice(0, 200).trim();

      // Remaining lines form summary and body
      const contentLines = rawLines.filter((_, idx) => idx !== headlineIndex);
      
      if (contentLines.length > 0) {
        summary = contentLines[0].replace(/^[#*-]\s*/, '').slice(0, 300).trim();
        body = contentLines.slice(1).join('\n\n').trim();
        if (!body) {
          body = summary;
        }
      } else {
        summary = title;
        body = title;
      }
    } else {
      title = baseName.replace(/[-_]/g, ' ');
      summary = `Report uploaded from ${originalName}`;
      body = summary;
    }

    // Detect if content is primarily Telugu (Telugu Unicode Range \u0C00-\u0C7F)
    const teluguRegex = /[\u0C00-\u0C7F]/;
    const isTelugu = teluguRegex.test(title) || teluguRegex.test(cleanExtractedText.slice(0, 500));
    const suggestedSlug = generateSafeSlug(title || baseName);

    return NextResponse.json({
      success: true,
      title,
      summary,
      body,
      isTelugu,
      suggestedSlug,
      detectedLocation,
      rawText: cleanExtractedText,
      warning: extractionWarning,
      file: {
        name: originalName,
        url: publicUrl,
        size: sizeStr,
        type: extension === '.pdf' ? 'pdf' : extension === '.docx' || extension === '.doc' ? 'docx' : 'other',
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
