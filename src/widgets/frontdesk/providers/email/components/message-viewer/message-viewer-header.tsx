import React, { useState } from "react";
import { Box, Stack, Typography, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  AccessTime as TimeIcon,
  ArrowBack as BackIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Print as PrintIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  ReplyAll as ReplyAllIcon,
  Forward as ForwardIcon,
  MoreVert as MoreIcon,
  ConfirmationNumber as TicketIcon,
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { EmailConversation } from "../../types/email.types";
import { safeDecodeHtml } from "../../utils/html-decode";
import { safeFormatDate } from "@/widgets/frontdesk/utils";
import { EmailActionButton } from "../ui/email-action-button";

interface MessageViewerHeaderProps {
  conversation: EmailConversation;
  emailAccountId?: string;
  onBack: () => void;
  onStar: (conversationId: string, starred: boolean) => void;
  onPrint: (conversation: EmailConversation) => void;
  onArchive: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onReply: () => void;
  onReplyAll: () => void;
  onForward: (conversation: EmailConversation) => void;
  onCreateTicket?: (conversationId: string, emailAccountId?: string) => void;
  showInlineReply: boolean;
}

export const MessageViewerHeader: React.FC<MessageViewerHeaderProps> = ({
  conversation,
  emailAccountId,
  onBack,
  onStar,
  onPrint,
  onArchive,
  onDelete,
  onReply,
  onReplyAll,
  onForward,
  onCreateTicket,
  showInlineReply,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMoreActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreActionsButtonClick = () => {
    // Get the button element that was clicked
    const buttonElement = document.activeElement as HTMLElement;
    if (buttonElement) {
      setAnchorEl(buttonElement);
    }
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
        backgroundColor: neutralColor(25),
      }}
    >
      <Stack spacing={2}>
        {/* Main Header Row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {/* Left Side: Back Button + Subject + Date */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            <EmailActionButton icon={<BackIcon sx={{ fontSize: 20 }} />} tooltip="Back to conversations" onClick={onBack} />

            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: neutralColor(900),
                  lineHeight: 1.3,
                  mb: 0.5,
                }}
              >
                {safeDecodeHtml(conversation.subject)}
              </Typography>

              {/* Date */}
              <Typography
                variant="caption"
                sx={{
                  color: neutralColor(500),
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <TimeIcon sx={{ fontSize: 14 }} />
                {safeFormatDate(conversation.date)}
              </Typography>
            </Stack>
          </Stack>

          {/* Right Side: Action Buttons */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Reply Actions - More compact design */}
            {!showInlineReply && (
              <Stack direction="row" spacing={0.5} sx={{ mr: 2 }}>
                <EmailActionButton icon={<ReplyIcon sx={{ fontSize: 18 }} />} tooltip="Reply" onClick={onReply} />
                <EmailActionButton icon={<ReplyAllIcon sx={{ fontSize: 18 }} />} tooltip="Reply All" onClick={onReplyAll} />
                <EmailActionButton
                  icon={<ForwardIcon sx={{ fontSize: 18 }} />}
                  tooltip="Forward"
                  onClick={() => onForward(conversation)}
                />
              </Stack>
            )}

            {/* Secondary Actions */}
            <Stack direction="row" spacing={0.5}>
              <EmailActionButton
                icon={
                  conversation.isStarred ? (
                    <StarIcon sx={{ fontSize: 20, color: primaryColor(600) }} />
                  ) : (
                    <StarBorderIcon sx={{ fontSize: 20 }} />
                  )
                }
                tooltip={conversation.isStarred ? "Unstar conversation" : "Star conversation"}
                onClick={() => onStar(conversation.id, !(conversation.isStarred || false))}
              />

              <EmailActionButton
                icon={<MoreIcon sx={{ fontSize: 20 }} />}
                tooltip="More actions"
                onClick={handleMoreActionsButtonClick}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* More Actions Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMoreActionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 160,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        }}
      >
        {onCreateTicket && (
          <MenuItem onClick={() => handleMenuAction(() => onCreateTicket(conversation.id, emailAccountId))}>
            <ListItemIcon>
              <TicketIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText>Create Ticket</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleMenuAction(() => onPrint(conversation))}>
          <ListItemIcon>
            <PrintIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction(() => onArchive(conversation.id))}>
          <ListItemIcon>
            <ArchiveIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction(() => onDelete(conversation.id))} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <DeleteIcon sx={{ fontSize: 20, color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
