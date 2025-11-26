/**
 * Chatwoot Attachment Types
 *
 * Comprehensive type definitions for attachment handling in messages and composers.
 * Covers all Chatwoot-supported attachment types and file operations.
 */

/**
 * Supported file types in Chatwoot
 * @see https://developers.chatwoot.com/self-hosted/supported-features#outgoing-attachments-supported-file-types
 */
export type AttachmentFileType =
  | "image"
  | "audio"
  | "video"
  | "file"
  | "location"
  | "contact"
  | "fallback";

/**
 * Chatwoot Attachment from API response
 * Represents a file attachment on a message
 */
export interface ChatwootAttachment {
  /** Unique attachment ID */
  id: number;
  /** Parent message ID */
  message_id: number;
  /** File type category */
  file_type: AttachmentFileType;
  /** Account ID */
  account_id: number;
  /** File extension (e.g., "pdf", "png") */
  extension?: string | null;
  /** Full URL to access the file */
  data_url: string;
  /** Thumbnail URL for images/videos */
  thumb_url?: string;
  /** File size in bytes */
  file_size?: number;
  /** Image/video width in pixels */
  width?: number;
  /** Image/video height in pixels */
  height?: number;
}

/**
 * File type categories for icon mapping
 */
export type FileCategory =
  | "pdf"
  | "word"
  | "excel"
  | "archive"
  | "audio"
  | "video"
  | "image"
  | "location"
  | "contact"
  | "unknown";

/**
 * Map of file extensions to categories
 * Based on official Chatwoot supported file types:
 * @see https://developers.chatwoot.com/self-hosted/supported-features#outgoing-attachments-supported-file-types
 *
 * Standard File Types:
 * - Video: ogg, mp4, mov, webm, quicktime, avi
 * - Audio: mp3, mpeg, opus, ogg, amr, aac, m4a, wav
 * - Image: png, jpeg, gif, bmp, webp
 * - Document: pdf, doc, docx, xls, xlsx, ppt, pptx, zip, 7z, rar, tar, xml, csv, json, rtf, txt
 */
export const FILE_EXTENSION_MAP: Record<string, FileCategory> = {
  // PDF
  pdf: "pdf",
  // Word documents (official: doc, docx, msword)
  doc: "word",
  docx: "word",
  rtf: "word",
  txt: "word",
  // Excel/Spreadsheets (official: xls, xlsx, csv)
  xls: "excel",
  xlsx: "excel",
  csv: "excel",
  // PowerPoint (official: ppt, pptx)
  ppt: "word",
  pptx: "word",
  // Archives (official: zip, 7z, rar, tar)
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  tar: "archive",
  gz: "archive",
  // Audio (official: mp3, mpeg, opus, ogg, amr, aac, m4a, wav)
  mp3: "audio",
  mpeg: "audio",
  opus: "audio",
  ogg: "audio",
  amr: "audio",
  aac: "audio",
  m4a: "audio",
  wav: "audio",
  flac: "audio",
  // Video (official: ogg, mp4, mov, webm, quicktime, avi)
  mp4: "video",
  mov: "video",
  webm: "video",
  avi: "video",
  mkv: "video",
  // Images (official: png, jpeg, gif, bmp, webp)
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  bmp: "image",
  webp: "image",
  svg: "image", // Not in official list but commonly used
  // Data formats (official: xml, json)
  xml: "word",
  json: "word",
  // Markdown files
  md: "word",
  markdown: "word",
  // Contact
  vcf: "contact",
};

/**
 * Media modal state for image/video preview
 */
export interface MediaModalState {
  url: string;
  type: "image" | "video";
}

/**
 * Maximum file upload size in MB
 */
export const MAX_FILE_SIZE_MB = 40;

/**
 * Maximum file upload size in bytes
 */
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Supported image MIME types
 * Official: png, jpeg, gif, bmp, webp
 * @see https://developers.chatwoot.com/self-hosted/supported-features#outgoing-attachments-supported-file-types
 */
export const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/svg+xml", // Not official but commonly used
] as const;

/**
 * Supported video MIME types
 * Official: ogg, mp4, mov, webm, quicktime, avi
 * @see https://developers.chatwoot.com/self-hosted/supported-features#outgoing-attachments-supported-file-types
 */
export const VIDEO_MIME_TYPES = [
  "video/ogg",
  "video/mp4",
  "video/quicktime", // mov
  "video/webm",
  "video/x-msvideo", // avi
  "video/x-matroska", // mkv (not official but common)
] as const;

/**
 * Supported audio MIME types
 * Official: mp3, mpeg, opus, ogg, amr, aac, m4a, wav
 * @see https://developers.chatwoot.com/self-hosted/supported-features#outgoing-attachments-supported-file-types
 */
export const AUDIO_MIME_TYPES = [
  "audio/mpeg", // mp3
  "audio/opus",
  "audio/ogg",
  "audio/amr",
  "audio/aac",
  "audio/mp4", // m4a
  "audio/x-m4a", // m4a alternative
  "audio/wav",
  "audio/x-wav",
  "audio/flac", // Not official but common
] as const;

/**
 * Supported document MIME types
 * Official: pdf, doc, docx, xls, xlsx, ppt, pptx, zip, 7z, rar, tar, xml, csv, json, rtf, txt
 * @see https://developers.chatwoot.com/self-hosted/supported-features#outgoing-attachments-supported-file-types
 */
export const DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword", // doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.ms-excel", // xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-powerpoint", // ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "application/zip",
  "application/x-7z-compressed", // 7z
  "application/vnd.rar", // rar
  "application/x-tar", // tar
  "application/xml",
  "text/xml",
  "text/csv",
  "application/json",
  "application/rtf",
  "text/plain", // txt
] as const;

/**
 * Attachment conversion source types
 */
export interface AttachmentSource {
  /** Base64 encoded content */
  content?: string;
  /** Alias for content */
  data?: string;
  /** URL to fetch the file from */
  url?: string;
  /** File name */
  filename: string;
  /** MIME type */
  mimeType?: string;
  /** Alternative MIME type field */
  contentType?: string;
  /** File size in bytes */
  size?: number;
}

/**
 * Attachment conversion result
 */
export interface AttachmentConversionResult {
  success: boolean;
  file: File | null;
  error?: string;
  source: "base64" | "url" | "unknown";
}

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: "SIZE_EXCEEDED" | "INVALID_TYPE" | "EMPTY_FILE" | "UNKNOWN";
}

