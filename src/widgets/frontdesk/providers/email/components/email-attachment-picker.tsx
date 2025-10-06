import React, { useRef, useState, useCallback } from "react";
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
} from "@mui/icons-material";
import { EmailAttachment } from "../../types/email.types";

interface EmailAttachmentPickerProps {
  attachments: EmailAttachment[];
  onAttachmentsChange: (attachments: EmailAttachment[]) => void;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_FILENAME_LENGTH = 255;

export const EmailAttachmentPicker: React.FC<EmailAttachmentPickerProps> = ({
  attachments,
  onAttachmentsChange,
  maxFileSize = MAX_FILE_SIZE,
  maxFiles = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File "${file.name}" exceeds maximum size of ${formatFileSize(maxFileSize)}`;
    }
    if (file.name.length > MAX_FILENAME_LENGTH) {
      return `Filename "${file.name}" exceeds maximum length of ${MAX_FILENAME_LENGTH} characters`;
    }
    return null;
  };

  const fileToBase64 = (file: File): Promise<string> => {
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
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setError(null);

      if (files.length === 0) return;

      if (attachments.length + files.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setIsLoading(true);

      try {
        const newAttachments: EmailAttachment[] = [];

        for (const file of files) {
          // Validate file
          const validationError = validateFile(file);
          if (validationError) {
            setError(validationError);
            setIsLoading(false);
            return;
          }

          // Convert to base64
          const base64Content = await fileToBase64(file);

          const attachment: EmailAttachment = {
            filename: file.name,
            contentType: file.type,
            size: file.size,
            content: base64Content,
          };

          newAttachments.push(attachment);
        }

        onAttachmentsChange([...attachments, ...newAttachments]);
      } catch (err) {
        console.error("Error processing files:", err);
        setError("Failed to process files");
      } finally {
        setIsLoading(false);
        // Reset input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [attachments, onAttachmentsChange, maxFiles, maxFileSize]
  );

  const handleRemoveAttachment = useCallback(
    (index: number) => {
      const updated = attachments.filter((_, i) => i !== index);
      onAttachmentsChange(updated);
      setError(null);
    },
    [attachments, onAttachmentsChange]
  );

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const totalSize = attachments.reduce((sum, att) => sum + att.size, 0);

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Tooltip title="Attach files">
          <IconButton
            size="small"
            onClick={handleAttachClick}
            disabled={isLoading || attachments.length >= maxFiles}
            sx={{ color: "text.secondary" }}
          >
            <AttachIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {attachments.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            {attachments.length} file{attachments.length > 1 ? "s" : ""} (
            {formatFileSize(totalSize)})
          </Typography>
        )}
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      {attachments.length > 0 && (
        <Stack spacing={0.5} sx={{ mb: 1 }}>
          {attachments.map((attachment, index) => (
            <Chip
              key={index}
              icon={<FileIcon fontSize="small" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
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
};