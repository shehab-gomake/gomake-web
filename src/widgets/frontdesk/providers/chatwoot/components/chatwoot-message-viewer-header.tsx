import React, { useState } from "react";
import { Box, Stack, Typography, Menu, MenuItem, ListItemIcon, ListItemText, IconButton, Tooltip, Button } from "@mui/material";
import {
  ArrowBack as BackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Print as PrintIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { formatMessageDate } from "@/widgets/frontdesk/utils";
import { useRecoilValue } from "recoil";
import { chatwootProfileAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";

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
  onSearch?: () => void;
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
  onSearch,
  isStarred = false,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reopenMenuAnchor, setReopenMenuAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const reopenMenuOpen = Boolean(reopenMenuAnchor);
  const profile = useRecoilValue(chatwootProfileAtom);

  if (!conversation) return null;

  const sender = conversation.meta?.sender;
  const senderName = sender?.name || sender?.email || "Unknown";
  const senderEmail = sender?.email || "";

  // Get current user display name (from profile)
  const currentUserName = profile?.name || profile?.available_name || profile?.email || "";
  const userNameInitials = currentUserName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

  const handleReopenMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setReopenMenuAnchor(event.currentTarget);
  };

  const handleReopenMenuClose = () => {
    setReopenMenuAnchor(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMoreActionsClose();
  };

  const handleReopenClick = () => {
    if (onReopen) {
      onReopen();
    }
    handleReopenMenuClose();
  };

  const isResolved = conversation.status === "resolved";

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(0), // Light background
      }}
    >
      <Stack spacing={1.5}>
        {/* Top Row: User Display and Actions */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Left: Current User Name */}
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 500, 
              color: neutralColor(800),
              fontSize: "0.875rem",
            }}
          >
            {currentUserName || "User"}
          </Typography>

          {/* Right: Action Buttons */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            {/* Reopen Button (only when resolved) */}
            {isResolved && onReopen && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleReopenMenuClick}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    textTransform: "none",
                    borderColor: neutralColor(300),
                    color: neutralColor(700),
                    fontSize: "0.75rem",
                    px: 1.5,
                    py: 0.5,
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: neutralColor(50),
                      borderColor: neutralColor(400),
                    },
                  }}
                >
                  Reopen
                </Button>
                <Menu
                  anchorEl={reopenMenuAnchor}
                  open={reopenMenuOpen}
                  onClose={handleReopenMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleReopenClick}>
                    <ListItemText>Reopen Conversation</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Search Icon */}
            {onSearch && (
              <Tooltip title="Search">
                <IconButton
                  size="small"
                  onClick={onSearch}
                  sx={{
                    color: neutralColor(600),
                    "&:hover": {
                      backgroundColor: neutralColor(100),
                      color: primaryColor(600),
                    },
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {/* More Actions */}
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
                <MoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

      </Stack>

      {/* More Actions Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleMoreActionsClose}>
        {onStar && (
          <MenuItem onClick={() => handleMenuAction(onStar)}>
            <ListItemIcon>
              {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText>{isStarred ? "Unstar" : "Star"}</ListItemText>
          </MenuItem>
        )}
        {onReply && (
          <MenuItem onClick={() => handleMenuAction(onReply)}>
            <ListItemIcon>
              <ReplyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reply</ListItemText>
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

