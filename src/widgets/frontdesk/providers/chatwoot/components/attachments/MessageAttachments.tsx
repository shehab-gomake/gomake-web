/**
 * Message Attachments Components
 *
 * Renders attachments in message bubbles.
 * Supports images, videos, audio, and file downloads.
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Modal,
  Backdrop,
  CircularProgress,
} from "@mui/material";
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
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  ChatwootAttachment,
  MediaModalState,
  FileCategory,
} from "../../types/attachment.types";
import {
  formatFileSize,
  getFileNameFromUrl,
  getFileExtension,
  getFileCategory,
  categorizeAttachments,
} from "../../utils/attachment.utils";

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

const ImageAttachment: React.FC<ImageAttachmentProps> = React.memo(
  ({ attachment, onPreview }) => {
    const { neutralColor } = useGomakeTheme();
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
          borderRadius: 1.5,
          overflow: "hidden",
          maxWidth: 200,
          maxHeight: 200,
          minWidth: 80,
          minHeight: 80,
          bgcolor: neutralColor(100),
          "&:hover": error ? {} : { opacity: 0.9 },
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
            <BrokenImageIcon sx={{ fontSize: 32, color: neutralColor(400) }} />
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
              maxHeight: 200,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        )}

        {!loading && !error && attachment.file_size && (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 4,
              right: 4,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              fontSize: "0.65rem",
            }}
          >
            {formatFileSize(attachment.file_size)}
          </Typography>
        )}
      </Box>
    );
  }
);

ImageAttachment.displayName = "ImageAttachment";

// ============================================================================
// Video Attachment Component
// ============================================================================

interface VideoAttachmentProps {
  attachment: ChatwootAttachment;
  onPreview: (url: string) => void;
}

const VideoAttachment: React.FC<VideoAttachmentProps> = React.memo(
  ({ attachment, onPreview }) => {
    const { neutralColor } = useGomakeTheme();
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
          borderRadius: 1.5,
          overflow: "hidden",
          maxWidth: 300,
          cursor: error ? "default" : "pointer",
          bgcolor: neutralColor(900),
          "&:hover .play-overlay": error ? {} : { bgcolor: "rgba(0,0,0,0.5)" },
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
            <VideoFileIcon sx={{ fontSize: 32, color: neutralColor(400) }} />
            <Typography variant="caption" sx={{ color: neutralColor(400) }}>
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
                borderRadius: 6,
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
                  transition: "background-color 0.2s",
                }}
              >
                <PlayCircleIcon sx={{ fontSize: 48, color: "#fff" }} />
              </Box>
            )}
          </>
        )}

        {!loading && !error && attachment.file_size && (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              bottom: 4,
              right: 4,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              fontSize: "0.65rem",
            }}
          >
            {formatFileSize(attachment.file_size)}
          </Typography>
        )}
      </Box>
    );
  }
);

VideoAttachment.displayName = "VideoAttachment";

// ============================================================================
// Audio Attachment Component
// ============================================================================

interface AudioAttachmentProps {
  attachment: ChatwootAttachment;
  isOutgoing: boolean;
}

const AudioAttachment: React.FC<AudioAttachmentProps> = React.memo(
  ({ attachment, isOutgoing }) => {
    const { neutralColor, primaryColor } = useGomakeTheme();
    const fileName = getFileNameFromUrl(attachment.data_url);

    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: isOutgoing ? primaryColor(50) : neutralColor(100),
          minWidth: 250,
          maxWidth: 300,
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
            }}
            title={fileName}
          >
            {fileName}
          </Typography>
        </Stack>
        <audio
          controls
          src={attachment.data_url}
          style={{ width: "100%", height: 36 }}
          preload="metadata"
        />
        {attachment.file_size && (
          <Typography
            variant="caption"
            sx={{ color: neutralColor(500), mt: 0.5, display: "block" }}
          >
            {formatFileSize(attachment.file_size)}
          </Typography>
        )}
      </Box>
    );
  }
);

AudioAttachment.displayName = "AudioAttachment";

// ============================================================================
// File Attachment Component
// ============================================================================

interface FileAttachmentProps {
  attachment: ChatwootAttachment;
  isOutgoing: boolean;
}

const FileAttachment: React.FC<FileAttachmentProps> = React.memo(
  ({ attachment, isOutgoing }) => {
    const { neutralColor, primaryColor } = useGomakeTheme();
    const fileName = getFileNameFromUrl(attachment.data_url);
    const extension = getFileExtension(attachment.data_url, attachment.extension);
    const category = getFileCategory(attachment.file_type, extension);

    const handleDownload = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(attachment.data_url, "_blank", "noopener,noreferrer");
      },
      [attachment.data_url]
    );

    return (
      <Box
        component="a"
        href={attachment.data_url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.5,
          borderRadius: 1.5,
          bgcolor: isOutgoing ? primaryColor(50) : neutralColor(100),
          textDecoration: "none",
          color: "inherit",
          minWidth: 200,
          maxWidth: 280,
          "&:hover": {
            bgcolor: isOutgoing ? primaryColor(100) : neutralColor(150),
          },
        }}
      >
        {getFileIcon(category)}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={fileName}
          >
            {fileName}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {extension && (
              <Typography
                variant="caption"
                sx={{
                  color: neutralColor(600),
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                }}
              >
                {extension}
              </Typography>
            )}
            {attachment.file_size && (
              <Typography variant="caption" sx={{ color: neutralColor(500) }}>
                • {formatFileSize(attachment.file_size)}
              </Typography>
            )}
          </Stack>
        </Box>
        <IconButton
          size="small"
          onClick={handleDownload}
          sx={{
            bgcolor: neutralColor(200),
            "&:hover": { bgcolor: neutralColor(300) },
          }}
        >
          <DownloadIcon sx={{ fontSize: 18, color: neutralColor(600) }} />
        </IconButton>
      </Box>
    );
  }
);

FileAttachment.displayName = "FileAttachment";

// ============================================================================
// Media Preview Modal
// ============================================================================

interface MediaPreviewModalProps {
  open: boolean;
  onClose: () => void;
  media: MediaModalState | null;
}

const MediaPreviewModal: React.FC<MediaPreviewModalProps> = React.memo(
  ({ open, onClose, media }) => {
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
  }
);

MediaPreviewModal.displayName = "MediaPreviewModal";

// ============================================================================
// Main Message Attachments Component
// ============================================================================

interface MessageAttachmentsProps {
  attachments: ChatwootAttachment[];
  isOutgoing: boolean;
  hasContent: boolean;
}

export const MessageAttachments: React.FC<MessageAttachmentsProps> = React.memo(
  ({ attachments, isOutgoing, hasContent }) => {
    const [previewMedia, setPreviewMedia] = useState<MediaModalState | null>(null);

    // Debug: Log attachments for troubleshooting
    React.useEffect(() => {
      if (attachments.length > 0) {
        console.log("[MessageAttachments] Raw attachments:", attachments.map(a => ({
          id: a.id,
          file_type: a.file_type,
          extension: a.extension,
          data_url: a.data_url?.substring(0, 100) + '...',
          file_size: a.file_size,
        })));
      }
    }, [attachments]);

    // Categorize attachments
    const { images, videos, audios, files } = useMemo(() => {
      const result = categorizeAttachments(attachments);
      console.log("[MessageAttachments] Categorized:", {
        images: result.images.length,
        videos: result.videos.length,
        audios: result.audios.length,
        files: result.files.length,
      });
      return result;
    }, [attachments]);

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
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: hasContent ? 1.5 : 0 }}
          >
            {images.map((attachment) => (
              <ImageAttachment
                key={attachment.id}
                attachment={attachment}
                onPreview={handleImagePreview}
              />
            ))}
          </Stack>
        )}

        {/* Video Attachments */}
        {videos.length > 0 && (
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: hasContent || images.length > 0 ? 1.5 : 0 }}
          >
            {videos.map((attachment) => (
              <VideoAttachment
                key={attachment.id}
                attachment={attachment}
                onPreview={handleVideoPreview}
              />
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
              <AudioAttachment
                key={attachment.id}
                attachment={attachment}
                isOutgoing={isOutgoing}
              />
            ))}
          </Stack>
        )}

        {/* File Attachments */}
        {files.length > 0 && (
          <Stack
            spacing={1}
            sx={{
              mt:
                hasContent ||
                images.length > 0 ||
                videos.length > 0 ||
                audios.length > 0
                  ? 1.5
                  : 0,
            }}
          >
            {files.map((attachment) => (
              <FileAttachment
                key={attachment.id}
                attachment={attachment}
                isOutgoing={isOutgoing}
              />
            ))}
          </Stack>
        )}

        {/* Preview Modal */}
        <MediaPreviewModal
          open={!!previewMedia}
          onClose={handleClosePreview}
          media={previewMedia}
        />
      </>
    );
  }
);

MessageAttachments.displayName = "MessageAttachments";

export default MessageAttachments;

