import React from "react";
import { Box, Stack, Typography, Badge, Chip } from "@mui/material";
import { People as PeopleIcon, AccessTime as TimeIcon, Label as LabelIcon } from "@mui/icons-material";
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
        p: 2,
        borderBottom: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(25),
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <EmailActionButton icon={<div>←</div>} tooltip="Back to conversations" onClick={onBack} />

            <Typography
              variant="h6"
              noWrap
              sx={{
                maxWidth: 500,
                fontWeight: 600,
                color: neutralColor(900),
              }}
            >
              {safeDecodeHtml(conversation.subject)}
            </Typography>

            <Badge badgeContent={conversation.messageCount} color="primary">
              <PeopleIcon sx={{ fontSize: 20, color: neutralColor(600) }} />
            </Badge>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <EmailActionButton
              icon={conversation.isStarred ? <div>★</div> : <div>☆</div>}
              tooltip="Star conversation"
              onClick={() => onStar(conversation.id, !(conversation.isStarred || false))}
            />

            <EmailActionButton icon={<div>🖨</div>} tooltip="Print" onClick={() => onPrint(conversation)} />

            <EmailActionButton icon={<div>📁</div>} tooltip="Archive" onClick={() => onArchive(conversation.id)} />

            <EmailActionButton icon={<div>🗑</div>} tooltip="Delete" onClick={() => onDelete(conversation.id)} />
          </Stack>
        </Stack>

        {/* Labels and Metadata */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            {conversation.labels?.map((label) => (
              <Chip
                key={label}
                label={label}
                size="small"
                icon={<LabelIcon sx={{ fontSize: 14 }} />}
                sx={{
                  height: 22,
                  fontSize: "0.75rem",
                  backgroundColor: alpha(primaryColor(100), 0.7),
                  color: primaryColor(700),
                  borderColor: primaryColor(300),
                }}
              />
            ))}

            <Typography variant="caption" sx={{ color: neutralColor(500), ml: 1 }}>
              <TimeIcon sx={{ fontSize: 14, verticalAlign: "middle", mr: 0.5 }} />
              {safeFormatDate(conversation.date)}
            </Typography>
          </Stack>

          {!showInlineReply && (
            <Stack direction="row" spacing={1}>
              <EmailActionButton icon={<div>↩</div>} tooltip="Reply" variant="button" onClick={onReply}>
                Reply
              </EmailActionButton>

              <EmailActionButton icon={<div>↩↩</div>} tooltip="Reply All" variant="button" onClick={onReplyAll}>
                Reply All
              </EmailActionButton>

              <EmailActionButton icon={<div>↪</div>} tooltip="Forward" variant="button" onClick={() => onForward(conversation)}>
                Forward
              </EmailActionButton>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
