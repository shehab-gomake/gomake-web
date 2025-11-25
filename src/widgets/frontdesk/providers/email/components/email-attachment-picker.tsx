/**
 * Email Attachment Picker
 *
 * Component for selecting and managing email attachments.
 * Uses shared attachment utilities and Chatwoot file type restrictions.
 *
 * @see https://developers.chatwoot.com/self-hosted/supported-features#outgoing-attachments-supported-file-types
 */

import React, { useRef, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  IconButton,
  Chip,
  Typography,
  Stack,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  AttachFile as AttachIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  FolderZip as ArchiveIcon,
  Description as DocIcon,
} from "@mui/icons-material";
import { EmailAttachment } from "../types/email.types";
import {
  formatFileSize,
  validateFileSize,
  isFileSizeValid,
} from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";
import {
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
  AUDIO_MIME_TYPES,
  DOCUMENT_MIME_TYPES,
} from "@/widgets/frontdesk/providers/chatwoot/types/attachment.types";

// ============================================================================
// Constants
// ============================================================================

const MAX_FILENAME_LENGTH = 255;
const MAX_FILES = 10;

/**
 * All supported MIME types for email attachments
 * Based on Chatwoot's supported file types
 */
const SUPPORTED_MIME_TYPES = [
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
  ...AUDIO_MIME_TYPES,
  ...DOCUMENT_MIME_TYPES,
] as const;

/**
 * Accept attribute for file input
 * Includes all supported types
 */
const ACCEPT_FILE_TYPES = [
  // Images
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/bmp",
  "image/webp",
  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
  "video/x-msvideo",
  // Audio
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/mp4",
  "audio/opus",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-7z-compressed",
  "application/vnd.rar",
  "application/x-tar",
  "text/plain",
  "text/csv",
  "application/json",
  "application/xml",
  "text/xml",
].join(",");

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get icon for file type
 */
const getFileIcon = (mimeType: string): React.ReactNode => {
  if (mimeType.startsWith("image/")) {
    return <ImageIcon fontSize="small" sx={{ color: "#4CAF50" }} />;
  }
  if (mimeType.startsWith("video/")) {
    return <VideoIcon fontSize="small" sx={{ color: "#F44336" }} />;
  }
  if (mimeType.startsWith("audio/")) {
    return <AudioIcon fontSize="small" sx={{ color: "#9C27B0" }} />;
  }
  if (mimeType === "application/pdf") {
    return <PdfIcon fontSize="small" sx={{ color: "#E53935" }} />;
  }
  if (
    mimeType.includes("zip") ||
    mimeType.includes("rar") ||
    mimeType.includes("tar") ||
    mimeType.includes("7z")
  ) {
    return <ArchiveIcon fontSize="small" sx={{ color: "#FF9800" }} />;
  }
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("text")
  ) {
    return <DocIcon fontSize="small" sx={{ color: "#2196F3" }} />;
  }
  return <FileIcon fontSize="small" sx={{ color: "#607D8B" }} />;
};

/**
 * Check if MIME type is supported
 */
const isSupportedMimeType = (mimeType: string): boolean => {
  // Check exact match
  if (SUPPORTED_MIME_TYPES.includes(mimeType as any)) {
    return true;
  }
  // Check prefix match for common types
  if (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("video/") ||
    mimeType.startsWith("audio/") ||
    mimeType.startsWith("text/")
  ) {
    return true;
  }
  return false;
};

// ============================================================================
// Types
// ============================================================================

interface EmailAttachmentPickerProps {
  attachments: EmailAttachment[];
  onAttachmentsChange: (attachments: EmailAttachment[]) => void;
  maxFileSize?: number; // in bytes, defaults to Chatwoot's 40MB
  maxFiles?: number;
}

interface FileValidationError {
  filename: string;
  error: string;
}

// ============================================================================
// Handle Type for ref
// ============================================================================

export interface EmailAttachmentPickerHandle {
  openFilePicker: () => void;
}

// ============================================================================
// Component
// ============================================================================

export const EmailAttachmentPicker = forwardRef<EmailAttachmentPickerHandle, EmailAttachmentPickerProps>(({
  attachments,
  onAttachmentsChange,
  maxFileSize = MAX_FILE_SIZE_BYTES,
  maxFiles = MAX_FILES,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FileValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Expose openFilePicker method via ref
  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      fileInputRef.current?.click();
    },
  }));

  /**
   * Validate a single file
   */
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check size
      if (!isFileSizeValid(file.size)) {
        return `Exceeds maximum size of ${MAX_FILE_SIZE_MB}MB`;
      }
      if (file.size > maxFileSize) {
        return `Exceeds maximum size of ${formatFileSize(maxFileSize)}`;
      }

      // Check filename length
      if (file.name.length > MAX_FILENAME_LENGTH) {
        return `Filename exceeds ${MAX_FILENAME_LENGTH} characters`;
      }

      // Check MIME type
      if (file.type && !isSupportedMimeType(file.type)) {
        return `File type "${file.type}" is not supported`;
      }

      return null;
    },
    [maxFileSize]
  );

  /**
   * Convert file to base64
   */
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:*/*;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }, []);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setErrors([]);

      if (files.length === 0) return;

      // Check max files limit
      if (attachments.length + files.length > maxFiles) {
        setErrors([
          {
            filename: "",
            error: `Maximum ${maxFiles} files allowed. Currently have ${attachments.length}.`,
          },
        ]);
        return;
      }

      setIsLoading(true);
      const validationErrors: FileValidationError[] = [];
      const newAttachments: EmailAttachment[] = [];

      try {
        for (const file of files) {
          // Validate file
          const validationError = validateFile(file);
          if (validationError) {
            validationErrors.push({
              filename: file.name,
              error: validationError,
            });
            continue; // Skip invalid files but continue with others
          }

          // Convert to base64
          try {
            const base64Content = await fileToBase64(file);
            newAttachments.push({
              filename: file.name,
              contentType: file.type || "application/octet-stream",
              mimeType: file.type || "application/octet-stream",
              size: file.size,
              content: base64Content,
            });
          } catch (err) {
            validationErrors.push({
              filename: file.name,
              error: "Failed to read file",
            });
          }
        }

        // Update attachments with valid files
        if (newAttachments.length > 0) {
          onAttachmentsChange([...attachments, ...newAttachments]);
        }

        // Show errors if any
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        }
      } catch (err) {
        console.error("[EmailAttachmentPicker] Error processing files:", err);
        setErrors([{ filename: "", error: "Failed to process files" }]);
      } finally {
        setIsLoading(false);
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [attachments, onAttachmentsChange, maxFiles, validateFile, fileToBase64]
  );

  /**
   * Remove attachment by index
   */
  const handleRemoveAttachment = useCallback(
    (index: number) => {
      const updated = attachments.filter((_, i) => i !== index);
      onAttachmentsChange(updated);
      setErrors([]);
    },
    [attachments, onAttachmentsChange]
  );

  /**
   * Trigger file input click
   */
  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Clear all errors
   */
  const handleClearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Calculate total size
  const totalSize = useMemo(
    () => attachments.reduce((sum, att) => sum + att.size, 0),
    [attachments]
  );

  return (
    <Box>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT_FILE_TYPES}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* Attach button and summary */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Tooltip title={`Attach files (max ${MAX_FILE_SIZE_MB}MB each)`}>
          <span>
            <IconButton
              size="small"
              onClick={handleAttachClick}
              disabled={isLoading || attachments.length >= maxFiles}
              sx={{ color: "text.secondary" }}
            >
              <AttachIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        {attachments.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            {attachments.length} file{attachments.length > 1 ? "s" : ""} (
            {formatFileSize(totalSize)})
          </Typography>
        )}
      </Stack>

      {/* Error messages */}
      {errors.length > 0 && (
        <Alert severity="error" onClose={handleClearErrors} sx={{ mb: 1 }}>
          {errors.length === 1 ? (
            errors[0].filename ? (
              <>
                <strong>{errors[0].filename}:</strong> {errors[0].error}
              </>
            ) : (
              errors[0].error
            )
          ) : (
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {errors.length} files had issues:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {errors.slice(0, 3).map((err, i) => (
                  <li key={i}>
                    {err.filename ? `${err.filename}: ` : ""}
                    {err.error}
                  </li>
                ))}
                {errors.length > 3 && (
                  <li>...and {errors.length - 3} more</li>
                )}
              </ul>
            </Box>
          )}
        </Alert>
      )}

      {/* Attachment chips */}
      {attachments.length > 0 && (
        <Stack spacing={0.5} sx={{ mb: 1 }}>
          {attachments.map((attachment, index) => (
            <Chip
              key={`${attachment.filename}-${index}`}
              icon={getFileIcon(attachment.contentType || attachment.mimeType || "")}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ maxWidth: 200 }}
                    title={attachment.filename}
                  >
                    {attachment.filename}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({formatFileSize(attachment.size)})
                  </Typography>
                </Box>
              }
              onDelete={() => handleRemoveAttachment(index)}
              deleteIcon={<CloseIcon fontSize="small" />}
              size="small"
              variant="outlined"
              sx={{ width: "fit-content" }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
});

// Display name for debugging
EmailAttachmentPicker.displayName = "EmailAttachmentPicker";

export default EmailAttachmentPicker;
