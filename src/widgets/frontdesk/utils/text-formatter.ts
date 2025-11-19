/**
 * Text Formatting Utilities
 *
 * Converts plain text to formatted HTML for better message display.
 * All HTML content is sanitized using DOMPurify to prevent XSS attacks.
 */

import { sanitizeHtml, isHtmlContent as detectHtml } from './html-sanitizer';

/**
 * Convert plain text URLs to clickable links
 */
export function linkifyText(text: string): string {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s)]+)/g;

  return text.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

/**
 * Convert line breaks to <br> tags
 */
export function nl2br(text: string): string {
  return text.replace(/\n/g, '<br>');
}

/**
 * Format plain text for HTML display
 * - Converts URLs to links
 * - Converts line breaks to <br>
 * - Escapes HTML entities for safety
 */
export function formatPlainTextToHtml(text: string): string {
  if (!text) return '';

  // First escape any existing HTML to prevent XSS
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Convert line breaks to <br>
  formatted = nl2br(formatted);

  // Convert URLs to clickable links
  formatted = linkifyText(formatted);

  return formatted;
}

/**
 * Detect if text is HTML or plain text
 * Re-exported from html-sanitizer for backwards compatibility
 */
export function isHtmlContent(text: string): boolean {
  return detectHtml(text);
}

/**
 * Smart content formatter with security
 * - If content is HTML, sanitize it with DOMPurify
 * - If content is plain text, convert to formatted HTML
 *
 * SECURITY: All HTML content is sanitized to prevent XSS attacks
 *
 * @param content - Message content (plain text or HTML)
 * @param html - Optional explicit HTML content
 * @returns Safe HTML ready for rendering
 */
export function smartFormatContent(content: string, html?: string): string {
  // If we have explicit HTML, sanitize and use it
  if (html) {
    return sanitizeHtml(html);
  }

  // If content looks like HTML, sanitize it
  if (isHtmlContent(content)) {
    return sanitizeHtml(content);
  }

  // Otherwise, format plain text to HTML (already safe, no HTML tags)
  return formatPlainTextToHtml(content);
}
