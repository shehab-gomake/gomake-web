/**
 * Message Attachments Components
 *
 * Renders attachments in message bubbles.
 * Supports images, videos, audio, and file downloads.
 */

import React, { useState, useCallback, useMemo } from "react";
import { Box, Stack, Typography, Modal, Backdrop, CircularProgress, IconButton, alpha, useTheme } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CloseIcon from "@mui/icons-material/Close";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { ChatwootAttachment, MediaModalState, FileCategory } from "../../types/attachment.types";
import {
  formatFileSize,
  getFileNameFromUrl,
  getFileExtension,
  getFileCategory,
  categorizeAttachments,
} from "../../utils/attachment.utils";
import { colorTokens, radiusTokens, shadowTokens, fileTypeColors } from "@/widgets/frontdesk/design-system";

// ============================================================================
// Icon Mapping
// ============================================================================

/**
 * Get appropriate icon for file category
 */
const getFileIcon = (category: FileCategory): React.ReactNode => {
  const iconProps = { fontSize: 28 as const };

  switch (category) {
    case "pdf":
      return <PictureAsPdfIcon sx={{ ...iconProps, color: "#E53935" }} />;
    case "word":
      return <DescriptionIcon sx={{ ...iconProps, color: "#2196F3" }} />;
    case "excel":
      return <TableChartIcon sx={{ ...iconProps, color: "#4CAF50" }} />;
    case "archive":
      return <FolderZipIcon sx={{ ...iconProps, color: "#FF9800" }} />;
    case "audio":
      return <AudioFileIcon sx={{ ...iconProps, color: "#9C27B0" }} />;
    case "video":
      return <VideoFileIcon sx={{ ...iconProps, color: "#F44336" }} />;
    case "location":
      return <LocationOnIcon sx={{ ...iconProps, color: "#4CAF50" }} />;
    case "contact":
      return <ContactPageIcon sx={{ ...iconProps, color: "#00BCD4" }} />;
    default:
      return <InsertDriveFileIcon sx={{ ...iconProps, color: "#607D8B" }} />;
  }
};

// ============================================================================
// Image Attachment Component
// ============================================================================

interface ImageAttachmentProps {
  attachment: ChatwootAttachment;
  onPreview: (url: string) => void;
}

const ImageAttachment: React.FC<ImageAttachmentProps> = React.memo(({ attachment, onPreview }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const handleClick = useCallback(() => {
    if (!error) {
      onPreview(attachment.data_url);
    }
  }, [error, onPreview, attachment.data_url]);

  const imageUrl = attachment.thumb_url || attachment.data_url;

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "relative",
        cursor: error ? "default" : "pointer",
        borderRadius: 2,
        overflow: "hidden",
        maxWidth: 220,
        maxHeight: 220,
        minWidth: 80,
        minHeight: 80,
        bgcolor: colorTokens.neutral[100],
        "&:hover": error ? {} : { opacity: 0.95 },
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      {error ? (
        <Box
          sx={{
            width: 100,
            height: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <BrokenImageIcon sx={{ fontSize: 32, color: colorTokens.neutral[400] }} />
          <Typography variant="caption" color="text.secondary">
            Failed to load
          </Typography>
        </Box>
      ) : (
        <img
          src={imageUrl}
          alt={getFileNameFromUrl(attachment.data_url)}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: loading ? "none" : "block",
            maxWidth: "100%",
            maxHeight: 220,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )}
    </Box>
  );
});

ImageAttachment.displayName = "ImageAttachment";

// ============================================================================
// Video Attachment Component
// ============================================================================

interface VideoAttachmentProps {
  attachment: ChatwootAttachment;
  onPreview: (url: string) => void;
}

const VideoAttachment: React.FC<VideoAttachmentProps> = React.memo(({ attachment, onPreview }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadedData = useCallback(() => {
    setLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  const handleClick = useCallback(() => {
    if (!error) {
      onPreview(attachment.data_url);
    }
  }, [error, onPreview, attachment.data_url]);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        maxWidth: 280,
        cursor: error ? "default" : "pointer",
        bgcolor: colorTokens.neutral[900],
        "&:hover .play-overlay": error ? {} : { bgcolor: "rgba(0,0,0,0.4)" },
      }}
      onClick={handleClick}
    >
      {loading && (
        <Box
          sx={{
            width: 200,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={24} sx={{ color: "#fff" }} />
        </Box>
      )}

      {error ? (
        <Box
          sx={{
            width: 200,
            height: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <VideoFileIcon sx={{ fontSize: 32, color: colorTokens.neutral[400] }} />
          <Typography variant="caption" sx={{ color: colorTokens.neutral[400] }}>
            Failed to load video
          </Typography>
        </Box>
      ) : (
        <>
          <video
            src={attachment.data_url}
            onLoadedData={handleLoadedData}
            onError={handleError}
            style={{
              display: loading ? "none" : "block",
              maxWidth: "100%",
              maxHeight: 200,
              borderRadius: 8,
            }}
          />
          {!loading && (
            <Box
              className="play-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(0,0,0,0.3)",
                transition: "background-color 0.15s",
              }}
            >
              <PlayCircleIcon sx={{ fontSize: 48, color: "#fff" }} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
});

VideoAttachment.displayName = "VideoAttachment";

// ============================================================================
// Audio Attachment Component
// ============================================================================

interface AudioAttachmentProps {
  attachment: ChatwootAttachment;
  isOutgoing: boolean;
}

const AudioAttachment: React.FC<AudioAttachmentProps> = React.memo(({ attachment }) => {
  const theme = useTheme();
  const fileName = getFileNameFromUrl(attachment.data_url);

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1.5,
        bgcolor: theme.palette.mode === "dark"
          ? alpha(colorTokens.neutral[700], 0.4)
          : alpha(colorTokens.neutral[100], 0.8),
        border: `1px solid ${theme.palette.mode === "dark"
          ? alpha(colorTokens.neutral[600], 0.3)
          : colorTokens.neutral[200]}`,
        minWidth: 240,
        maxWidth: 280,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <AudioFileIcon sx={{ fontSize: 24, color: "#9C27B0" }} />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            fontSize: "0.8125rem",
          }}
          title={fileName}
        >
          {fileName}
        </Typography>
      </Stack>
      <audio controls src={attachment.data_url} style={{ width: "100%", height: 36 }} preload="metadata" />
      {attachment.file_size && (
        <Typography variant="caption" sx={{ color: colorTokens.neutral[500], mt: 0.5, display: "block", fontSize: "0.6875rem" }}>
          {formatFileSize(attachment.file_size)}
        </Typography>
      )}
    </Box>
  );
});

AudioAttachment.displayName = "AudioAttachment";

// ============================================================================
// File Attachment Component
// ============================================================================

interface FileAttachmentProps {
  attachment: ChatwootAttachment;
  isOutgoing: boolean;
}

const FileAttachment: React.FC<FileAttachmentProps> = React.memo(({ attachment }) => {
  const theme = useTheme();
  const fileName = getFileNameFromUrl(attachment.data_url);
  const extension = getFileExtension(attachment.data_url, attachment.extension);
  const category = getFileCategory(attachment.file_type, extension);

  return (
    <Box
      component="a"
      href={attachment.data_url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        py: 1,
        px: 1.25,
        borderRadius: 1.5,
        bgcolor: theme.palette.mode === "dark"
          ? alpha(colorTokens.neutral[700], 0.4)
          : alpha(colorTokens.neutral[100], 0.8),
        border: `1px solid ${theme.palette.mode === "dark"
          ? alpha(colorTokens.neutral[600], 0.3)
          : colorTokens.neutral[200]}`,
        textDecoration: "none",
        color: "inherit",
        minWidth: 180,
        maxWidth: 260,
        transition: "background-color 0.15s ease",
        "&:hover": {
          bgcolor: theme.palette.mode === "dark"
            ? alpha(colorTokens.neutral[600], 0.5)
            : colorTokens.neutral[100],
        },
      }}
    >
      {/* File Icon */}
      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        {getFileIcon(category)}
      </Box>

      {/* File Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.8125rem",
            color: theme.palette.mode === "dark" ? colorTokens.neutral[100] : colorTokens.neutral[900],
            lineHeight: 1.4,
          }}
          title={fileName}
        >
          {fileName}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: colorTokens.neutral[500],
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}
        >
          {extension}{attachment.file_size ? ` • ${formatFileSize(attachment.file_size)}` : ""}
        </Typography>
      </Box>

      {/* Download Icon */}
      <DownloadIcon
        sx={{
          fontSize: 18,
          color: colorTokens.neutral[400],
          flexShrink: 0,
        }}
      />
    </Box>
  );
});

FileAttachment.displayName = "FileAttachment";

// ============================================================================
// Media Preview Modal
// ============================================================================

interface MediaPreviewModalProps {
  open: boolean;
  onClose: () => void;
  media: MediaModalState | null;
}

const MediaPreviewModal: React.FC<MediaPreviewModalProps> = React.memo(({ open, onClose, media }) => {
  if (!media) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300, sx: { bgcolor: "rgba(0,0,0,0.9)" } }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "90vw",
          maxHeight: "90vh",
          outline: "none",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: -48,
            right: 0,
            color: "#fff",
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {media.type === "image" ? (
          <img
            src={media.url}
            alt="Preview"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        ) : (
          <video
            src={media.url}
            controls
            autoPlay
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 8,
            }}
          />
        )}
      </Box>
    </Modal>
  );
});

MediaPreviewModal.displayName = "MediaPreviewModal";

// ============================================================================
// Main Message Attachments Component
// ============================================================================

interface MessageAttachmentsProps {
  attachments: ChatwootAttachment[];
  isOutgoing: boolean;
  hasContent: boolean;
}

export const MessageAttachments: React.FC<MessageAttachmentsProps> = React.memo(({ attachments, isOutgoing, hasContent }) => {
  const [previewMedia, setPreviewMedia] = useState<MediaModalState | null>(null);

  // Categorize attachments
  const { images, videos, audios, files } = useMemo(
    () => categorizeAttachments(attachments),
    [attachments]
  );

  // Handlers
  const handleImagePreview = useCallback((url: string) => {
    setPreviewMedia({ url, type: "image" });
  }, []);

  const handleVideoPreview = useCallback((url: string) => {
    setPreviewMedia({ url, type: "video" });
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewMedia(null);
  }, []);

  // Don't render if no attachments
  if (attachments.length === 0) return null;

  return (
    <>
      {/* Image Attachments */}
      {images.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: hasContent ? 1.5 : 0 }}>
          {images.map((attachment) => (
            <ImageAttachment key={attachment.id} attachment={attachment} onPreview={handleImagePreview} />
          ))}
        </Stack>
      )}

      {/* Video Attachments */}
      {videos.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: hasContent || images.length > 0 ? 1.5 : 0 }}>
          {videos.map((attachment) => (
            <VideoAttachment key={attachment.id} attachment={attachment} onPreview={handleVideoPreview} />
          ))}
        </Stack>
      )}

      {/* Audio Attachments */}
      {audios.length > 0 && (
        <Stack
          spacing={1}
          sx={{
            mt: hasContent || images.length > 0 || videos.length > 0 ? 1.5 : 0,
          }}
        >
          {audios.map((attachment) => (
            <AudioAttachment key={attachment.id} attachment={attachment} isOutgoing={isOutgoing} />
          ))}
        </Stack>
      )}

      {/* File Attachments */}
      {files.length > 0 && (
        <Stack
          spacing={1}
          sx={{
            mt: hasContent || images.length > 0 || videos.length > 0 || audios.length > 0 ? 1.5 : 0,
          }}
        >
          {files.map((attachment) => (
            <FileAttachment key={attachment.id} attachment={attachment} isOutgoing={isOutgoing} />
          ))}
        </Stack>
      )}

      {/* Preview Modal */}
      <MediaPreviewModal open={!!previewMedia} onClose={handleClosePreview} media={previewMedia} />
    </>
  );
});

MessageAttachments.displayName = "MessageAttachments";

export default MessageAttachments;
