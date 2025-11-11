/**
 * HTML Sanitization Utilities
 *
 * Production-ready HTML sanitization for email content using DOMPurify.
 * Prevents XSS attacks while preserving safe HTML formatting.
 *
 * Security Features:
 * - Strips all JavaScript (onclick, onerror, etc.)
 * - Whitelists safe HTML tags and attributes
 * - Preserves email formatting (inline styles, tables, images)
 * - Adds security attributes to links (rel="noopener noreferrer")
 *
 * Based on 2025 security best practices:
 * - DOMPurify for sanitization
 * - Strict whitelist approach
 * - Email-specific HTML support
 */

import DOMPurify from 'dompurify';

/**
 * DOMPurify configuration for email HTML content
 *
 * Whitelists safe tags and attributes commonly used in email HTML
 * while blocking all JavaScript and dangerous attributes.
 */
const EMAIL_SANITIZE_CONFIG: DOMPurify.Config = {
  // Allowed HTML tags - comprehensive list for email formatting
  ALLOWED_TAGS: [
    // Text formatting
    'p', 'div', 'span', 'br', 'hr',
    'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'sup', 'sub', 'small', 'big', 'mark',

    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',

    // Lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',

    // Links and images
    'a', 'img', 'picture', 'source',

    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'col', 'colgroup',

    // Quotes and code
    'blockquote', 'pre', 'code',

    // Other formatting
    'center', 'font', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav',

    // Email-specific tags
    'address', 'abbr', 'cite', 'del', 'ins', 'kbd', 'samp', 'var', 'time',
  ],

  // Allowed attributes - only safe ones
  ALLOWED_ATTR: [
    // Styling (required for email HTML formatting)
    'style', 'class', 'id',

    // Links
    'href', 'target', 'rel', 'name',

    // Images
    'src', 'alt', 'title', 'width', 'height', 'loading', 'srcset', 'sizes',

    // Tables
    'align', 'valign', 'colspan', 'rowspan', 'border', 'cellpadding', 'cellspacing',

    // Email-specific
    'bgcolor', 'color', 'face', 'size', 'dir', 'lang',

    // Accessibility
    'aria-label', 'role', 'tabindex',

    // Data attributes (for tracking pixels - read-only)
    'data-*',
  ],

  // URL schemes - only allow safe protocols
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,

  // Additional security settings
  KEEP_CONTENT: true, // Keep text content even if tag is removed
  RETURN_TRUSTED_TYPE: false, // Return string, not TrustedHTML
  FORCE_BODY: false, // Don't force wrapping in <body>
  WHOLE_DOCUMENT: false, // Only sanitize fragment, not full document
  RETURN_DOM: false, // Return HTML string
  RETURN_DOM_FRAGMENT: false, // Return HTML string

  // Add hooks for additional security
  ADD_ATTR: ['target'], // Always add target for links
  ADD_TAGS: [], // No custom tags
};

/**
 * Sanitize HTML content for safe rendering
 *
 * @param html - Raw HTML content from email or message
 * @returns Sanitized HTML safe for rendering with dangerouslySetInnerHTML
 *
 * @example
 * const safeHtml = sanitizeHtml('<p>Hello <script>alert("XSS")</script></p>');
 * // Returns: '<p>Hello </p>'
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  try {
    // Sanitize with DOMPurify
    const clean = DOMPurify.sanitize(html, EMAIL_SANITIZE_CONFIG);

    // Debug logging in development
    if (process.env.NODE_ENV === 'development' && html.length > 1000) {
      console.log('[HTML Sanitizer] Sanitization stats:', {
        original_length: html.length,
        sanitized_length: clean.length,
        removed_bytes: html.length - clean.length,
        preview: clean.substring(0, 200)
      });
    }

    // Post-processing: Add security attributes to links
    // This ensures all links open in new tab with security
    return addLinkSecurity(clean);
  } catch (error) {
    console.error('[HTML Sanitizer] Failed to sanitize HTML:', error);
    // Fallback: return empty string if sanitization fails
    return '';
  }
}

/**
 * Add security attributes to all links
 *
 * Ensures all <a> tags have:
 * - target="_blank" (open in new tab)
 * - rel="noopener noreferrer" (prevent window.opener access)
 *
 * @param html - Sanitized HTML
 * @returns HTML with secure link attributes
 */
function addLinkSecurity(html: string): string {
  if (!html) return '';

  // Use DOMParser to manipulate links safely
  try {
    // Create a temporary div to parse HTML
    const div = document.createElement('div');
    div.innerHTML = html;

    // Find all links
    const links = div.querySelectorAll('a');
    links.forEach(link => {
      // Only modify external links (not anchors)
      if (link.hasAttribute('href') && !link.getAttribute('href')?.startsWith('#')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    return div.innerHTML;
  } catch (error) {
    // If DOM manipulation fails, return original (already sanitized)
    console.warn('[HTML Sanitizer] Failed to add link security, returning sanitized HTML:', error);
    return html;
  }
}

/**
 * Check if content contains HTML
 *
 * @param content - Text content to check
 * @returns true if content appears to be HTML
 */
export function isHtmlContent(content: string): boolean {
  if (!content) return false;

  // Check for common HTML patterns
  return (
    content.includes('<html') ||
    content.includes('<!DOCTYPE') ||
    content.includes('<p>') ||
    content.includes('<div>') ||
    content.includes('<br>') ||
    content.includes('<br/>') ||
    content.includes('<img') ||
    content.includes('<a href') ||
    content.includes('<table') ||
    content.includes('<ul>') ||
    content.includes('<ol>') ||
    content.match(/<[a-z][\s\S]*>/i) !== null
  );
}

/**
 * Sanitize HTML and limit length (for previews)
 *
 * @param html - Raw HTML content
 * @param maxLength - Maximum text length (default: 500)
 * @returns Sanitized and truncated HTML
 */
export function sanitizeAndTruncateHtml(html: string, maxLength: number = 500): string {
  const sanitized = sanitizeHtml(html);

  // Create temporary div to extract text
  try {
    const div = document.createElement('div');
    div.innerHTML = sanitized;
    const text = div.textContent || div.innerText || '';

    if (text.length <= maxLength) {
      return sanitized;
    }

    // Truncate and add ellipsis
    const truncated = text.substring(0, maxLength) + '...';
    return `<p>${truncated}</p>`;
  } catch (error) {
    console.error('[HTML Sanitizer] Failed to truncate:', error);
    return sanitized;
  }
}

/**
 * Extract plain text from HTML
 *
 * @param html - HTML content
 * @returns Plain text without HTML tags
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';

  try {
    const div = document.createElement('div');
    div.innerHTML = sanitizeHtml(html);
    return div.textContent || div.innerText || '';
  } catch (error) {
    console.error('[HTML Sanitizer] Failed to extract text:', error);
    return '';
  }
}
