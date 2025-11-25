import React, { useState } from "react";
import { Box, Stack, Typography, Avatar, Paper, Chip, IconButton, Modal, Backdrop } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
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
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { ChatwootMessage, ChatwootAttachment } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate, getAvatarColor, getEmailInitials } from "@/widgets/frontdesk/utils";
import { sanitizeHtml, isHtmlContent } from "@/widgets/frontdesk/utils/html-sanitizer";
import { ActivityBubble } from "@/widgets/frontdesk/components/shared/ActivityBubble";

/**
 * Chatwoot message types
 * Reference: Chatwoot backend enum
 */
const MESSAGE_TYPES = {
  INCOMING: 0,    // Message from contact
  OUTGOING: 1,    // Message from agent
  ACTIVITY: 2,    // System activity message (status changes, assignments, etc.)
  TEMPLATE: 3,    // Template message
} as const;

/**
 * Format file size for display
 */
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Get file name from URL
 */
const getFileNameFromUrl = (url: string): string => {
  try {
    const decoded = decodeURIComponent(url);
    const parts = decoded.split("/");
    return parts[parts.length - 1] || "File";
  } catch {
    return "File";
  }
};

/**
 * Get file extension from URL or filename
 */
const getFileExtension = (url: string, extension?: string | null): string => {
  if (extension) return extension.toLowerCase();
  const fileName = getFileNameFromUrl(url);
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

/**
 * Get appropriate icon for file type
 */
const getFileIcon = (fileType: string, extension: string) => {
  // PDF
  if (extension === "pdf") {
    return <PictureAsPdfIcon sx={{ fontSize: 28, color: "#E53935" }} />;
  }
  
  // Word documents
  if (["doc", "docx", "odt", "rtf"].includes(extension)) {
    return <DescriptionIcon sx={{ fontSize: 28, color: "#2196F3" }} />;
  }
  
  // Excel/Spreadsheets
  if (["xls", "xlsx", "csv", "ods"].includes(extension)) {
    return <TableChartIcon sx={{ fontSize: 28, color: "#4CAF50" }} />;
  }
  
  // Archives
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return <FolderZipIcon sx={{ fontSize: 28, color: "#FF9800" }} />;
  }
  
  // Audio
  if (fileType === "audio" || ["mp3", "wav", "ogg", "m4a", "aac"].includes(extension)) {
    return <AudioFileIcon sx={{ fontSize: 28, color: "#9C27B0" }} />;
  }
  
  // Video
  if (fileType === "video" || ["mp4", "mov", "avi", "mkv", "webm"].includes(extension)) {
    return <VideoFileIcon sx={{ fontSize: 28, color: "#F44336" }} />;
  }
  
  // Location
  if (fileType === "location") {
    return <LocationOnIcon sx={{ fontSize: 28, color: "#4CAF50" }} />;
  }
  
  // Contact
  if (fileType === "contact" || extension === "vcf") {
    return <ContactPageIcon sx={{ fontSize: 28, color: "#00BCD4" }} />;
  }
  
  // Default file icon
  return <InsertDriveFileIcon sx={{ fontSize: 28, color: "#607D8B" }} />;
};

/**
 * Attachment Image Preview Component
 */
interface AttachmentImageProps {
  attachment: ChatwootAttachment;
  onClick: () => void;
}

const AttachmentImage: React.FC<AttachmentImageProps> = ({ attachment, onClick }) => {
  const { neutralColor } = useGomakeTheme();
  
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        cursor: "pointer",
        borderRadius: 1.5,
        overflow: "hidden",
        maxWidth: 200,
        maxHeight: 200,
        "&:hover": {
          opacity: 0.9,
        },
      }}
    >
      <img
        src={attachment.thumb_url || attachment.data_url}
        alt="Attachment"
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: 200,
          objectFit: "cover",
          borderRadius: 6,
        }}
      />
      {attachment.file_size && (
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
};

/**
 * Audio Attachment Component with inline player
 */
interface AttachmentAudioProps {
  attachment: ChatwootAttachment;
  isOutgoing: boolean;
}

const AttachmentAudio: React.FC<AttachmentAudioProps> = ({ attachment, isOutgoing }) => {
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
        >
          {fileName}
        </Typography>
      </Stack>
      <audio
        controls
        src={attachment.data_url}
        style={{ width: "100%", height: 36 }}
      />
      {attachment.file_size && (
        <Typography variant="caption" sx={{ color: neutralColor(500), mt: 0.5, display: "block" }}>
          {formatFileSize(attachment.file_size)}
        </Typography>
      )}
    </Box>
  );
};

/**
 * Video Attachment Component with inline player
 */
interface AttachmentVideoProps {
  attachment: ChatwootAttachment;
  onClick: () => void;
}

const AttachmentVideo: React.FC<AttachmentVideoProps> = ({ attachment, onClick }) => {
  const { neutralColor } = useGomakeTheme();
  
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 1.5,
        overflow: "hidden",
        maxWidth: 300,
        cursor: "pointer",
        "&:hover .play-overlay": {
          bgcolor: "rgba(0,0,0,0.5)",
        },
      }}
      onClick={onClick}
    >
      <video
        src={attachment.data_url}
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: 200,
          borderRadius: 6,
        }}
      />
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
      {attachment.file_size && (
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
};

/**
 * Attachment File Preview Component (for documents, archives, etc.)
 */
interface AttachmentFileProps {
  attachment: ChatwootAttachment;
  isOutgoing: boolean;
}

const AttachmentFile: React.FC<AttachmentFileProps> = ({ attachment, isOutgoing }) => {
  const { neutralColor, primaryColor } = useGomakeTheme();
  const fileName = getFileNameFromUrl(attachment.data_url);
  const extension = getFileExtension(attachment.data_url, attachment.extension);
  
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
      {getFileIcon(attachment.file_type, extension)}
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
        sx={{
          bgcolor: neutralColor(200),
          "&:hover": { bgcolor: neutralColor(300) },
        }}
      >
        <DownloadIcon sx={{ fontSize: 18, color: neutralColor(600) }} />
      </IconButton>
    </Box>
  );
};

/**
 * Full-screen Media Modal (supports both images and videos)
 */
interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: "image" | "video";
}

const MediaModal: React.FC<MediaModalProps> = ({ open, onClose, mediaUrl, mediaType }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300 }}
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
            top: -40,
            right: 0,
            color: "#fff",
            bgcolor: "rgba(0,0,0,0.5)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        {mediaType === "image" ? (
          <img
            src={mediaUrl}
            alt="Full size"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        ) : (
          <video
            src={mediaUrl}
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
};

interface ChatwootMessageItemProps {
  message: ChatwootMessage;
  isLast?: boolean;
  isFirst?: boolean;
  showAvatar?: boolean; // Whether to show avatar (true if sender changed from previous message)
  previousMessage?: ChatwootMessage | null; // Previous message for grouping logic
}

export const ChatwootMessageItem: React.FC<ChatwootMessageItemProps> = ({
  message,
  isLast = false,
  isFirst = false,
  showAvatar = true,
  previousMessage = null,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);

  // Get attachments from message and categorize them
  const attachments = message.attachments || [];
  const imageAttachments = attachments.filter((a) => a.file_type === "image");
  const videoAttachments = attachments.filter((a) => a.file_type === "video");
  const audioAttachments = attachments.filter((a) => a.file_type === "audio");
  const fileAttachments = attachments.filter((a) => 
    !["image", "video", "audio"].includes(a.file_type)
  );

  // Early return for ACTIVITY messages - render as centered activity bubble
  if (message.message_type === MESSAGE_TYPES.ACTIVITY) {
    const activityContent = message.content || "";
    const timestamp = message.created_at
      ? new Date(message.created_at * 1000).toISOString()
      : undefined;

    return (
      <ActivityBubble
        content={activityContent}
        timestamp={timestamp}
        isHtml={isHtmlContent(activityContent)}
      />
    );
  }

  // Determine if message is outgoing (from agent) or incoming (from contact)
  // message_type: 0 = incoming, 1 = outgoing (or check sender_type)
  const isMe = message.message_type === 1 || message.sender_type === "User";

  // Check if message is private (support both _private and private properties)
  // The API may return either property name depending on the endpoint
  const isPrivate = message._private === true || message.private === true;

  const sender = message.sender || {
    name: isMe ? "You" : "Contact",
    email: "",
    avatar_url: undefined,
  };

  const senderEmail = sender.email || "";
  const senderName = sender.name || (isMe ? "You" : "Unknown");

  const avatarColor = getAvatarColor(senderEmail || senderName);
  const initials = getEmailInitials(senderEmail || senderName);
  const avatarInitial = senderName?.[0]?.toUpperCase() || initials?.[0]?.toUpperCase() || "?";

  // Format timestamp - Chatwoot uses Unix timestamps (seconds)
  const timestamp = message.created_at
    ? formatMessageDate(new Date(message.created_at * 1000).toISOString())
    : "";

  // Extract and process content
  // Chatwoot stores email HTML in a specific structure:
  // content_attributes.email.html_content.full (HTML version)
  // content_attributes.email.text_content.full (plain text version)
  const emailHtml = message.content_attributes?.email?.html_content?.full;
  const emailText = message.content_attributes?.email?.text_content?.full;

  // Priority: 1. email HTML, 2. email plain text, 3. regular content field
  const htmlContent = emailHtml;

  // Extract body content from full HTML documents
  // Email HTML often comes as complete documents with <html>, <head>, <body>
  // We only want the body content to avoid layout conflicts
  let rawContent = htmlContent || emailText || message.content || "";

  if (htmlContent && htmlContent.includes('<body')) {
    try {
      // Extract content between <body> tags
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch && bodyMatch[1]) {
        rawContent = bodyMatch[1];
      }
    } catch (error) {
      console.warn('[ChatwootMessageItem] Failed to extract body content:', error);
    }
  }

  // Determine if content is HTML based on content_type or content detection
  // Check for full HTML documents (like 404 pages) - these should be displayed as code blocks
  // EXCEPTION: Email messages with full HTML should be rendered, not displayed as code
  const isFullHtmlDocument = !emailHtml && (
    rawContent.trim().startsWith("<!DOCTYPE html") ||
    rawContent.trim().startsWith("<!doctype html") ||
    (rawContent.includes("<html") && rawContent.includes("<head>"))
  );

  // If we have HTML in content_attributes.email, always treat it as HTML (even if full document)
  // For emails, render the full HTML document with sanitization
  const isHtml = !isFullHtmlDocument && (
    !!htmlContent ||  // Explicit HTML content from email attributes
    message.content_type === "text/html" ||
    message.content_type === "incoming_email" ||  // Always render email HTML
    isHtmlContent(rawContent)
  );

  // For full HTML documents (non-email), treat as code/plain text to display the source
  // For email HTML or regular HTML fragments, sanitize and render
  // For plain text, use as-is
  const processedContent = isFullHtmlDocument
    ? rawContent // Display as code (404 pages, etc.)
    : isHtml && rawContent
    ? sanitizeHtml(rawContent) // Sanitize HTML fragments and email HTML
    : rawContent; // Plain text

  // Debug: Log email content structure for incoming emails
  if (message.content_type === 'incoming_email' && process.env.NODE_ENV === 'development') {
    console.log('[ChatwootMessageItem] Email rendering:', {
      id: message.id,
      has_emailHtml: !!emailHtml,
      rawContent_length: rawContent.length,
      isHtml,
      isFullHtmlDocument,
      processedContent_length: processedContent.length,
      emailHtml_preview: emailHtml?.substring(0, 200),
      processedContent_preview: processedContent?.substring(0, 200),
    });
  }

  // Determine if avatar should be shown (show if first message, or sender changed from previous)
  const shouldShowAvatar = isFirst || showAvatar ||
    (previousMessage && (
      previousMessage.sender?.id !== message.sender?.id ||
      previousMessage.message_type !== message.message_type ||
      previousMessage.sender_type !== message.sender_type
    ));

  // Check if this is an email message (has email metadata)
  const isEmailMessage = !!message.content_attributes?.email;

  // Message bubble styles matching WhatsApp
  // For private messages, use a distinctive amber/yellow background tint
  const getMessageBubbleStyles = (isOutgoing: boolean) => ({
    bgcolor: isPrivate
      ? "rgba(251, 191, 36, 0.12)" // Amber/yellow tint for private messages (more visible than neutral)
      : isOutgoing
      ? primaryColor(100)
      : neutralColor(50),
    color: isOutgoing ? primaryColor(900) : neutralColor(800),
    border: isPrivate 
      ? `1px solid rgba(251, 191, 36, 0.3)` // Amber border for private messages
      : "none",
    borderRadius: isOutgoing ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    px: 2,
    py: 1.5,
    position: "relative" as const,
    boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.08)}`,
    transition: theme.transitions.create(["box-shadow", "transform", "background-color", "border-color"], {
      duration: theme.transitions.duration.short,
    }),
    opacity: 1, // Remove opacity reduction - use background color instead
    fontStyle: "normal", // Remove italic - use background color and icon instead
    "&:hover": {
      boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.12)}`,
    },
    // HTML content styling - clean and natural
    "& p": {
      margin: 0,
      marginBottom: "0.5em",
      "&:last-child": { marginBottom: 0 },
    },
    "& a": {
      color: isOutgoing ? primaryColor(700) : primaryColor(600),
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
    "& ul, & ol": {
      paddingLeft: "20px",
      marginTop: "0.25em",
      marginBottom: "0.25em",
    },
    "& li": {
      marginBottom: "0.25em",
    },
    "& blockquote": {
      borderLeft: `3px solid ${isOutgoing ? primaryColor(300) : neutralColor(300)}`,
      paddingLeft: "12px",
      marginLeft: 0,
      marginTop: "0.5em",
      marginBottom: "0.5em",
      fontStyle: "italic",
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "8px",
      marginTop: "8px",
      marginBottom: "8px",
      display: "block",
    },
    // Remove all table borders for email tables (layout tables)
    "& table": {
      borderCollapse: "collapse",
      width: "100%",
      border: "none",
      margin: 0,
    },
    "& th, & td": {
      border: "none",
      padding: "4px",
      textAlign: "left" as const,
    },
    "& tbody, & tr": {
      border: "none",
    },
    "& th": {
      border: "none",
      backgroundColor: "transparent",
      fontWeight: "inherit",
    },
    // Email-specific styling - natural appearance
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      marginTop: "0.5em",
      marginBottom: "0.25em",
      lineHeight: 1.3,
      fontWeight: 600,
      "&:first-child": { marginTop: 0 },
    },
    "& h1": { fontSize: "1.5em" },
    "& h2": { fontSize: "1.3em" },
    "& h3": { fontSize: "1.1em" },
    "& h4, & h5, & h6": { fontSize: "1em" },
    // Preserve email styling but remove visual clutter
    "& font": {
      fontSize: "inherit",
    },
    "& center": {
      textAlign: "center",
    },
    // Clean spacing for email layout divs
    "& div": {
      margin: 0,
    },
    // Remove borders from email layout elements
    "& div[style*='border']": {
      border: "none !important",
    },
    "& table[border]": {
      border: "none !important",
    },
    "& td[style*='border'], & th[style*='border']": {
      border: "none !important",
    },
    // Better line height for readability
    lineHeight: 1.5,
  });

  const getAvatarStyles = (isOutgoing: boolean) => ({
    width: 32,
    height: 32,
    bgcolor: isOutgoing ? primaryColor(500) : avatarColor,
    color: "white",
    fontSize: "0.75rem",
    fontWeight: 600,
  });

  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent={isMe ? "flex-end" : "flex-start"}
      alignItems="flex-end"
      sx={{ mb: 0.5 }}
    >
      {!isMe && (
        <Avatar sx={getAvatarStyles(false)} src={sender.avatar_url}>
          {shouldShowAvatar ? (!sender.avatar_url && avatarInitial) : ""}
        </Avatar>
      )}

      <Stack
        maxWidth={isEmailMessage ? "85%" : "70%"}
        alignItems={isMe ? "flex-end" : "flex-start"}
        spacing={0.5}
      >
        {shouldShowAvatar && (
          <Chip
            label={isPrivate ? `🔒 ${isMe ? "You" : senderName} (Private)` : isMe ? "You" : senderName}
            size="small"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: "0.7rem",
              borderColor: isPrivate
                ? neutralColor(400)
                : isMe
                ? primaryColor(300)
                : neutralColor(300),
              color: isPrivate
                ? neutralColor(600)
                : isMe
                ? primaryColor(700)
                : neutralColor(700),
              bgcolor: "transparent",
            }}
          />
        )}

        <Paper
          elevation={0}
          sx={getMessageBubbleStyles(isMe)}
        >
          {/* Text Content */}
          {isHtml && processedContent ? (
            <Box
              dangerouslySetInnerHTML={{ __html: processedContent }}
              sx={{
                "& > *:first-of-type": { marginTop: 0 },
                "& > *:last-of-type": { marginBottom: 0 },
              }}
            />
          ) : processedContent ? (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {processedContent}
            </Typography>
          ) : attachments.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                wordBreak: "break-word",
                fontStyle: "italic",
                opacity: 0.7,
              }}
            >
              (Empty message)
            </Typography>
          ) : null}

          {/* Image Attachments */}
          {imageAttachments.length > 0 && (
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ mt: processedContent ? 1.5 : 0 }}
            >
              {imageAttachments.map((attachment) => (
                <AttachmentImage
                  key={attachment.id}
                  attachment={attachment}
                  onClick={() => setSelectedMedia({ url: attachment.data_url, type: "image" })}
                />
              ))}
            </Stack>
          )}

          {/* Video Attachments */}
          {videoAttachments.length > 0 && (
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              sx={{ mt: processedContent || imageAttachments.length > 0 ? 1.5 : 0 }}
            >
              {videoAttachments.map((attachment) => (
                <AttachmentVideo
                  key={attachment.id}
                  attachment={attachment}
                  onClick={() => setSelectedMedia({ url: attachment.data_url, type: "video" })}
                />
              ))}
            </Stack>
          )}

          {/* Audio Attachments */}
          {audioAttachments.length > 0 && (
            <Stack
              spacing={1}
              sx={{ mt: processedContent || imageAttachments.length > 0 || videoAttachments.length > 0 ? 1.5 : 0 }}
            >
              {audioAttachments.map((attachment) => (
                <AttachmentAudio
                  key={attachment.id}
                  attachment={attachment}
                  isOutgoing={isMe}
                />
              ))}
            </Stack>
          )}

          {/* File Attachments (documents, archives, etc.) */}
          {fileAttachments.length > 0 && (
            <Stack
              spacing={1}
              sx={{ mt: processedContent || imageAttachments.length > 0 || videoAttachments.length > 0 || audioAttachments.length > 0 ? 1.5 : 0 }}
            >
              {fileAttachments.map((attachment) => (
                <AttachmentFile
                  key={attachment.id}
                  attachment={attachment}
                  isOutgoing={isMe}
                />
              ))}
            </Stack>
          )}
          
          {/* Private message indicator icon - positioned at bottom right */}
          {isPrivate && (
            <Box
              sx={{
                position: "absolute",
                bottom: 4,
                right: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                color: "rgba(251, 191, 36, 0.8)", // Amber color matching the theme
              }}
            >
              <LockIcon sx={{ fontSize: 14 }} />
            </Box>
          )}
        </Paper>

        {/* Media Modal for full-size preview (images and videos) */}
        {selectedMedia && (
          <MediaModal
            open={!!selectedMedia}
            onClose={() => setSelectedMedia(null)}
            mediaUrl={selectedMedia.url}
            mediaType={selectedMedia.type}
          />
        )}

        <Typography
          variant="caption"
          sx={{
            color: neutralColor(500),
            fontSize: "0.7rem",
            px: 0.5,
          }}
        >
          {timestamp}
        </Typography>
      </Stack>

      {isMe && (
        <Avatar sx={getAvatarStyles(true)}>
          {shouldShowAvatar ? "Y" : ""}
        </Avatar>
      )}
    </Stack>
  );
};

