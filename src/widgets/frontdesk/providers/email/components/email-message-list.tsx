import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Skeleton,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AttachFile as AttachIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";
import { EmailMessage } from "../types/email.types";
import { format, isToday, isYesterday } from "date-fns";

interface EmailMessageListProps {
  messages: EmailMessage[];
  selectedId?: string;
  loading?: boolean;
  hasMore?: boolean;
  onSelect: (message: EmailMessage) => void;
  onLoadMore?: () => void;
  onStar?: (messageId: string, starred: boolean) => void;
  onDelete?: (messageId: string) => void;
  onArchive?: (messageId: string) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, "h:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMM d");
  }
};

const MessageSkeleton = () => (
  <ListItem sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
    <ListItemButton sx={{ py: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" width="100%">
        <Skeleton variant="circular" width={40} height={40} />
        <Stack flex={1} spacing={0.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="10%" />
          </Stack>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="80%" />
        </Stack>
      </Stack>
    </ListItemButton>
  </ListItem>
);

export const EmailMessageList: React.FC<EmailMessageListProps> = ({
  messages,
  selectedId,
  loading,
  hasMore,
  onSelect,
  onLoadMore,
  onStar,
  onDelete,
  onArchive,
}) => {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.2 &&
      hasMore &&
      !loading &&
      onLoadMore
    ) {
      onLoadMore();
    }
  };

  if (loading && (!messages || messages.length === 0)) {
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
        <List sx={{ flex: 1, overflow: "auto" }}>
          {[...Array(5)].map((_, i) => (
            <MessageSkeleton key={i} />
          ))}
        </List>
      </Paper>
    );
  }

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
      <Box
        sx={{ flex: 1, overflow: "auto" }}
        onScroll={handleScroll}
      >
        <List sx={{ p: 0 }}>
          {messages?.map((message) => {
          const isSelected = message.id === selectedId;
          const isUnread = !message.isRead;

          return (
            <ListItem
              key={message.id}
              disablePadding
              sx={{
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: isSelected ? "action.selected" : "transparent",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemButton
                onClick={() => onSelect(message)}
                sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover .email-actions": {
                    opacity: 1,
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" width="100%">
                  {/* Avatar */}
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "primary.light",
                      fontSize: "1rem",
                    }}
                  >
                    {message.from.name
                      ? message.from.name[0].toUpperCase()
                      : message.from.email[0].toUpperCase()}
                  </Avatar>

                  {/* Message Content */}
                  <Stack flex={1} spacing={0.25}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="body2"
                          fontWeight={isUnread ? 600 : 400}
                          noWrap
                        >
                          {message.from.name || message.from.email}
                        </Typography>
                        {message.labels?.map((label) => (
                          <Chip
                            key={label}
                            label={label}
                            size="small"
                            sx={{ height: 16, fontSize: "0.65rem" }}
                          />
                        ))}
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ minWidth: 60, textAlign: "right" }}
                        >
                          {formatDate(message.createdAt)}
                        </Typography>
                        <Box
                          className="email-actions"
                          sx={{
                            display: "flex",
                            gap: 0.5,
                            opacity: { xs: 1, md: 0 },
                            transition: "opacity 0.2s",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStar?.(message.id, !message.isStarred);
                            }}
                          >
                            {message.isStarred ? (
                              <StarIcon sx={{ fontSize: 18, color: "warning.main" }} />
                            ) : (
                              <StarBorderIcon sx={{ fontSize: 18 }} />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchive?.(message.id);
                            }}
                          >
                            <ArchiveIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete?.(message.id);
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </Stack>
                    </Stack>

                    <Typography
                      variant="body2"
                      fontWeight={isUnread ? 600 : 400}
                      noWrap
                    >
                      {message.subject}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      {message.hasAttachments && (
                        <AttachIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                      )}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ flex: 1 }}
                      >
                        {message.snippet}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </ListItemButton>
            </ListItem>
          );
        })}

        {loading && messages && messages.length > 0 && (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && (!messages || messages.length === 0) && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No messages found
            </Typography>
          </Box>
        )}
        </List>
      </Box>
    </Paper>
  );
};