import React, { useState } from "react";
import { Box, Stack, Typography, Menu, MenuItem, ListItemIcon, ListItemText, IconButton, Tooltip } from "@mui/material";
import {
  ArrowBack as BackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Print as PrintIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate } from "@/widgets/frontdesk/utils";

interface ChatwootMessageViewerHeaderProps {
  conversation: ChatwootConversation | null;
  accountId?: number;
  onBack: () => void;
  onReply?: () => void;
  onReopen?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onStar?: () => void;
  onPrint?: () => void;
  isStarred?: boolean;
}

export const ChatwootMessageViewerHeader: React.FC<ChatwootMessageViewerHeaderProps> = ({
  conversation,
  accountId,
  onBack,
  onReply,
  onReopen,
  onArchive,
  onDelete,
  onStar,
  onPrint,
  isStarred = false,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (!conversation) return null;

  const sender = conversation.meta?.sender;
  const senderName = sender?.name || sender?.email || "Unknown";
  const senderEmail = sender?.email || "";

  // Format conversation date
  const conversationDate = conversation.updated_at || conversation.created_at || conversation.timestamp
    ? formatMessageDate(
        conversation.updated_at
          ? new Date(conversation.updated_at * 1000).toISOString()
          : conversation.created_at
          ? new Date(conversation.created_at * 1000).toISOString()
          : conversation.timestamp
      )
    : "";

  const handleMoreActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreActionsClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMoreActionsClose();
  };

  return (
    <Box
      sx={{
        p: 3,
        borderBottom: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(0), // Light background
      }}
    >
      <Stack spacing={2}>
        {/* Top Row: Back Button and Subject/Title */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Tooltip title="Back">
            <IconButton
              onClick={onBack}
              size="small"
              sx={{
                color: neutralColor(600),
                "&:hover": {
                  backgroundColor: neutralColor(100),
                  color: primaryColor(600),
                },
              }}
            >
              <BackIcon />
            </IconButton>
          </Tooltip>

          <Stack flex={1} spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: neutralColor(800) }}>
              {senderName}
            </Typography>
            {senderEmail && (
              <Typography variant="body2" sx={{ color: neutralColor(600) }}>
                {senderEmail}
              </Typography>
            )}
          </Stack>

          {/* Right Side: Action Buttons */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            {onReply && (
              <Tooltip title="Reply">
                <IconButton
                  size="small"
                  onClick={onReply}
                  sx={{
                    color: neutralColor(600),
                    "&:hover": {
                      backgroundColor: neutralColor(100),
                      color: primaryColor(600),
                    },
                  }}
                >
                  <ReplyIcon />
                </IconButton>
              </Tooltip>
            )}

            {onStar && (
              <Tooltip title={isStarred ? "Unstar" : "Star"}>
                <IconButton
                  size="small"
                  onClick={onStar}
                  sx={{
                    color: isStarred ? primaryColor(600) : neutralColor(600),
                    "&:hover": {
                      backgroundColor: neutralColor(100),
                      color: primaryColor(600),
                    },
                  }}
                >
                  {isStarred ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="More actions">
              <IconButton
                size="small"
                onClick={handleMoreActionsClick}
                sx={{
                  color: neutralColor(600),
                  "&:hover": {
                    backgroundColor: neutralColor(100),
                    color: primaryColor(600),
                  },
                }}
              >
                <MoreIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Conversation Metadata */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" sx={{ color: neutralColor(500) }}>
            {conversationDate}
          </Typography>
          {conversation.status && (
            <Typography variant="caption" sx={{ color: neutralColor(500) }}>
              Status: {conversation.status}
            </Typography>
          )}
          {conversation.priority && (
            <Typography variant="caption" sx={{ color: neutralColor(500) }}>
              Priority: {conversation.priority}
            </Typography>
          )}
        </Stack>
      </Stack>

      {/* More Actions Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMoreActionsClose}>
        {onReopen && conversation.status === "resolved" && (
          <MenuItem onClick={() => handleMenuAction(onReopen)}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reopen</ListItemText>
          </MenuItem>
        )}
        {onArchive && (
          <MenuItem onClick={() => handleMenuAction(onArchive)}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Archive</ListItemText>
          </MenuItem>
        )}
        {onPrint && (
          <MenuItem onClick={() => handleMenuAction(onPrint)}>
            <ListItemIcon>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Print</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem
            onClick={() => handleMenuAction(onDelete)}
            sx={{
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.light",
                color: "error.dark",
              },
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

