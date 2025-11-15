import React, { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootConversation, ConversationPriority } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { ConversationStatusSelector } from "./conversation-status-selector";
import { ConversationPrioritySelector } from "./conversation-priority-selector";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { InboxIcon } from "../utils/inbox-icons";
import { getConversationName } from "../utils/conversation-utils";

type PriorityValue =
  | ConversationPriority.URGENT
  | ConversationPriority.HIGH
  | ConversationPriority.MEDIUM
  | ConversationPriority.LOW
  | null;

interface ChatwootMessageViewerHeaderProps {
  conversation: ChatwootConversation | null;
  accountId?: number;
  onBack: () => void;
  onReopen?: () => void;
  onResolve?: () => void;
  onSnooze?: () => void;
  onMarkAsPending?: () => void;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: PriorityValue) => void;
  updating?: boolean;
  inboxes?: ChatwootInbox[];
}

export const ChatwootMessageViewerHeader: React.FC<ChatwootMessageViewerHeaderProps> = ({
  conversation,
  accountId,
  onBack,
  onReopen,
  onResolve,
  onSnooze,
  onMarkAsPending,
  onStatusChange,
  onPriorityChange,
  updating = false,
  inboxes = [],
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();

  if (!conversation) return null;

  // Get sender name from conversation using utility function
  const senderName = getConversationName(conversation);

  // Get inbox for the conversation
  const inbox = useMemo(() => {
    if (!conversation.inbox_id || !inboxes.length) {
      return null;
    }
    return inboxes.find((inbox) => inbox.id === conversation.inbox_id) || null;
  }, [conversation.inbox_id, inboxes]);

  // Convert string priority to enum value
  const getPriorityValue = (priority: string | undefined | null): PriorityValue => {
    if (!priority) return null;
    const priorityMap: Record<string, PriorityValue> = {
      [ConversationPriority.URGENT]: ConversationPriority.URGENT,
      [ConversationPriority.HIGH]: ConversationPriority.HIGH,
      [ConversationPriority.MEDIUM]: ConversationPriority.MEDIUM,
      [ConversationPriority.LOW]: ConversationPriority.LOW,
    };
    return priorityMap[priority] || null;
  };

  const currentPriority = getPriorityValue(conversation.priority);

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: neutralColor(0), // Light background
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* Left: Sender Name and Inbox Info */}
        <Stack direction="column" spacing={0.5}>
          {/* Sender Name */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              color: neutralColor(800),
              fontSize: "0.875rem",
            }}
          >
            {senderName}
          </Typography>

          {/* Inbox Name and Icon */}
          {inbox && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: neutralColor(600),
                }}
              >
                <InboxIcon channelType={inbox.channel_type} medium={inbox.medium as string | undefined} size={14} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: neutralColor(600),
                  fontSize: "0.75rem",
                }}
              >
                {inbox.name}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Right: Status and Priority Selectors */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {onStatusChange && (
            <ConversationStatusSelector
              status={conversation.status || "open"}
              onStatusChange={onStatusChange}
              updating={updating}
            />
          )}
          {onPriorityChange && (
            <ConversationPrioritySelector priority={currentPriority} onPriorityChange={onPriorityChange} updating={updating} />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
