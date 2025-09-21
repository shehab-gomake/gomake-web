import React from "react";
import { ListItem, ListItemButton, Stack, Typography, Avatar } from "@mui/material";
import { AttachFile as AttachIcon, Star as StarIcon } from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { EmailConversation } from "../../types/email.types";
import { safeDecodeHtml } from "../../utils/html-decode";
import { formatConversationDate } from "../../utils/date-utils";
import { getAvatarColor, getEmailInitials } from "../../utils/avatar-utils";
import { getConversationListItemStyles, getEmailTypographyStyles } from "../../utils/styling-utils";
import { EmailBadge } from "../ui/email-badge";

interface ConversationListItemProps {
  conversation: EmailConversation;
  isSelected: boolean;
  onSelect: (conversation: EmailConversation) => void;
  onParticipantHover: (email: string, element: HTMLElement) => void;
  onParticipantLeave: () => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onParticipantHover,
  onParticipantLeave,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const styles = getConversationListItemStyles(primaryColor, neutralColor);
  const typographyStyles = getEmailTypographyStyles(primaryColor, neutralColor);

  const avatarColor = getAvatarColor(conversation.participants[0] || "", primaryColor);
  const initials = getEmailInitials(conversation.participants[0] || "");

  return (
    <ListItem disablePadding sx={{ borderRadius: 1, mb: 0.5, mx: 1 }}>
      <ListItemButton selected={isSelected} onClick={() => onSelect(conversation)} sx={styles}>
        <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ width: "100%" }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.75rem",
              backgroundColor: avatarColor,
              color: "white",
              fontWeight: 600,
              mt: 0.5,
            }}
          >
            {initials}
          </Avatar>

          <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
            {/* Header row - Subject */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography
                variant="body2"
                sx={{
                  ...typographyStyles.participant,
                  fontWeight: conversation.isRead ? 400 : 600,
                  color: isSelected ? primaryColor(700) : neutralColor(700),
                }}
                noWrap
              >
                {safeDecodeHtml(conversation.subject)}
              </Typography>

              <Stack direction="row" alignItems="center" spacing={0.5}>
                {conversation.hasAttachments && <AttachIcon sx={{ fontSize: 12, color: neutralColor(500) }} />}
                {conversation.isStarred && <StarIcon sx={{ fontSize: 14, color: "warning.main" }} />}
                <Typography
                  variant="caption"
                  sx={{
                    ...typographyStyles.timestamp,
                    color: isSelected ? primaryColor(600) : neutralColor(500),
                  }}
                >
                  {formatConversationDate(conversation.date)}
                </Typography>
              </Stack>
            </Stack>

            {/* Participants */}
            <Typography
              variant="body2"
              sx={{
                ...typographyStyles.participant,
                fontWeight: conversation.isRead ? 500 : 700,
                color: isSelected ? primaryColor(700) : neutralColor(800),
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              noWrap
              onMouseEnter={(e) => {
                onParticipantHover(conversation.participants[0], e.currentTarget);
              }}
              onMouseLeave={onParticipantLeave}
            >
              {conversation.participants.length <= 1
                ? conversation.participants.join(", ")
                : `${conversation.participants.slice(0, 1).join(", ")} +${conversation.participants.length - 1} more`}
            </Typography>

            {/* Snippet */}
            <Typography
              variant="body2"
              sx={{
                ...typographyStyles.snippet,
                color: isSelected ? primaryColor(600) : neutralColor(500),
              }}
            >
              {safeDecodeHtml(conversation.snippet)}
            </Typography>
          </Stack>

          {conversation.unreadCount && conversation.unreadCount > 0 && (
            <EmailBadge count={conversation.unreadCount}>
              <div />
            </EmailBadge>
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
};
