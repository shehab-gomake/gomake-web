import React from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
  Chip,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Email as EmailIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AttachFile as AttachIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailConversation, EmailLabel } from "../types/email.types";
import { safeDecodeHtml } from "../utils/html-decode";
import { formatConversationDate } from "../utils/date-utils";

interface EmailConversationListProps {
  conversations: EmailConversation[];
  selectedConversationId?: string;
  onConversationSelect: (conversation: EmailConversation) => void;
  loading?: boolean;
  error?: string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  selectedLabel?: EmailLabel | null;
}

export const EmailConversationList: React.FC<EmailConversationListProps> = ({
  conversations,
  selectedConversationId,
  onConversationSelect,
  loading = false,
  error,
  hasMore = false,
  onLoadMore,
  onRefresh,
  selectedLabel,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const theme = useTheme();

  const formatDate = formatConversationDate;

  const getAvatarColor = (email: string) => {
    const colors = [primaryColor(500), "#388e3c", "#f57c00", "#7b1fa2", "#c62828", "#1976d2"];
    const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const ConversationListItem: React.FC<{ conversation: EmailConversation }> = ({ conversation }) => {
    const isSelected = conversation.id === selectedConversationId;

    return (
      <ListItem
        disablePadding
        sx={{
          borderRadius: 1,
          mb: 0.5,
          mx: 1,
        }}
      >
        <ListItemButton
          selected={isSelected}
          onClick={() => onConversationSelect(conversation)}
          sx={{
            borderRadius: 1,
            py: 1.5,
            px: 2,
            flexDirection: "column",
            alignItems: "stretch",
            "&.Mui-selected": {
              backgroundColor: alpha(primaryColor(100), 0.8),
              borderLeft: `3px solid ${primaryColor(500)}`,
              "&:hover": {
                backgroundColor: alpha(primaryColor(100), 0.9),
              },
            },
            "&:hover": {
              backgroundColor: alpha(neutralColor(100), 0.5),
            },
          }}
        >
          <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ width: "100%" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.75rem",
                backgroundColor: getAvatarColor(conversation.participants[0] || ""),
                color: "white",
                fontWeight: 600,
                mt: 0.5,
              }}
            >
              {conversation.participants[0]?.[0]?.toUpperCase() || "?"}
            </Avatar>

            <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
              {/* Header row */}
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: conversation.isRead ? 500 : 700,
                    color: isSelected ? primaryColor(700) : neutralColor(800),
                    fontSize: "0.875rem",
                  }}
                  noWrap
                >
                  {conversation.participants.join(", ")}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {conversation.hasAttachments && <AttachIcon sx={{ fontSize: 12, color: neutralColor(500) }} />}
                  {conversation.isStarred && <StarIcon sx={{ fontSize: 14, color: "warning.main" }} />}
                  <Typography
                    variant="caption"
                    sx={{
                      color: isSelected ? primaryColor(600) : neutralColor(500),
                      fontSize: "0.7rem",
                    }}
                  >
                    {formatDate(conversation.date)}
                  </Typography>
                </Stack>
              </Stack>

              {/* Subject */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: conversation.isRead ? 400 : 600,
                  color: isSelected ? primaryColor(700) : neutralColor(700),
                  fontSize: "0.875rem",
                }}
                noWrap
              >
                {safeDecodeHtml(conversation.subject)}
              </Typography>

              {/* Snippet */}
              <Typography
                variant="body2"
                sx={{
                  color: isSelected ? primaryColor(600) : neutralColor(500),
                  fontSize: "0.8rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.3,
                }}
              >
                {safeDecodeHtml(conversation.snippet)}
              </Typography>

              {/* Labels */}
              {conversation.labels && conversation.labels.length > 0 && (
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                  {conversation.labels.slice(0, 2).map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: "0.65rem",
                        backgroundColor: alpha(primaryColor(100), 0.7),
                        color: primaryColor(700),
                        "& .MuiChip-label": { px: 0.5 },
                      }}
                    />
                  ))}
                  {conversation.labels.length > 2 && (
                    <Typography variant="caption" sx={{ color: neutralColor(500) }}>
                      +{conversation.labels.length - 2}
                    </Typography>
                  )}
                </Stack>
              )}
            </Stack>

            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <Badge
                badgeContent={conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.65rem",
                    height: 16,
                    minWidth: 16,
                  },
                }}
              />
            )}
          </Stack>
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${neutralColor(200)}`,
          backgroundColor: neutralColor(25),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: neutralColor(900),
              fontSize: "1rem",
            }}
          >
            {selectedLabel ? selectedLabel.name : "Conversations"}
          </Typography>

          {onRefresh && (
            <Button
              size="small"
              onClick={onRefresh}
              startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: neutralColor(600),
                "&:hover": {
                  color: primaryColor(600),
                  backgroundColor: alpha(primaryColor(100), 0.5),
                },
              }}
            >
              Refresh
            </Button>
          )}
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <CircularProgress size={32} />
            <Typography variant="body2" sx={{ color: neutralColor(600), mt: 2 }}>
              Loading conversations...
            </Typography>
          </Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <EmailIcon sx={{ fontSize: 48, color: neutralColor(400), mb: 2 }} />
            <Typography variant="h6" sx={{ color: neutralColor(600), mb: 1 }}>
              {selectedLabel ? `No messages in ${selectedLabel.name}` : "No conversations"}
            </Typography>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              {selectedLabel ? `No messages found in ${selectedLabel.name}` : "No messages found for this account"}
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 1 }}>
            {conversations.map((conversation) => (
              <ConversationListItem key={conversation.id} conversation={conversation} />
            ))}

            {hasMore && onLoadMore && (
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onLoadMore}
                  sx={{
                    borderColor: neutralColor(300),
                    color: neutralColor(700),
                    "&:hover": {
                      borderColor: primaryColor(300),
                      backgroundColor: alpha(primaryColor(100), 0.5),
                    },
                  }}
                >
                  Load More
                </Button>
              </Box>
            )}
          </List>
        )}
      </Box>
    </Paper>
  );
};
