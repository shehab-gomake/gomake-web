/**
 * Text Formatting Utilities
 *
 * Converts plain text to formatted HTML for better message display
 */

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
 */
export function isHtmlContent(text: string): boolean {
  if (!text) return false;

  // Check for common HTML patterns
  return (
    text.includes('<html') ||
    text.includes('<!DOCTYPE') ||
    text.includes('<p>') ||
    text.includes('<div>') ||
    text.includes('<br>') ||
    text.includes('<img') ||
    text.includes('<a href') ||
    text.includes('<table') ||
    text.includes('<ul>') ||
    text.includes('<ol>') ||
    text.match(/<[a-z][\s\S]*>/i) !== null
  );
}

/**
 * Smart content formatter
 * - If content is HTML, return as-is
 * - If content is plain text, convert to formatted HTML
 */
export function smartFormatContent(content: string, html?: string): string {
  // If we have explicit HTML, use it
  if (html) {
    return html;
  }

  // If content looks like HTML, use it
  if (isHtmlContent(content)) {
    return content;
  }

  // Otherwise, format plain text to HTML
  return formatPlainTextToHtml(content);
}
