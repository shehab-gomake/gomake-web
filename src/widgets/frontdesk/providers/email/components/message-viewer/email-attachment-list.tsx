import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  TableChart as SpreadsheetIcon,
  Code as CodeIcon,
} from "@mui/icons-material";
import { EmailAttachment } from "../../types/email.types";
import { emailApiClient } from "../../utils/email-api-client";

interface EmailAttachmentListProps {
  attachments: EmailAttachment[];
  accountId: string;
  messageId: string;
  /** Filter out inline (CID) attachments that are embedded in HTML (default: true) */
  filterInlineAttachments?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getFileIcon = (mimeType?: string, filename?: string) => {
  if (!mimeType && !filename) return <FileIcon />;

  const type = mimeType || "";
  const name = filename?.toLowerCase() || "";

  if (type.includes("pdf") || name.endsWith(".pdf")) return <PdfIcon />;
  if (type.includes("image") || /\.(jpg|jpeg|png|gif|svg|webp)$/.test(name))
    return <ImageIcon />;
  if (
    type.includes("word") ||
    type.includes("document") ||
    /\.(doc|docx|txt|rtf)$/.test(name)
  )
    return <DocIcon />;
  if (
    type.includes("sheet") ||
    type.includes("excel") ||
    /\.(xls|xlsx|csv)$/.test(name)
  )
    return <SpreadsheetIcon />;
  if (
    type.includes("code") ||
    type.includes("javascript") ||
    type.includes("json") ||
    /\.(js|ts|jsx|tsx|json|html|css|py|java)$/.test(name)
  )
    return <CodeIcon />;

  return <FileIcon />;
};

/**
 * Check if an attachment is an inline (CID) attachment
 * Inline attachments have Content-ID and are embedded in HTML
 */
const isInlineAttachment = (attachment: EmailAttachment): boolean => {
  // CID attachments typically have an ID that's used in img src="cid:..."
  // They may also have a Content-Disposition header of "inline"
  // For now, we check if the attachment has an ID (which would be the CID)
  // and if it's an image type (most inline attachments are images)
  const mimeType = attachment.mimeType || attachment.contentType || '';
  const isImage = mimeType.startsWith('image/');

  // If it's an image with a CID-like ID, it's likely inline
  // CIDs often look like: "image001@example.com" or just "ABC123"
  return isImage && !!attachment.id;
};

export const EmailAttachmentList: React.FC<EmailAttachmentListProps> = ({
  attachments,
  accountId,
  messageId,
  filterInlineAttachments = true,
}) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  // Filter out inline attachments if requested
  const displayAttachments = useMemo(() => {
    if (!filterInlineAttachments) {
      return attachments;
    }

    // Only show non-inline attachments (regular downloads)
    return attachments.filter(att => !isInlineAttachment(att));
  }, [attachments, filterInlineAttachments]);

  const handleDownload = useCallback(
    async (attachment: EmailAttachment) => {
      if (!attachment.id) return;

      setDownloading(attachment.id);

      try {
        const blob = await emailApiClient.downloadAttachment(
          accountId,
          messageId,
          attachment.id
        );

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to download attachment:", error);
        // TODO: Show error toast
      } finally {
        setDownloading(null);
      }
    },
    [accountId, messageId]
  );

  if (!displayAttachments || displayAttachments.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {displayAttachments.length} Attachment{displayAttachments.length > 1 ? "s" : ""}
      </Typography>

      <Stack spacing={1}>
        {displayAttachments.map((attachment, index) => {
          const isDownloading = downloading === attachment.id;
          const mimeType = attachment.mimeType || attachment.contentType;

          return (
            <Paper
              key={attachment.id || index}
              variant="outlined"
              sx={{
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Box sx={{ color: "text.secondary" }}>
                {getFileIcon(mimeType, attachment.filename)}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {attachment.filename}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(attachment.size)}
                  {mimeType && ` • ${mimeType.split("/")[1]?.toUpperCase()}`}
                </Typography>
              </Box>

              {attachment.id && (
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(attachment)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DownloadIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};