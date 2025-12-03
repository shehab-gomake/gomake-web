import React from "react";
import { Box, Typography, Button, Stack, useTheme, alpha } from "@mui/material";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";

interface NoMessagesEmptyStateProps {
  /**
   * Whether this is a new conversation (no messages yet)
   */
  isNewConversation?: boolean;

  /**
   * Callback when "Start Conversation" button is clicked
   */
  onStartConversation?: () => void;

  /**
   * Contact name (if available)
   */
  contactName?: string;
}

/**
 * Empty state component for when no messages are in a conversation
 *
 * Displays different messages for new conversations vs conversations
 * where messages failed to load.
 *
 * @example
 * ```tsx
 * {messages.length === 0 && !loading && (
 *   <NoMessagesEmptyState
 *     isNewConversation={true}
 *     contactName={conversation.contact?.name}
 *     onStartConversation={() => composerRef.current?.focus()}
 *   />
 * )}
 * ```
 */
export const NoMessagesEmptyState: React.FC<NoMessagesEmptyStateProps> = ({
  isNewConversation = false,
  onStartConversation,
  contactName,
}) => {
  const theme = useTheme();

  const getMessage = () => {
    if (isNewConversation) {
      return {
        title: contactName ? `Start a conversation with ${contactName}` : "Start a new conversation",
        description: "Send the first message to begin this conversation. Your message will be delivered via the selected channel.",
      };
    }

    return {
      title: "No messages yet",
      description: "This conversation doesn't have any messages. There may have been an issue loading them.",
    };
  };

  const { title, description } = getMessage();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: 4,
        textAlign: "center",
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <ChatBubbleOutlineIcon
          sx={{
            fontSize: 56,
            color: alpha(theme.palette.primary.main, 0.4),
          }}
        />
      </Box>

      {/* Text Content */}
      <Stack spacing={1} sx={{ mb: 3, maxWidth: 400 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: colorTokens.neutral[900],
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Stack>

      {/* Actions */}
      {isNewConversation && onStartConversation && (
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={onStartConversation}
          sx={{
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Start Conversation
        </Button>
      )}
    </Box>
  );
};
