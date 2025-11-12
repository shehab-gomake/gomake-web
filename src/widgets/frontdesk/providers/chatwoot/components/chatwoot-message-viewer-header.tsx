import React, { useState } from "react";
import { Box, Stack, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ArrowBack as BackIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AccessTime as SnoozeIcon,
  Pending as PendingIcon,
  CheckCircle as ResolveIcon,
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
  onReopen?: () => void;
  onResolve?: () => void;
  onSnooze?: () => void;
  onMarkAsPending?: () => void;
}

export const ChatwootMessageViewerHeader: React.FC<ChatwootMessageViewerHeaderProps> = ({
  conversation,
  accountId,
  onBack,
  onReopen,
  onResolve,
  onSnooze,
  onMarkAsPending,
}) => {
  const theme = useTheme();
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [reopenMenuAnchor, setReopenMenuAnchor] = useState<null | HTMLElement>(null);
  const [resolveMenuAnchor, setResolveMenuAnchor] = useState<null | HTMLElement>(null);
  const reopenMenuOpen = Boolean(reopenMenuAnchor);
  const resolveMenuOpen = Boolean(resolveMenuAnchor);
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

  const handleReopenMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setReopenMenuAnchor(event.currentTarget);
  };

  const handleReopenMenuClose = () => {
    setReopenMenuAnchor(null);
  };

  const handleReopenClick = () => {
    if (onReopen) {
      onReopen();
    }
    handleReopenMenuClose();
  };

  const handleResolveMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setResolveMenuAnchor(event.currentTarget);
  };

  const handleResolveMenuClose = () => {
    setResolveMenuAnchor(null);
  };

  const handleResolveClick = () => {
    if (onResolve) {
      onResolve();
    }
    handleResolveMenuClose();
  };

  const handleSnoozeClick = () => {
    if (onSnooze) {
      onSnooze();
    }
    handleResolveMenuClose();
  };

  const handleMarkAsPendingClick = () => {
    if (onMarkAsPending) {
      onMarkAsPending();
    }
    handleResolveMenuClose();
  };

  const isResolved = conversation.status === "resolved";
  const isOpen = conversation.status === "open";

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
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
            {/* Resolve Button with Dropdown (only when not resolved) */}
            {!isResolved && onResolve && (
              <>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleResolveMenuClick}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    textTransform: "none",
                    backgroundColor: primaryColor(600),
                    color: "white",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    px: 1.5,
                    py: 0.5,
                    minWidth: "auto",
                    "&:hover": {
                      backgroundColor: primaryColor(700),
                    },
                  }}
                >
                  Close
                </Button>
                <Menu
                  anchorEl={resolveMenuAnchor}
                  open={resolveMenuOpen}
                  onClose={handleResolveMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleResolveClick}>
                    <ListItemIcon>
                      <ResolveIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Close</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleSnoozeClick}>
                    <ListItemIcon>
                      <SnoozeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Snooze</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleMarkAsPendingClick}>
                    <ListItemIcon>
                      <PendingIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Mark as pending</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}

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
                    fontSize: "0.8125rem",
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
                    <ListItemText>Reopen Ticket</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Stack>

      </Stack>
    </Box>
  );
};

