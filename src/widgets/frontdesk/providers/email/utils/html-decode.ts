/**
 * Decodes HTML entities in a string
 * @param text The text containing HTML entities
 * @returns The decoded text
 */
export function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Safely decodes HTML entities, returning original text if decoding fails
 * @param text The text that might contain HTML entities
 * @returns The decoded text or original text if decoding fails
 */
export function safeDecodeHtml(text?: string): string {
  if (!text) return '';

  try {
    return decodeHtmlEntities(text);
  } catch (error) {
    console.warn('Failed to decode HTML entities:', error);
    return text;
  }
}