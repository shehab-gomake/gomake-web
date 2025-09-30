import React from "react";
import { Box, Paper, Collapse, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EmailConversation } from "../types/email.types";
import { useMessageViewer } from "../hooks/use-message-viewer";
import { MessageViewerHeader } from "./message-viewer/message-viewer-header";
import { MessageItem } from "./message-viewer/message-item";
import { InlineReplySection } from "./message-viewer/inline-reply-section";
import { MessageViewerEmpty } from "./message-viewer/message-viewer-empty";

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
        onBack={onBack}
        onStar={onStar}
        onPrint={onPrint}
        onArchive={onArchive}
        onDelete={onDelete}
        onReply={handleReply}
        onReplyAll={handleReplyAll}
        onForward={onForward}
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
          messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              accountId={accountId}
              isLast={index === messages.length - 1}
              showInlineReply={showInlineReply}
            />
          ))
        )}
      </Box>

      {/* Inline Reply Section */}
      <Collapse in={showInlineReply}>
        <InlineReplySection
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
