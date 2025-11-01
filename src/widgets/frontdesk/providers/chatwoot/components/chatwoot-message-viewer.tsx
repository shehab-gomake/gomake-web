import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootMessageViewerHeader } from "./chatwoot-message-viewer-header";
import { ChatwootMessageItem } from "./chatwoot-message-item";
import { ChatwootResolutionStatusBar } from "./chatwoot-resolution-status-bar";
import { ChatwootReplyComposer } from "./chatwoot-reply-composer";
import { useChatwootMessages } from "../hooks/use-chatwoot-messages";
import {
  ChatwootConversation,
  ConversationStatus,
} from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { chatwootService } from "@/services/frontdesk";

interface ChatwootMessageViewerProps {
  conversation: ChatwootConversation | null;
  accountId?: number;
  onBack: () => void;
  onConversationUpdate?: (updatedConversation: ChatwootConversation) => void;
  currentStatusFilter?: ConversationStatus;
}

export const ChatwootMessageViewer: React.FC<ChatwootMessageViewerProps> = ({
  conversation,
  accountId,
  onBack,
  onConversationUpdate,
  currentStatusFilter,
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

  // Helper to update conversation after status change (similar to Vue store.dispatch('toggleStatus'))
  const handleStatusChange = async (newStatus: string) => {
    if (!accountId || !conversation.id) return;
    
    try {
      // Update conversation via API
      const response = await chatwootService.conversations.updateConversation(accountId, conversation.id, {
        status: newStatus,
      });
      
      // Get updated conversation from response
      const updatedConversation = response.data?.payload || response.data || conversation;
      const finalConversation = {
        ...conversation,
        ...updatedConversation,
        status: newStatus,
      };
      
      // Update in list (similar to Vue: commit(types.CHANGE_CONVERSATION_STATUS))
      if (onConversationUpdate) {
        onConversationUpdate(finalConversation);
      }
      
      // Refresh messages
      refresh();
    } catch (err) {
      console.error(`Failed to update conversation status to ${newStatus}:`, err);
      throw err;
    }
  };

  const handleReopen = async () => {
    if (!accountId || !conversation.id) return;
    try {
      await handleStatusChange("open");
    } catch (err) {
      console.error("Failed to reopen conversation:", err);
    }
  };

  const handleResolve = async () => {
    if (!accountId || !conversation.id) return;
    try {
      await handleStatusChange("resolved");
      
      // If filtering by OPEN and conversation is now RESOLVED, it should disappear from list
      // This is handled by the filter logic - no need to manually remove
    } catch (err) {
      console.error("Failed to resolve conversation:", err);
    }
  };

  const handleSnooze = async () => {
    if (!accountId || !conversation.id) return;
    try {
      await handleStatusChange("snoozed");
    } catch (err) {
      console.error("Failed to snooze conversation:", err);
    }
  };

  const handleMarkAsPending = async () => {
    if (!accountId || !conversation.id) return;
    try {
      await handleStatusChange("pending");
    } catch (err) {
      console.error("Failed to mark conversation as pending:", err);
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
      }}
    >
      {/* Header */}
      <ChatwootMessageViewerHeader
        conversation={conversation}
        accountId={accountId}
        onBack={onBack}
        onReopen={handleReopen}
        onResolve={handleResolve}
        onSnooze={handleSnooze}
        onMarkAsPending={handleMarkAsPending}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onStar={handleStar}
        onPrint={handlePrint}
        isStarred={false}
      />

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
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
          <>
            {messages.map((message, index) => {
              // Filter out system messages (message_type 2) from display, but show resolution
              const isSystemMessage = message.message_type === 2;
              const isResolutionMessage = isSystemMessage && message.content?.includes("resolved");
              
              if (isSystemMessage && !isResolutionMessage) {
                return null; // Skip non-resolution system messages
              }

              return (
                <ChatwootMessageItem
                  key={message.id || index}
                  message={message}
                  isLast={index === messages.length - 1}
                  isFirst={index === 0}
                />
              );
            })}
            {/* Resolution Status Bar - show after messages if conversation is resolved */}
            {conversation.status === "resolved" && (
              <ChatwootResolutionStatusBar conversation={conversation} />
            )}
          </>
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

