import React from "react";
import { Box, Typography } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { useRecoilValue } from "recoil";
import { chatwootProfileAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";

interface ChatwootResolutionStatusBarProps {
  conversation: ChatwootConversation | null;
}

export const ChatwootResolutionStatusBar: React.FC<ChatwootResolutionStatusBarProps> = ({
  conversation,
}) => {
  const { neutralColor } = useGomakeTheme();
  const profile = useRecoilValue(chatwootProfileAtom);

  if (!conversation || conversation.status !== "resolved") {
    return null;
  }

  // Get agent name who resolved (could be from assignee or last agent)
  const resolverName = conversation.meta?.assignee?.name || 
                       profile?.name || 
                       profile?.available_name || 
                       "Unknown";

  return (
    <Box
      sx={{
        px: 2.5,
        py: 1.5,
        borderTop: `1px solid ${neutralColor(200)}`,
        borderBottom: `1px solid ${neutralColor(200)}`,
        backgroundColor: neutralColor(50),
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: neutralColor(600),
          fontSize: "0.8125rem",
          fontStyle: "italic",
        }}
      >
        Conversation was marked resolved by {resolverName} - agent
      </Typography>
    </Box>
  );
};

