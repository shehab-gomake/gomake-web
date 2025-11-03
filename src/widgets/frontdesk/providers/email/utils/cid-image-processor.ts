/**
 * CID Image Processor
 *
 * Handles conversion of Content-ID (CID) referenced images in email HTML
 * to base64 data URLs for inline display in sandboxed iframes.
 *
 * Email clients often embed images using the CID protocol:
 * <img src="cid:unique-image-id@domain.com">
 *
 * This processor:
 * 1. Finds all CID references in HTML
 * 2. Matches them to email attachments by Content-ID
 * 3. Converts attachment data to base64 data URLs
 * 4. Replaces CID URLs with data URLs
 */

import { EmailAttachment } from '../types/email.types';

export interface CidImageInfo {
  cid: string;
  dataUrl: string;
}

/**
 * Extract the Content-ID from a CID URL
 * Examples:
 *   "cid:image001@example.com" -> "image001@example.com"
 *   "cid:ABC123" -> "ABC123"
 */
function extractCidFromUrl(cidUrl: string): string {
  return cidUrl.replace(/^cid:/i, '').trim();
}

/**
 * Normalize Content-ID for matching
 * Removes angle brackets that some email clients add
 */
function normalizeCid(cid: string): string {
  return cid.replace(/^<|>$/g, '').trim();
}

/**
 * Convert attachment data to base64 data URL
 */
function attachmentToDataUrl(attachment: EmailAttachment): string | null {
  // Check if we have attachment data
  const data = attachment.data || attachment.content;
  if (!data) {
    console.warn(`[CID Processor] No data found for attachment: ${attachment.filename}`);
    return null;
  }

  // Determine MIME type
  const mimeType = attachment.mimeType || attachment.contentType || 'application/octet-stream';

  // Check if data is already base64 (shouldn't have data URL prefix)
  const base64Data = data.includes('base64,') ? data.split('base64,')[1] : data;

  return `data:${mimeType};base64,${base64Data}`;
}

/**
 * Build a map of Content-ID to data URL from attachments
 */
function buildCidMap(attachments: EmailAttachment[]): Map<string, string> {
  const cidMap = new Map<string, string>();

  for (const attachment of attachments) {
    // Skip attachments without Content-ID (regular downloads)
    if (!attachment.id) continue;

    const dataUrl = attachmentToDataUrl(attachment);
    if (!dataUrl) continue;

    // Normalize the CID for matching
    const normalizedCid = normalizeCid(attachment.id);
    cidMap.set(normalizedCid, dataUrl);

    // Also store with angle brackets for compatibility
    cidMap.set(`<${normalizedCid}>`, dataUrl);
  }

  return cidMap;
}

/**
 * Find all CID references in HTML
 * Looks for: src="cid:..." in img tags
 */
function findCidReferences(html: string): string[] {
  const cidPattern = /src=["']cid:([^"']+)["']/gi;
  const matches: string[] = [];
  let match;

  while ((match = cidPattern.exec(html)) !== null) {
    matches.push(match[1]); // Extract just the CID part (without 'cid:')
  }

  return matches;
}

/**
 * Replace all CID references in HTML with data URLs
 */
export function processCidImages(
  html: string,
  attachments: EmailAttachment[]
): { processedHtml: string; replacedCount: number; missingCids: string[] } {
  if (!html || !attachments || attachments.length === 0) {
    return { processedHtml: html, replacedCount: 0, missingCids: [] };
  }

  // Build CID to data URL map
  const cidMap = buildCidMap(attachments);

  if (cidMap.size === 0) {
    return { processedHtml: html, replacedCount: 0, missingCids: [] };
  }

  // Find all CID references
  const cidReferences = findCidReferences(html);
  const missingCids: string[] = [];
  let replacedCount = 0;

  // Replace each CID reference
  let processedHtml = html;
  const cidPattern = /src=["']cid:([^"']+)["']/gi;

  processedHtml = processedHtml.replace(cidPattern, (match, cid) => {
    const normalizedCid = normalizeCid(cid);

    // Try to find the data URL in our map
    let dataUrl = cidMap.get(normalizedCid);

    // Try with angle brackets if not found
    if (!dataUrl) {
      dataUrl = cidMap.get(`<${normalizedCid}>`);
    }

    if (dataUrl) {
      replacedCount++;
      return `src="${dataUrl}"`;
    } else {
      // CID reference found but no matching attachment
      missingCids.push(cid);
      console.warn(`[CID Processor] Missing attachment for CID: ${cid}`);
      return match; // Keep original
    }
  });

  if (replacedCount > 0) {
    console.log(`[CID Processor] Replaced ${replacedCount} inline images`);
  }

  if (missingCids.length > 0) {
    console.warn(`[CID Processor] Missing ${missingCids.length} CID attachments:`, missingCids);
  }

  return { processedHtml, replacedCount, missingCids };
}

/**
 * Check if HTML contains any CID references
 */
export function hasCidImages(html: string): boolean {
  if (!html) return false;
  return /src=["']cid:/i.test(html);
}

/**
 * Extract information about all CID images in the HTML
 * Useful for debugging and UI display
 */
export function extractCidImageInfo(html: string, attachments: EmailAttachment[]): CidImageInfo[] {
  const cidMap = buildCidMap(attachments);
  const cidReferences = findCidReferences(html);

  return cidReferences.map(cid => {
    const normalizedCid = normalizeCid(cid);
    const dataUrl = cidMap.get(normalizedCid) || cidMap.get(`<${normalizedCid}>`) || '';

    return {
      cid: normalizedCid,
      dataUrl
    };
  });
}
