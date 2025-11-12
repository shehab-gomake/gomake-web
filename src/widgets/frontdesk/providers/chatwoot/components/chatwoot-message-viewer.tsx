import React from "react";
import { Box, Paper, Typography, Stack, alpha, Button, CircularProgress, Fade } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import { chatwootService } from "@/services/frontdesk";
// New Chatwoot-specific loading and empty states
import { MessageViewerSkeleton } from "./skeletons";
import { NoMessagesEmptyState, ErrorState } from "./empty-states";

interface ChatwootMessageViewerProps {
  conversation: ChatwootConversation | null;
  accountId?: number;
  onBack: () => void;
  onConversationUpdate?: (updatedConversation: ChatwootConversation) => void;
  currentStatusFilter?: ConversationStatus;
  inboxes?: ChatwootInbox[];
  inboxesLoading?: boolean;
}

export const ChatwootMessageViewer: React.FC<ChatwootMessageViewerProps> = ({
  conversation,
  accountId,
  onBack,
  onConversationUpdate,
  currentStatusFilter,
  inboxes = [],
  inboxesLoading = false,
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();
  const [isSending, setIsSending] = React.useState(false);
  
  // Track previous conversation for smooth transitions
  const previousConversationIdRef = React.useRef<number | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const { messages, loading, error, refresh, loadMoreMessages, hasMoreMessages, isLoadingMore } = useChatwootMessages({
    conversation,
    accountId: accountId || null,
  });

  // Detect conversation changes for transition animation
  React.useEffect(() => {
    if (conversation?.id && previousConversationIdRef.current !== conversation.id) {
      if (previousConversationIdRef.current !== null) {
        setIsTransitioning(true);
      }
      previousConversationIdRef.current = conversation.id;
    }
  }, [conversation?.id]);

  // Reset transition state when messages finish loading
  React.useEffect(() => {
    if (!loading && messages.length > 0 && isTransitioning) {
      // Small delay to ensure smooth fade-in
      const timer = setTimeout(() => setIsTransitioning(false), 100);
      return () => clearTimeout(timer);
    }
  }, [loading, messages.length, isTransitioning]);

  // Get inbox for the conversation from props
  const inbox = React.useMemo(() => {
    if (!conversation?.inbox_id) return null;
    return inboxes.find((inbox) => inbox.id === conversation.inbox_id) || null;
  }, [conversation?.inbox_id, inboxes]);

  // TODO: Implement composer focus with forwardRef
  // const composerRef = React.useRef<any>(null);
  const handleStartConversation = () => {
    // TODO: Focus composer when implementing forwardRef
    // composerRef.current?.focus();
  };

  if (!conversation) {
    return (
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100%",
          borderRadius: 2,
          backgroundColor: neutralColor(0),
        }}
      >
        <EmptyState
          title="No ticket selected"
          description="Choose a ticket from the list to start viewing messages"
        />
      </Paper>
    );
  }

  // Show full skeleton only on initial load (no previous messages)
  const showFullSkeleton = loading && messages.length === 0 && previousConversationIdRef.current === null;

  // Helper to update conversation after status change (similar to Vue store.dispatch('toggleStatus'))
  const handleStatusChange = async (newStatus: string) => {
    if (!accountId || !conversation.id) return;
    
    try {
      // Update conversation status via toggle_status API
      const response = await chatwootService.conversations.updateConversationStatus(
        accountId,
        conversation.id,
        { status: newStatus as 'open' | 'resolved' | 'pending' | 'snoozed' }
      );
      
      // Verify success
      if (response.payload?.success) {
        // Update conversation with new status
        const finalConversation = {
          ...conversation,
          status: response.payload.current_status,
        };
        
        // Update in list (similar to Vue: commit(types.CHANGE_CONVERSATION_STATUS))
        if (onConversationUpdate) {
          onConversationUpdate(finalConversation);
        }
      } else {
        throw new Error("Status update failed: Unexpected response from server");
      }
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

  const handlePriorityChange = async (newPriority: "urgent" | "high" | "medium" | "low" | null) => {
    if (!accountId || !conversation.id) return;

    try {
      // Update conversation via API
      const response = await chatwootService.conversations.updateConversation(accountId, conversation.id, {
        priority: newPriority,
      });

      // Get updated conversation from response
      const updatedConversation = response.payload || response.data || conversation;
      const finalConversation = {
        ...conversation,
        ...updatedConversation,
        priority: newPriority,
      };

      // Update in list
      if (onConversationUpdate) {
        onConversationUpdate(finalConversation);
      }

      // Refresh messages
      refresh();
    } catch (err) {
      console.error(`Failed to update conversation priority to ${newPriority}:`, err);
      throw err;
    }
  };

  const handleArchive = async () => {
    if (!conversation?.id || !accountId) return;

    try {
      setIsSending(true);
      // Archive conversation by updating its status to resolved
      await chatwootService.conversations.updateConversationStatus(
        accountId,
        conversation.id,
        { status: 'resolved' }
      );

      // Update conversation in list
      if (onConversationUpdate) {
        onConversationUpdate({ ...conversation, status: 'resolved' });
      }

      console.log('[handleArchive] Conversation archived successfully');
    } catch (error) {
      console.error('[handleArchive] Failed to archive conversation:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async () => {
    if (!conversation?.id || !accountId) return;

    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSending(true);
      await chatwootService.conversations.deleteConversation(accountId, conversation.id);

      // Signal deletion to parent
      if (onConversationUpdate) {
        onConversationUpdate({ ...conversation, id: -1 }); // -1 signals deletion
      }

      console.log('[handleDelete] Conversation deleted successfully');
    } catch (error) {
      console.error('[handleDelete] Failed to delete conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleStar = async () => {
    if (!conversation?.id || !accountId) return;

    try {
      setIsSending(true);
      const newStarred = !conversation.starred;

      // Update conversation starred status
      await chatwootService.conversations.updateConversation(
        accountId,
        conversation.id,
        { starred: newStarred }
      );

      // Update conversation in list
      if (onConversationUpdate) {
        onConversationUpdate({ ...conversation, starred: newStarred });
      }

      console.log(`[handleStar] Conversation ${newStarred ? 'starred' : 'unstarred'}`);
    } catch (error) {
      console.error('[handleStar] Failed to toggle star:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendMessage = async (
    content: string,
    isPrivate: boolean,
    recipientEmails?: { to?: string; cc?: string; bcc?: string },
    attachments?: File[]
  ) => {
    if (!accountId || !conversation.id) return;

    setIsSending(true);
    try {
      await chatwootService.messages.createMessage(accountId, conversation.id, {
        content,
        message_type: "outgoing",
        private: isPrivate,
        content_type: recipientEmails ? "input_email" : "text",
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
        // Include attachments if provided
        ...(attachments && attachments.length > 0 && {
          attachments,
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

  if (showFullSkeleton) {
    return <MessageViewerSkeleton messageCount={5} />;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        height: "100%",
        borderRadius: 2,
        backgroundColor: neutralColor(0),
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}, 0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
        position: "relative",
      }}
    >
      {/* Loading overlay - subtle indicator during transition */}
      {loading && messages.length > 0 && (
        <Fade in={loading} timeout={200}>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              zIndex: 10,
              background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s ease-in-out infinite",
              "@keyframes shimmer": {
                "0%": {
                  backgroundPosition: "-200% 0",
                },
                "100%": {
                  backgroundPosition: "200% 0",
                },
              },
            }}
          />
        </Fade>
      )}

      {/* Header */}
      <Fade in={!isTransitioning} timeout={200}>
        <Box>
          <ChatwootMessageViewerHeader
            conversation={conversation}
            accountId={accountId}
            onBack={onBack}
            onReopen={handleReopen}
            onResolve={handleResolve}
            onSnooze={handleSnooze}
            onMarkAsPending={handleMarkAsPending}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            updating={isSending}
          />
        </Box>
      </Fade>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          background: `linear-gradient(to bottom, ${neutralColor(25)}, ${neutralColor(50)})`,
          p: 2,
          opacity: loading && messages.length === 0 ? 0.5 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
        className="custom-scrollbar"
      >
        {error ? (
          // Error state with retry
          <ErrorState
            title="Failed to load messages"
            message="We couldn't load the messages for this conversation. Please try again."
            error={error}
            onRetry={refresh}
          />
        ) : messages.length === 0 ? (
          // Empty state - no messages yet
          <NoMessagesEmptyState
            isNewConversation={true}
            contactName={conversation.meta?.sender?.name}
            onStartConversation={handleStartConversation}
          />
        ) : (
          <Fade in={!isTransitioning} timeout={200}>
            <Stack spacing={2}>
              {/* Load More Button - Show at top */}
              {hasMoreMessages && (
                <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={loadMoreMessages}
                    disabled={isLoadingMore}
                    startIcon={isLoadingMore ? <CircularProgress size={16} /> : null}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      borderColor: neutralColor(200),
                      color: neutralColor(700),
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    {isLoadingMore ? "Loading..." : "Load Older Messages"}
                  </Button>
                </Box>
              )}

              {(() => {
                // Filter messages: Keep ALL activity messages, filter empty content for others
                const visibleMessages = messages.filter((message) => {
                  // Activity messages (message_type 2) should ALWAYS be shown
                  // even if content is empty - they may use metadata or other fields
                  // (e.g., resolved/reopened messages may not have content but should still display)
                  if (message.message_type === 2) {
                    return true; // Keep all activity messages
                  }

                  // For regular messages (incoming/outgoing), filter out empty content
                  const hasContent = message.content && message.content.trim().length > 0;
                  return hasContent;
                });

                if (visibleMessages.length === 0) {
                  return (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="body2" sx={{ color: neutralColor(500) }}>
                        No messages to display
                      </Typography>
                    </Box>
                  );
                }

                return visibleMessages.map((message, index) => {
                  // Determine if avatar should be shown (sender changed from previous visible message)
                  const previousMessage = index > 0 ? visibleMessages[index - 1] : null;
                  const showAvatar = index === 0 || 
                    !previousMessage ||
                    previousMessage.sender?.id !== message.sender?.id ||
                    previousMessage.message_type !== message.message_type ||
                    previousMessage.sender_type !== message.sender_type;

                  return (
                    <ChatwootMessageItem
                      key={message.id || `msg-${index}`}
                      message={message}
                      isLast={index === visibleMessages.length - 1}
                      isFirst={index === 0}
                      showAvatar={showAvatar}
                      previousMessage={previousMessage}
                    />
                  );
                });
              })()}
              {/* Resolution Status Bar - show after messages if conversation is resolved */}
              {conversation.status === "resolved" && (
                <ChatwootResolutionStatusBar conversation={conversation} />
              )}
            </Stack>
          </Fade>
        )}
      </Box>

      {/* Reply Composer */}
      <Fade in={!isTransitioning} timeout={200}>
        <Box>
          <ChatwootReplyComposer
            conversation={conversation}
            inbox={inbox}
            onSend={handleSendMessage}
            isSending={isSending}
          />
        </Box>
      </Fade>
    </Paper>
  );
};

