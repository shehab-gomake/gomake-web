/**
 * AttachmentPreview Component
 *
 * Enhanced attachment preview matching Chatwoot's UI style:
 * - Images displayed in grid layout with thumbnails
 * - Non-image files displayed in horizontal list
 * Based on Chatwoot's AttachmentPreviews.vue component
 */

import React, { useState, useEffect, useMemo } from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import VideocamIcon from "@mui/icons-material/Videocam";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";

import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

interface AttachmentPreviewProps {
  file: File;
  onRemove: () => void;
}

// Format file size (matching Chatwoot's formatBytes helper)
const formatFileSize = (bytes: number, decimals: number = 0): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Get file name with ellipsis for long names
const fileNameWithEllipsis = (file: File, maxLength: number = 20): string => {
  if (file.name.length <= maxLength) return file.name;
  const ext = file.name.split(".").pop() || "";
  const nameWithoutExt = file.name.slice(0, file.name.length - ext.length - 1);
  const truncatedName = nameWithoutExt.slice(0, maxLength - ext.length - 3);
  return `${truncatedName}...${ext}`;
};

// Check if file is an image
const isTypeImage = (file: File): boolean => {
  return file.type.startsWith("image/");
};

// Get file type icon
const getFileIcon = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const type = file.type;

  if (type.startsWith("image/")) return null; // Images show thumbnails
  if (type.startsWith("video/")) return <VideocamIcon sx={{ fontSize: 20 }} />;
  if (type.startsWith("audio/")) return <AudiotrackIcon sx={{ fontSize: 20 }} />;
  if (type === "application/pdf" || extension === "pdf") return <PictureAsPdfIcon sx={{ fontSize: 20 }} />;

  // Document types
  if (["doc", "docx", "txt", "rtf", "odt"].includes(extension || "")) {
    return <DescriptionIcon sx={{ fontSize: 20 }} />;
  }

  // Spreadsheets
  if (["xls", "xlsx", "csv", "ods"].includes(extension || "")) {
    return <TableChartIcon sx={{ fontSize: 20 }} />;
  }

  // Archives
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
    return <ArchiveIcon sx={{ fontSize: 20 }} />;
  }

  return <InsertDriveFileIcon sx={{ fontSize: 20 }} />;
};

/**
 * Image Attachment Preview (Grid Layout)
 * Matches Chatwoot's image preview style
 */
const ImageAttachmentPreview: React.FC<AttachmentPreviewProps> = ({ file, onRemove }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnail(reader.result as string);
    };
    reader.readAsDataURL(file);

    return () => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [file]);

  if (!thumbnail) return null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "4.5rem",
        height: "4.5rem",
        borderRadius: 1.5,
        overflow: "hidden",
        "&:hover .remove-button": {
          opacity: 1,
        },
      }}
    >
      <img
        src={thumbnail}
        alt={file.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <IconButton
        size="small"
        onClick={onRemove}
        className="remove-button"
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          opacity: 0,
          transition: "opacity 0.15s ease-in-out",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          width: 20,
          height: 20,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <DeleteIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
};

/**
 * File Attachment Preview (Horizontal List)
 * Matches Chatwoot's file preview style
 */
const FileAttachmentPreview: React.FC<AttachmentPreviewProps> = ({ file, onRemove }) => {
  const icon = getFileIcon(file);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        height: 32,
        minWidth: 0,
        maxWidth: "18.75rem",
        backgroundColor: colorTokens.neutral[50],
        borderRadius: 1.5,
        gap: 1.5,
        px: 1.5,
        py: 0.5,
        pr: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: colorTokens.neutral[700],
        }}
      >
        {icon || <InsertDriveFileIcon sx={{ fontSize: 20 }} />}
      </Box>
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          color: colorTokens.neutral[900],
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          minWidth: 0,
        }}
      >
        {fileNameWithEllipsis(file)}
      </Typography>
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{
          flexShrink: 0,
          width: 20,
          height: 20,
          color: colorTokens.neutral[600],
          "&:hover": {
            backgroundColor: colorTokens.neutral[100],
            color: colorTokens.neutral[900],
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
};

/**
 * AttachmentPreviews Component
 * Separates images (grid) from files (list) matching Chatwoot's UI
 */
interface AttachmentPreviewsProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const AttachmentPreviews: React.FC<AttachmentPreviewsProps> = ({ files, onRemove }) => {
  // Separate images from other files
  const { imageFiles, nonImageFiles } = useMemo(() => {
    const images: File[] = [];
    const nonImages: File[] = [];

    files.forEach((file) => {
      if (isTypeImage(file)) {
        images.push(file);
      } else {
        nonImages.push(file);
      }
    });

    return { imageFiles: images, nonImageFiles: nonImages };
  }, [files]);

  if (files.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
      {/* Image Attachments - Grid Layout */}
      {imageFiles.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {imageFiles.map((file, index) => {
            // Find original index in full files array
            const originalIndex = files.indexOf(file);
            return (
              <ImageAttachmentPreview
                key={`image-${file.name}-${originalIndex}`}
                file={file}
                onRemove={() => onRemove(originalIndex)}
              />
            );
          })}
        </Box>
      )}

      {/* Non-Image Attachments - Horizontal List */}
      {nonImageFiles.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {nonImageFiles.map((file, index) => {
            // Find original index in full files array
            const originalIndex = files.indexOf(file);
            return (
              <FileAttachmentPreview
                key={`file-${file.name}-${originalIndex}`}
                file={file}
                onRemove={() => onRemove(originalIndex)}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};
