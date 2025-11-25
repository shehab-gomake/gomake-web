/**
 * Chatwoot Attachment Types
 *
 * Comprehensive type definitions for attachment handling in messages and composers.
 * Covers all Chatwoot-supported attachment types and file operations.
 */

/**
 * Supported file types in Chatwoot
 * @see https://www.chatwoot.com/docs/user-guide/features/attachments
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
 */
export const FILE_EXTENSION_MAP: Record<string, FileCategory> = {
  // PDF
  pdf: "pdf",
  // Word documents
  doc: "word",
  docx: "word",
  odt: "word",
  rtf: "word",
  // Excel/Spreadsheets
  xls: "excel",
  xlsx: "excel",
  csv: "excel",
  ods: "excel",
  // Archives
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  tar: "archive",
  gz: "archive",
  // Audio
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  m4a: "audio",
  aac: "audio",
  flac: "audio",
  // Video
  mp4: "video",
  mov: "video",
  avi: "video",
  mkv: "video",
  webm: "video",
  // Images
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
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
 */
export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
] as const;

/**
 * Supported video MIME types
 */
export const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
] as const;

/**
 * Supported audio MIME types
 */
export const AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
  "audio/aac",
  "audio/flac",
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

