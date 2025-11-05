/**
 * AttachmentPreview Component
 *
 * Enhanced attachment preview with image thumbnails and file type icons.
 */

import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, IconButton, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import VideocamIcon from "@mui/icons-material/Videocam";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import ArchiveIcon from "@mui/icons-material/Archive";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface AttachmentPreviewProps {
  file: File;
  onRemove: () => void;
}

// Get file type icon based on file extension/mime type
const getFileIcon = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const type = file.type;

  if (type.startsWith("image/")) return null; // We'll show thumbnail
  if (type.startsWith("video/")) return <VideocamIcon />;
  if (type.startsWith("audio/")) return <AudiotrackIcon />;
  if (type === "application/pdf" || extension === "pdf") return <PictureAsPdfIcon />;

  // Document types
  if (["doc", "docx", "txt", "rtf", "odt"].includes(extension || "")) {
    return <DescriptionIcon />;
  }

  // Spreadsheets
  if (["xls", "xlsx", "csv", "ods"].includes(extension || "")) {
    return <TableChartIcon />;
  }

  // Archives
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
    return <ArchiveIcon />;
  }

  return <InsertDriveFileIcon />;
};

// Get file type color
const getFileColor = (file: File) => {
  const type = file.type;
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (type.startsWith("image/")) return "#10b981"; // green
  if (type.startsWith("video/")) return "#8b5cf6"; // purple
  if (type.startsWith("audio/")) return "#f59e0b"; // amber
  if (type === "application/pdf") return "#ef4444"; // red
  if (["doc", "docx"].includes(extension || "")) return "#3b82f6"; // blue
  if (["xls", "xlsx", "csv"].includes(extension || "")) return "#059669"; // emerald

  return "#6b7280"; // gray
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
};

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ file, onRemove }) => {
  const { neutralColor, primaryColor } = useGomakeTheme();
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const isImage = file.type.startsWith("image/");
  const icon = getFileIcon(file);
  const color = getFileColor(file);

  // Generate thumbnail for images
  useEffect(() => {
    if (!isImage) return;

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
  }, [file, isImage]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        backgroundColor: neutralColor(25),
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 1,
        position: "relative",
        transition: "all 0.2s",
        "&:hover": {
          backgroundColor: neutralColor(50),
          borderColor: neutralColor(300),
        },
      }}
    >
      {/* Thumbnail or Icon */}
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 1,
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: isImage ? neutralColor(100) : `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${neutralColor(200)}`,
        }}
      >
        {isImage && thumbnail ? (
          <img
            src={thumbnail}
            alt={file.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Box sx={{ color, fontSize: 24 }}>{icon}</Box>
        )}
      </Box>

      {/* File Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: neutralColor(900),
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.25 }}>
          <Typography sx={{ fontSize: "0.75rem", color: neutralColor(600) }}>
            {formatFileSize(file.size)}
          </Typography>
          {isImage && (
            <Chip
              label="Image"
              size="small"
              sx={{
                height: 18,
                fontSize: "0.6875rem",
                fontWeight: 500,
                backgroundColor: `${color}20`,
                color,
                border: `1px solid ${color}40`,
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />
          )}
        </Stack>
      </Box>

      {/* Remove Button */}
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          color: neutralColor(600),
          backgroundColor: neutralColor(0),
          border: `1px solid ${neutralColor(200)}`,
          width: 24,
          height: 24,
          "&:hover": {
            backgroundColor: "#ef4444",
            borderColor: "#ef4444",
            color: "#fff",
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 14 }} />
      </IconButton>
    </Box>
  );
};

/**
 * AttachmentPreviews List Component
 */
interface AttachmentPreviewsProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const AttachmentPreviews: React.FC<AttachmentPreviewsProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <Stack spacing={1} sx={{ mt: 1.5 }}>
      {files.map((file, index) => (
        <AttachmentPreview key={`${file.name}-${index}`} file={file} onRemove={() => onRemove(index)} />
      ))}
    </Stack>
  );
};
