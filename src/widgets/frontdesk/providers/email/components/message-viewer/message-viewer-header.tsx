import React from "react";
import { Box, Stack, Typography, Badge, Chip, Divider } from "@mui/material";
import {
  People as PeopleIcon,
  AccessTime as TimeIcon,
  Label as LabelIcon,
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
} from "@mui/icons-material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { alpha } from "@mui/material";
import { EmailConversation } from "../../types/email.types";
import { safeDecodeHtml } from "../../utils/html-decode";
import { safeFormatDate } from "../../utils/date-utils";
import { EmailActionButton } from "../ui/email-action-button";

interface MessageViewerHeaderProps {
  conversation: EmailConversation;
  onBack: () => void;
  onStar: (conversationId: string, starred: boolean) => void;
  onPrint: (conversation: EmailConversation) => void;
  onArchive: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onReply: () => void;
  onReplyAll: () => void;
  onForward: (conversation: EmailConversation) => void;
  showInlineReply: boolean;
}

export const MessageViewerHeader: React.FC<MessageViewerHeaderProps> = ({
  conversation,
  onBack,
  onStar,
  onPrint,
  onArchive,
  onDelete,
  onReply,
  onReplyAll,
  onForward,
  showInlineReply,
}) => {
  const { primaryColor, neutralColor } = useGomakeTheme();

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
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          {/* Left Side: Back Button + Subject */}
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

              {/* Participants Badge */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Badge badgeContent={conversation.messageCount} color="primary">
                  <PeopleIcon sx={{ fontSize: 18, color: neutralColor(600) }} />
                </Badge>
                <Typography variant="caption" sx={{ color: neutralColor(500) }}>
                  {conversation.participants.length} participant{conversation.participants.length !== 1 ? "s" : ""}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Right Side: Action Buttons */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Primary Actions */}
            {!showInlineReply && (
              <Stack direction="row" spacing={0.5} sx={{ mr: 2 }}>
                <EmailActionButton icon={<ReplyIcon sx={{ fontSize: 18 }} />} tooltip="Reply" variant="button" onClick={onReply}>
                  Reply
                </EmailActionButton>

                <EmailActionButton
                  icon={<ReplyAllIcon sx={{ fontSize: 18 }} />}
                  tooltip="Reply All"
                  variant="button"
                  onClick={onReplyAll}
                >
                  Reply All
                </EmailActionButton>

                <EmailActionButton
                  icon={<ForwardIcon sx={{ fontSize: 18 }} />}
                  tooltip="Forward"
                  variant="button"
                  onClick={() => onForward(conversation)}
                >
                  Forward
                </EmailActionButton>
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
                icon={<PrintIcon sx={{ fontSize: 20 }} />}
                tooltip="Print"
                onClick={() => onPrint(conversation)}
              />

              <EmailActionButton
                icon={<ArchiveIcon sx={{ fontSize: 20 }} />}
                tooltip="Archive"
                onClick={() => onArchive(conversation.id)}
              />

              <EmailActionButton
                icon={<DeleteIcon sx={{ fontSize: 20 }} />}
                tooltip="Delete"
                onClick={() => onDelete(conversation.id)}
              />
            </Stack>
          </Stack>
        </Stack>

        {/* Status Tags and Metadata Row */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
            {/* Status Tags */}
            {conversation.labels?.map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                icon={<LabelIcon sx={{ fontSize: 14 }} />}
                sx={{
                  height: 24,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  backgroundColor: alpha(primaryColor(100), 0.8),
                  color: primaryColor(700),
                  border: `1px solid ${alpha(primaryColor(300), 0.5)}`,
                  borderRadius: 2,
                  "& .MuiChip-icon": {
                    color: primaryColor(600),
                  },
                }}
              />
            ))}

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
      </Stack>
    </Box>
  );
};
