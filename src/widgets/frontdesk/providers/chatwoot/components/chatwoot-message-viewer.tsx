import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";
import { ChatwootMessageViewerHeader } from "./chatwoot-message-viewer-header";
import { ChatwootMessageItem } from "./chatwoot-message-item";
import { useChatwootMessages } from "../hooks/use-chatwoot-messages";
import { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";

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

  const { messages, loading, error } = useChatwootMessages({
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

  const handleReply = () => {
    // TODO: Implement reply functionality
    console.log("Reply clicked");
  };

  const handleReopen = () => {
    // TODO: Implement reopen functionality
    console.log("Reopen clicked");
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
        onReply={handleReply}
        onReopen={handleReopen}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onStar={handleStar}
        onPrint={handlePrint}
        isStarred={false}
      />

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
    </Paper>
  );
};

