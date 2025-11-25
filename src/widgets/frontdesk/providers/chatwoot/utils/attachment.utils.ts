/**
 * Attachment Utilities
 *
 * Comprehensive utility functions for handling file attachments.
 * Includes conversion, validation, and formatting helpers.
 */

import {
  AttachmentSource,
  AttachmentConversionResult,
  FileValidationResult,
  FileCategory,
  FILE_EXTENSION_MAP,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  ChatwootAttachment,
} from "../types/attachment.types";

/**
 * Format file size for human-readable display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null || bytes < 0) return "";
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

/**
 * Extract file name from URL
 * Handles encoded URLs and various path formats
 * @param url - File URL
 * @returns Extracted file name or fallback
 */
export const getFileNameFromUrl = (url: string): string => {
  if (!url || typeof url !== "string") return "File";

  try {
    // Try to decode URI components
    const decoded = decodeURIComponent(url);
    // Extract the last path segment
    const urlObj = new URL(decoded, "http://placeholder.com");
    const pathname = urlObj.pathname;
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // Clean up query parameters if present
    const fileName = lastSegment?.split("?")[0] || "File";
    return fileName || "File";
  } catch {
    // Fallback: simple split on /
    try {
      const parts = url.split("/");
      const lastPart = parts[parts.length - 1]?.split("?")[0];
      return lastPart || "File";
    } catch {
      return "File";
    }
  }
};

/**
 * Get file extension from URL or explicit extension
 * @param url - File URL
 * @param extension - Optional explicit extension
 * @returns Lowercase extension without dot
 */
export const getFileExtension = (url: string, extension?: string | null): string => {
  if (extension) {
    return extension.toLowerCase().replace(/^\./, "");
  }

  const fileName = getFileNameFromUrl(url);
  const parts = fileName.split(".");
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  return "";
};

/**
 * Get file category from file type and extension
 * @param fileType - Chatwoot file_type
 * @param extension - File extension
 * @returns File category for icon mapping
 */
export const getFileCategory = (
  fileType: string,
  extension: string
): FileCategory => {
  // Check explicit file type first
  if (fileType === "audio") return "audio";
  if (fileType === "video") return "video";
  if (fileType === "image") return "image";
  if (fileType === "location") return "location";
  if (fileType === "contact") return "contact";

  // Check extension mapping
  const normalizedExt = extension.toLowerCase();
  return FILE_EXTENSION_MAP[normalizedExt] || "unknown";
};

/**
 * Validate file size
 * @param size - File size in bytes
 * @returns Validation result
 */
export const validateFileSize = (size: number): FileValidationResult => {
  if (size === 0) {
    return {
      valid: false,
      error: "File is empty",
      errorCode: "EMPTY_FILE",
    };
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`,
      errorCode: "SIZE_EXCEEDED",
    };
  }

  return { valid: true };
};

/**
 * Check if file size is within limit
 * @param sizeInBytes - File size in bytes
 * @returns True if within limit
 */
export const isFileSizeValid = (sizeInBytes: number): boolean => {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE_BYTES;
};

/**
 * Convert file size in bytes to megabytes
 * @param bytes - Size in bytes
 * @returns Size in MB
 */
export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

/**
 * Convert base64 string to File object
 * @param base64 - Base64 encoded content
 * @param filename - File name
 * @param mimeType - MIME type
 * @returns File object or null on error
 */
export const base64ToFile = (
  base64: string,
  filename: string,
  mimeType: string
): File | null => {
  if (!base64 || typeof base64 !== "string") return null;

  try {
    // Remove data URL prefix if present
    const cleanBase64 = base64.includes(",")
      ? base64.split(",")[1]
      : base64;

    const byteCharacters = window.atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  } catch (error) {
    console.error("[attachment.utils] Failed to convert base64 to file:", error);
    return null;
  }
};

/**
 * Fetch file from URL and convert to File object
 * Handles CORS and network errors gracefully
 * @param url - File URL
 * @param filename - File name
 * @param mimeType - Optional MIME type
 * @param timeout - Request timeout in ms (default: 30000)
 * @returns File object or null on error
 */
export const urlToFile = async (
  url: string,
  filename: string,
  mimeType?: string,
  timeout: number = 30000
): Promise<File | null> => {
  if (!url || typeof url !== "string") return null;

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      // Don't include credentials to avoid CORS issues with external URLs
      credentials: "omit",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Use provided MIME type or fallback to response content-type
    const finalMimeType =
      mimeType || blob.type || "application/octet-stream";

    return new File([blob], filename, { type: finalMimeType });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("[attachment.utils] URL fetch timeout:", url);
      } else {
        console.error("[attachment.utils] Failed to fetch URL:", url, error.message);
      }
    }
    return null;
  }
};

/**
 * Convert attachment source to File object
 * Handles base64, URL, and data URL formats
 * @param source - Attachment source data
 * @returns Conversion result with file or error
 */
export const convertAttachmentToFile = async (
  source: AttachmentSource
): Promise<AttachmentConversionResult> => {
  const mimeType =
    source.contentType || source.mimeType || "application/octet-stream";
  const base64 = source.content || source.data;

  // Try base64 first
  if (base64) {
    const file = base64ToFile(base64, source.filename, mimeType);
    if (file) {
      return {
        success: true,
        file,
        source: "base64",
      };
    }
    return {
      success: false,
      file: null,
      error: "Failed to decode base64 content",
      source: "base64",
    };
  }

  // Try URL
  if (source.url) {
    const file = await urlToFile(source.url, source.filename, mimeType);
    if (file) {
      return {
        success: true,
        file,
        source: "url",
      };
    }
    return {
      success: false,
      file: null,
      error: "Failed to fetch attachment from URL",
      source: "url",
    };
  }

  // No valid source
  return {
    success: false,
    file: null,
    error: "No content, data, or url provided",
    source: "unknown",
  };
};

/**
 * Convert multiple attachments to files
 * Logs progress and failures
 * @param sources - Array of attachment sources
 * @returns Array of successfully converted files
 */
export const convertAttachmentsToFiles = async (
  sources: AttachmentSource[]
): Promise<File[]> => {
  if (!sources || sources.length === 0) return [];

  console.log(`[attachment.utils] Converting ${sources.length} attachments...`);

  const results = await Promise.all(
    sources.map((source, index) =>
      convertAttachmentToFile(source).then((result) => ({
        ...result,
        index,
        filename: source.filename,
      }))
    )
  );

  const files: File[] = [];
  const failures: string[] = [];

  results.forEach((result) => {
    if (result.success && result.file) {
      files.push(result.file);
    } else {
      failures.push(`${result.filename}: ${result.error}`);
    }
  });

  if (failures.length > 0) {
    console.warn(
      `[attachment.utils] ${failures.length} attachment(s) failed to convert:`,
      failures
    );
  }

  console.log(
    `[attachment.utils] Successfully converted ${files.length}/${sources.length} attachments`
  );

  return files;
};

/**
 * Image file extensions
 */
const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "tiff", "tif"
]);

/**
 * Video file extensions
 */
const VIDEO_EXTENSIONS = new Set([
  "mp4", "webm", "mov", "avi", "mkv", "wmv", "flv", "m4v", "ogv"
]);

/**
 * Audio file extensions
 */
const AUDIO_EXTENSIONS = new Set([
  "mp3", "wav", "ogg", "aac", "flac", "m4a", "wma", "opus"
]);

/**
 * Determine the actual media type of an attachment
 * Checks both file_type and extension for more accurate detection
 * @param attachment - Chatwoot attachment
 * @returns Media category
 */
export const getAttachmentMediaType = (
  attachment: ChatwootAttachment
): "image" | "video" | "audio" | "file" => {
  // First, trust explicit file_type if it's a media type
  if (attachment.file_type === "image") return "image";
  if (attachment.file_type === "video") return "video";
  if (attachment.file_type === "audio") return "audio";

  // For generic "file" type or unknown, check extension
  const extension = getFileExtension(attachment.data_url, attachment.extension);
  
  if (IMAGE_EXTENSIONS.has(extension)) return "image";
  if (VIDEO_EXTENSIONS.has(extension)) return "video";
  if (AUDIO_EXTENSIONS.has(extension)) return "audio";

  return "file";
};

/**
 * Categorize attachments by type
 * Uses both file_type and extension for accurate categorization
 * @param attachments - Array of Chatwoot attachments
 * @returns Categorized attachments
 */
export const categorizeAttachments = (
  attachments: ChatwootAttachment[]
): {
  images: ChatwootAttachment[];
  videos: ChatwootAttachment[];
  audios: ChatwootAttachment[];
  files: ChatwootAttachment[];
} => {
  const images: ChatwootAttachment[] = [];
  const videos: ChatwootAttachment[] = [];
  const audios: ChatwootAttachment[] = [];
  const files: ChatwootAttachment[] = [];

  attachments.forEach((attachment) => {
    const mediaType = getAttachmentMediaType(attachment);
    
    switch (mediaType) {
      case "image":
        images.push(attachment);
        break;
      case "video":
        videos.push(attachment);
        break;
      case "audio":
        audios.push(attachment);
        break;
      default:
        files.push(attachment);
        break;
    }
  });

  return { images, videos, audios, files };
};

/**
 * Check if attachment is previewable (image or video)
 * Uses smart detection with both file_type and extension
 * @param attachment - Chatwoot attachment
 * @returns True if can be previewed in modal
 */
export const isPreviewable = (attachment: ChatwootAttachment): boolean => {
  const mediaType = getAttachmentMediaType(attachment);
  return mediaType === "image" || mediaType === "video";
};

/**
 * Get preview type for modal
 * Uses smart detection with both file_type and extension
 * @param attachment - Chatwoot attachment
 * @returns "image" | "video" | null
 */
export const getPreviewType = (
  attachment: ChatwootAttachment
): "image" | "video" | null => {
  const mediaType = getAttachmentMediaType(attachment);
  if (mediaType === "image") return "image";
  if (mediaType === "video") return "video";
  return null;
};

/**
 * Generate a unique temporary ID for optimistic updates
 * @returns Unique string ID
 */
export const generateTempId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

