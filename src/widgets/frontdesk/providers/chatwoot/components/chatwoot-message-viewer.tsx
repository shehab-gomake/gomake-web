import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { PanelContent, EmptyState } from "@/widgets/frontdesk/design-system";

interface ChatwootMessageViewerProps {
  conversation: any | null;
  accountId?: number;
  onBack: () => void;
}

export const ChatwootMessageViewer: React.FC<ChatwootMessageViewerProps> = ({
  conversation,
  accountId,
  onBack,
}) => {
  const { neutralColor } = useGomakeTheme();

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
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">
          {conversation.meta?.sender?.name || conversation.meta?.sender?.email || "Conversation"}
        </Typography>
        <Typography variant="body2" sx={{ color: neutralColor(600), mt: 1 }}>
          Conversation #{conversation.id}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <Typography variant="body2" sx={{ color: neutralColor(500) }}>
          Messages will be displayed here. This is a placeholder for the Chatwoot message viewer.
        </Typography>
      </Box>
    </Paper>
  );
};

