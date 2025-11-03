/**
 * Email Content Processor Hook
 *
 * Processes email HTML content before rendering in the sandboxed iframe.
 * Handles:
 * 1. CID image replacement (inline embedded images)
 * 2. External image detection and blocking
 * 3. HTML sanitization and preparation
 * 4. Base stylesheet injection
 */

import { useMemo } from 'react';
import { EmailAttachment } from '../types/email.types';
import { processCidImages, hasCidImages } from '../utils/cid-image-processor';

// Base styles for email iframe - inlined for compatibility
const baseStyles = `
* { box-sizing: border-box; }
body {
  margin: 0; padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  font-size: 14px; line-height: 1.6; color: #1f2937; background-color: #ffffff;
  word-wrap: break-word; overflow-wrap: break-word;
}
img { max-width: 100%; height: auto; display: block; margin: 8px 0; }
img[align='left'], img[align='right'] { display: inline; margin: 0 8px; }
p { margin: 0 0 12px 0; }
p:last-child { margin-bottom: 0; }
h1, h2, h3, h4, h5, h6 { margin: 16px 0 8px 0; line-height: 1.3; font-weight: 600; }
h1 { font-size: 24px; } h2 { font-size: 20px; } h3 { font-size: 18px; }
h4 { font-size: 16px; } h5 { font-size: 14px; } h6 { font-size: 12px; }
a { color: #2563eb; text-decoration: none; }
a:hover { text-decoration: underline; }
ul, ol { margin: 12px 0; padding-left: 24px; }
li { margin: 4px 0; }
table { border-collapse: collapse; width: 100%; max-width: 100%; margin: 12px 0; }
td, th { padding: 8px; border: 1px solid #e5e7eb; text-align: left; }
th { background-color: #f9fafb; font-weight: 600; }
table[border='0'], table[border='0'] td, table[border='0'] th { border: none; }
blockquote {
  margin: 12px 0; padding: 8px 0 8px 12px;
  border-left: 3px solid #9ca3af; color: #6b7280; font-size: 13px;
}
blockquote blockquote { margin-left: 8px; border-left-color: #d1d5db; }
blockquote blockquote blockquote { border-left-color: #e5e7eb; }
.gmail_quote, div[class*='gmail_quote'] {
  margin: 12px 0; padding: 8px 0 8px 12px;
  border-left: 3px solid #9ca3af; color: #6b7280;
}
div[style*='border-left'] { margin: 12px 0; padding-left: 12px; }
pre, code { font-family: 'Monaco', 'Menlo', 'Courier New', monospace; font-size: 13px; background-color: #f3f4f6; border-radius: 4px; }
pre { padding: 12px; overflow-x: auto; margin: 12px 0; }
code { padding: 2px 4px; }
pre code { padding: 0; background: transparent; }
hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
@media (max-width: 640px) {
  body { padding: 12px; font-size: 13px; }
  table { font-size: 12px; }
  td, th { padding: 6px; }
  table[width] { width: 100% !important; }
  img[align='left'], img[align='right'] { display: block; float: none !important; margin: 8px 0; }
}
[class*='mso'], [class*='MSO'] { display: none !important; }
.AppleMailSignature, .gmail_signature {
  margin-top: 16px; padding-top: 16px;
  border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 13px;
}
.text-muted { color: #6b7280; }
.text-small { font-size: 12px; }
img[src=''], img[src='about:blank'] {
  border: 1px dashed #d1d5db; padding: 8px; background-color: #f9fafb;
  display: inline-block; font-size: 12px; color: #6b7280;
}
a:focus, button:focus { outline: 2px solid #2563eb; outline-offset: 2px; }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
}
`;

export interface ProcessedEmailContent {
  /** Final HTML ready for iframe srcDoc */
  html: string;
  /** Number of CID images replaced */
  cidImagesReplaced: number;
  /** Whether HTML contains external images */
  hasExternalImages: boolean;
  /** List of external image URLs found */
  externalImageUrls: string[];
  /** CIDs that were referenced but had no matching attachment */
  missingCids: string[];
}

interface UseEmailContentProcessorOptions {
  /** Raw HTML content from email */
  htmlContent: string;
  /** Email attachments (for CID processing) */
  attachments?: EmailAttachment[];
  /** Whether to allow external images (default: false for privacy) */
  allowExternalImages?: boolean;
  /** Additional CSS to inject into the iframe */
  customStyles?: string;
}

/**
 * Detect all external image URLs in HTML
 * External images are: <img src="http://..." /> or <img src="https://..." />
 * NOT CID images: <img src="cid:..." />
 */
function detectExternalImages(html: string): string[] {
  const imgPattern = /<img[^>]+src=["'](https?:\/\/[^"']+)["']/gi;
  const urls: string[] = [];
  let match;

  while ((match = imgPattern.exec(html)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * Block external images by removing src attributes
 * Preserves alt text for accessibility
 */
function blockExternalImages(html: string): string {
  return html.replace(
    /<img([^>]+)src=["'](https?:\/\/[^"']+)["']/gi,
    (match, beforeSrc) => {
      // Keep other attributes (alt, width, height, etc.) but remove src
      // Replace with empty src to trigger broken image styling
      return `<img${beforeSrc}src="" data-external-src="$2"`;
    }
  );
}

/**
 * Restore external images (when user clicks "Display images")
 */
function restoreExternalImages(html: string): string {
  return html.replace(/data-external-src=["']([^"']+)["']/gi, (match, url) => {
    return `src="${url}"`;
  });
}

/**
 * Wrap HTML content in a complete HTML document with base styles
 */
function wrapInDocument(content: string, customStyles?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${baseStyles}
    ${customStyles || ''}
  </style>
  <script>
    // Auto-resize iframe to fit content
    // Uses ResizeObserver for dynamic content changes
    (function() {
      function sendHeight() {
        const height = document.documentElement.scrollHeight;
        window.parent.postMessage({ type: 'email-iframe-resize', height }, '*');
      }

      // Initial height
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sendHeight);
      } else {
        sendHeight();
      }

      // Watch for dynamic changes
      const observer = new ResizeObserver(() => {
        sendHeight();
      });

      observer.observe(document.body);

      // Also watch for image loads
      window.addEventListener('load', sendHeight);
    })();
  </script>
</head>
<body>
  ${content}
</body>
</html>`;
}

/**
 * Process email HTML content for safe iframe rendering
 */
export function useEmailContentProcessor(
  options: UseEmailContentProcessorOptions
): ProcessedEmailContent {
  const { htmlContent, attachments = [], allowExternalImages = false, customStyles } = options;

  const processed = useMemo(() => {
    if (!htmlContent) {
      return {
        html: '',
        cidImagesReplaced: 0,
        hasExternalImages: false,
        externalImageUrls: [],
        missingCids: []
      };
    }

    let processedHtml = htmlContent;
    let cidImagesReplaced = 0;
    let missingCids: string[] = [];

    // Step 1: Process CID images (inline embedded images)
    if (hasCidImages(htmlContent) && attachments.length > 0) {
      const cidResult = processCidImages(htmlContent, attachments);
      processedHtml = cidResult.processedHtml;
      cidImagesReplaced = cidResult.replacedCount;
      missingCids = cidResult.missingCids;
    }

    // Step 2: Detect external images
    const externalImageUrls = detectExternalImages(processedHtml);
    const hasExternalImages = externalImageUrls.length > 0;

    // Step 3: Block external images unless allowed
    if (hasExternalImages && !allowExternalImages) {
      processedHtml = blockExternalImages(processedHtml);
    } else if (hasExternalImages && allowExternalImages) {
      // Restore any previously blocked images
      processedHtml = restoreExternalImages(processedHtml);
    }

    // Step 4: Wrap in complete HTML document with styles and resize script
    const finalHtml = wrapInDocument(processedHtml, customStyles);

    return {
      html: finalHtml,
      cidImagesReplaced,
      hasExternalImages,
      externalImageUrls,
      missingCids
    };
  }, [htmlContent, attachments, allowExternalImages, customStyles]);

  return processed;
}

/**
 * Helper hook for just checking if email has external images
 * Useful for showing "Display images" prompt without full processing
 */
export function useHasExternalImages(htmlContent: string): boolean {
  return useMemo(() => {
    if (!htmlContent) return false;
    return detectExternalImages(htmlContent).length > 0;
  }, [htmlContent]);
}
