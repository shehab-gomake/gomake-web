import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootMessageViewerHeader } from "./chatwoot-message-viewer-header";
import { ChatwootMessageItem } from "./chatwoot-message-item";
import { ChatwootResolutionStatusBar } from "./chatwoot-resolution-status-bar";
import { ChatwootReplyComposer } from "./chatwoot-reply-composer";
import { useChatwootMessages } from "../hooks/use-chatwoot-messages";
import { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootService } from "@/services/frontdesk";

interface ChatwootMessageViewerProps {
  conversation: ChatwootConversation | null;
  accountId?: number;
  onBack: () => void;
}

export const ChatwootMessageViewer: React.FC<ChatwootMessageViewerProps> = ({
  conversation,
  accountId,
  onBack,
}) => {
  const { neutralColor } = useGomakeTheme();
  const [isSending, setIsSending] = React.useState(false);

  const { messages, loading, error, refresh } = useChatwootMessages({
    conversation,
    accountId: accountId || null,
  });

  if (!conversation) {
    return (
      <PanelContent padding="lg">
        <EmptyState
          title="No conversation selected"
          description="Choose a conversation from the list to start viewing messages"
        />
      </PanelContent>
    );
  }

  const handleReopen = async () => {
    if (!accountId || !conversation.id) return;
    try {
      await chatwootService.conversations.toggleConversationStatus(accountId, conversation.id);
      // Refresh conversation data
      refresh();
    } catch (err) {
      console.error("Failed to reopen conversation:", err);
    }
  };

  const handleArchive = () => {
    // TODO: Implement archive functionality
    console.log("Archive clicked");
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete clicked");
  };

  const handleStar = () => {
    // TODO: Implement star functionality
    console.log("Star clicked");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Search clicked");
  };

  const handleSendMessage = async (
    content: string,
    isPrivate: boolean,
    recipientEmails?: { to?: string; cc?: string; bcc?: string }
  ) => {
    if (!accountId || !conversation.id) return;

    setIsSending(true);
    try {
      await chatwootService.messages.createMessage(accountId, conversation.id, {
        content,
        message_type: "outgoing",
        private: isPrivate,
        // Include email metadata if provided
        ...(recipientEmails && {
          content_attributes: {
            email: {
              to: recipientEmails.to,
              cc: recipientEmails.cc,
              bcc: recipientEmails.bcc,
            },
          },
        }),
      });

      // Refresh messages after sending
      await refresh();
    } catch (err) {
      console.error("Failed to send message:", err);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        border: `1px solid ${neutralColor(200)}`,
        borderRadius: 2,
        backgroundColor: neutralColor(0), // Light background
      }}
    >
      {/* Header */}
      <ChatwootMessageViewerHeader
        conversation={conversation}
        accountId={accountId}
        onBack={onBack}
        onReopen={handleReopen}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onStar={handleStar}
        onPrint={handlePrint}
        onSearch={handleSearch}
        isStarred={false}
      />

      {/* Resolution Status Bar */}
      <ChatwootResolutionStatusBar conversation={conversation} />

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: "auto", backgroundColor: neutralColor(0) }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(600) }}>
              Loading messages...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "error.main" }}>
              {error}
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              No messages in this conversation
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <ChatwootMessageItem
              key={message.id || index}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))
        )}
      </Box>

      {/* Reply Composer */}
      <ChatwootReplyComposer
        conversation={conversation}
        onSend={handleSendMessage}
        isSending={isSending}
      />
    </Paper>
  );
};

