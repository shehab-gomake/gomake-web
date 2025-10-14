import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { MessageItem } from "./MessageItem";
import { UnifiedMessage } from "@/widgets/frontdesk/utils/message-transformer";

interface ConversationMessageListProps {
  messages: UnifiedMessage[];
  variant?: "email" | "ticket";
  loading?: boolean;
  accountId?: string; // For email attachments
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

/**
 * Reusable conversation message list component.
 *
 * Features:
 * - Renders list of unified messages
 * - Handles loading and empty states
 * - Supports both email and ticket variants
 * - Clean, consistent UI
 *
 * Usage:
 * ```tsx
 * <ConversationMessageList
 *   messages={unifiedMessages}
 *   variant="ticket"
 *   loading={isLoading}
 * />
 * ```
 */
export const ConversationMessageList: React.FC<ConversationMessageListProps> = ({
  messages,
  variant = "email",
  loading = false,
  accountId,
  emptyStateTitle = "No messages yet",
  emptyStateDescription = "Messages will appear here",
}) => {
  const { neutralColor } = useGomakeTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 8,
        }}
      >
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ color: neutralColor(600) }}>
          Loading messages...
        </Typography>
      </Box>
    );
  }

  if (messages.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          p: 8,
        }}
      >
        <Typography variant="body2" sx={{ color: neutralColor(600), mb: 1, fontWeight: 500 }}>
          {emptyStateTitle}
        </Typography>
        <Typography variant="caption" sx={{ color: neutralColor(500) }}>
          {emptyStateDescription}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          variant={variant}
          accountId={accountId}
          isLast={index === messages.length - 1}
        />
      ))}
    </Box>
  );
};
