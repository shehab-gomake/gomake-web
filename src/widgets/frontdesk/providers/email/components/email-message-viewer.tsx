import React from "react";
import { Box, Paper, Collapse, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailConversation } from "../types/email.types";
import { useMessageViewer } from "../hooks/use-message-viewer";
import { MessageViewerHeader } from "./message-viewer/message-viewer-header";
import { MessageViewerEmpty } from "./message-viewer/message-viewer-empty";
import { MessageItem } from "@/widgets/frontdesk/components/shared/MessageItem";
import { InlineReplySection } from "@/widgets/frontdesk/components/shared/InlineReplySection";
import { emailToUnified } from "@/widgets/frontdesk/utils/message-transformer";

interface EmailMessageViewerProps {
  conversation: EmailConversation | null;
  accountId?: string;
  onBack: () => void;
  onReply: (conversation: EmailConversation) => void;
  onReplyAll: (conversation: EmailConversation) => void;
  onForward: (conversation: EmailConversation) => void;
  onDelete: (conversationId: string) => void;
  onArchive: (conversationId: string) => void;
  onStar: (conversationId: string, starred: boolean) => void;
  onPrint: (conversation: EmailConversation) => void;
  onAddLabel: (conversationId: string, label: string) => void;
  onCreateTicket?: (conversationId: string, emailAccountId?: string) => void;
  onSendReply?: (text: string, replyAll?: boolean) => Promise<boolean>;
  isSending?: boolean;
}

export const EmailMessageViewer: React.FC<EmailMessageViewerProps> = ({
  conversation,
  accountId,
  onBack,
  onReply,
  onReplyAll,
  onForward,
  onDelete,
  onArchive,
  onStar,
  onPrint,
  onAddLabel,
  onCreateTicket,
  onSendReply,
  isSending = false,
}) => {
  const { neutralColor } = useGomakeTheme();

  const {
    messages,
    loading,
    showInlineReply,
    isReplyAll,
    replyText,
    setReplyText,
    handleReply,
    handleReplyAll,
    handleCancelReply,
    handleInlineReply,
  } = useMessageViewer({ conversation, accountId, onSendReply });

  if (!conversation) {
    return <MessageViewerEmpty />;
  }

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
      <MessageViewerHeader
        conversation={conversation}
        emailAccountId={accountId}
        onBack={onBack}
        onStar={onStar}
        onPrint={onPrint}
        onArchive={onArchive}
        onDelete={onDelete}
        onReply={handleReply}
        onReplyAll={handleReplyAll}
        onForward={onForward}
        onCreateTicket={onCreateTicket}
        showInlineReply={showInlineReply}
      />

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(600) }}>
              Loading messages...
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: neutralColor(500) }}>
              No messages in this conversation
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => {
            // Transform email message to unified format
            const unifiedMessage = emailToUnified(message, accountId);

            return (
              <MessageItem
                key={message.id}
                message={unifiedMessage}
                variant="email"
                accountId={accountId}
                isLast={index === messages.length - 1}
              />
            );
          })
        )}
      </Box>

      {/* Inline Reply Section */}
      <Collapse in={showInlineReply}>
        <InlineReplySection
          showReplyAll={true}
          isReplyAll={isReplyAll}
          replyText={replyText}
          isSending={isSending}
          onReplyTextChange={setReplyText}
          onSend={handleInlineReply}
          onCancel={handleCancelReply}
        />
      </Collapse>
    </Paper>
  );
};
