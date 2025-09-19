import React, { useState } from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Button,
  Collapse,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Reply as ReplyIcon,
  ReplyAll as ReplyAllIcon,
  Forward as ForwardIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  MoreVert as MoreIcon,
  AttachFile as AttachIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { EmailMessage } from "../types/email.types";
import { format } from "date-fns";
import DOMPurify from "dompurify";

interface EmailMessageViewerProps {
  messages: EmailMessage[];
  onBack?: () => void;
  onReply?: (message: EmailMessage) => void;
  onReplyAll?: (message: EmailMessage) => void;
  onForward?: (message: EmailMessage) => void;
  onDelete?: (messageId: string) => void;
  onArchive?: (messageId: string) => void;
  onStar?: (messageId: string, starred: boolean) => void;
}

const MessageHeader: React.FC<{
  message: EmailMessage;
  expanded: boolean;
  onToggle: () => void;
  onStar?: () => void;
  onMoreActions?: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ message, expanded, onToggle, onStar, onMoreActions }) => {
  return (
    <Box
      sx={{
        p: 2,
        cursor: "pointer",
        "&:hover": { backgroundColor: "action.hover" },
      }}
      onClick={onToggle}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "primary.light",
          }}
        >
          {message.from.name
            ? message.from.name[0].toUpperCase()
            : message.from.email[0].toUpperCase()}
        </Avatar>

        <Stack flex={1} spacing={0.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1" fontWeight={500}>
                {message.from.name || message.from.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                &lt;{message.from.email}&gt;
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(message.createdAt), "MMM d, yyyy h:mm a")}
              </Typography>
              <IconButton size="small" onClick={(e) => {
                e.stopPropagation();
                onStar?.();
              }}>
                {message.isStarred ? (
                  <StarIcon sx={{ fontSize: 18, color: "warning.main" }} />
                ) : (
                  <StarBorderIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
              <IconButton size="small" onClick={(e) => {
                e.stopPropagation();
                onMoreActions?.(e);
              }}>
                <MoreIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small">
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Stack>
          </Stack>

          {!expanded && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {message.snippet}
            </Typography>
          )}

          {expanded && message.to.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              to {message.to.map(t => t.name || t.email).join(", ")}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export const EmailMessageViewer: React.FC<EmailMessageViewerProps> = ({
  messages,
  onBack,
  onReply,
  onReplyAll,
  onForward,
  onDelete,
  onArchive,
  onStar,
}) => {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(
    new Set([messages[messages.length - 1]?.id])
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);

  const handleToggleExpand = (messageId: string) => {
    setExpandedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleMoreActions = (event: React.MouseEvent<HTMLElement>, message: EmailMessage) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const latestMessage = messages[messages.length - 1];

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Thread Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            {onBack && (
              <IconButton onClick={onBack}>
                <BackIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap sx={{ maxWidth: 600 }}>
              {latestMessage?.subject}
            </Typography>
            {latestMessage?.labels?.map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                sx={{ height: 20 }}
              />
            ))}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              startIcon={<ReplyIcon />}
              onClick={() => onReply?.(latestMessage)}
            >
              Reply
            </Button>
            <Button
              size="small"
              startIcon={<ReplyAllIcon />}
              onClick={() => onReplyAll?.(latestMessage)}
            >
              Reply All
            </Button>
            <Button
              size="small"
              startIcon={<ForwardIcon />}
              onClick={() => onForward?.(latestMessage)}
            >
              Forward
            </Button>
            <IconButton onClick={() => onArchive?.(latestMessage.id)}>
              <ArchiveIcon />
            </IconButton>
            <IconButton onClick={() => onDelete?.(latestMessage.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Stack spacing={2}>
          {messages.map((message, index) => {
            const isExpanded = expandedMessages.has(message.id);

            return (
              <Paper
                key={message.id}
                variant="outlined"
                sx={{
                  overflow: "hidden",
                  backgroundColor: message.isRead ? "background.paper" : "action.hover",
                }}
              >
                <MessageHeader
                  message={message}
                  expanded={isExpanded}
                  onToggle={() => handleToggleExpand(message.id)}
                  onStar={() => onStar?.(message.id, !message.isStarred)}
                  onMoreActions={(e) => handleMoreActions(e, message)}
                />

                <Collapse in={isExpanded}>
                  <Divider />

                  {/* Message Body */}
                  <Box sx={{ p: 3 }}>
                    {message.html ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(message.html),
                        }}
                        style={{
                          fontFamily: "inherit",
                          fontSize: "14px",
                          lineHeight: 1.6,
                        }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {message.text}
                      </Typography>
                    )}

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Attachments ({message.attachments.length})
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                          {message.attachments.map((attachment) => (
                            <Chip
                              key={attachment.id}
                              icon={<AttachIcon />}
                              label={`${attachment.filename} (${(attachment.size / 1024).toFixed(1)} KB)`}
                              variant="outlined"
                              deleteIcon={<DownloadIcon />}
                              onDelete={() => {
                                // Handle download
                                window.open(attachment.url, "_blank");
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  {/* Quick Reply */}
                  {index === messages.length - 1 && (
                    <>
                      <Divider />
                      <Box sx={{ p: 2 }}>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<ReplyIcon />}
                            onClick={() => onReply?.(message)}
                          >
                            Reply
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ForwardIcon />}
                            onClick={() => onForward?.(message)}
                          >
                            Forward
                          </Button>
                        </Stack>
                      </Box>
                    </>
                  )}
                </Collapse>
              </Paper>
            );
          })}
        </Stack>
      </Box>

      {/* More Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => {
          // Mark as unread
          handleCloseMenu();
        }}>
          Mark as unread
        </MenuItem>
        <MenuItem onClick={() => {
          // Add label
          handleCloseMenu();
        }}>
          Add label
        </MenuItem>
        <MenuItem onClick={() => {
          // Move to folder
          handleCloseMenu();
        }}>
          Move to folder
        </MenuItem>
        <MenuItem onClick={() => {
          // Mark as spam
          handleCloseMenu();
        }}>
          Mark as spam
        </MenuItem>
      </Menu>
    </Paper>
  );
};