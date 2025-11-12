import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { useRecoilValue } from "recoil";
import { chatwootProfileAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { ConversationStatusSelector } from "./conversation-status-selector";
import { ConversationPrioritySelector } from "./conversation-priority-selector";

interface ChatwootMessageViewerHeaderProps {
  conversation: ChatwootConversation | null;
  accountId?: number;
  onBack: () => void;
  onReopen?: () => void;
  onResolve?: () => void;
  onSnooze?: () => void;
  onMarkAsPending?: () => void;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: "urgent" | "high" | "medium" | "low" | null) => void;
  updating?: boolean;
}

export const ChatwootMessageViewerHeader: React.FC<ChatwootMessageViewerHeaderProps> = ({
  conversation,
  accountId,
  onBack,
  onReopen,
  onResolve,
  onSnooze,
  onMarkAsPending,
  onStatusChange,
  onPriorityChange,
  updating = false,
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();
  const profile = useRecoilValue(chatwootProfileAtom);

  if (!conversation) return null;

  // Get current user display name (from profile)
  const currentUserName = profile?.name || profile?.available_name || profile?.email || "";

  const currentPriority = (conversation.priority || null) as "urgent" | "high" | "medium" | "low" | null;

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: neutralColor(0), // Light background
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* Left: Current User Name */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: neutralColor(800),
            fontSize: "0.875rem",
          }}
        >
          {currentUserName || "User"}
        </Typography>

        {/* Right: Status and Priority Selectors */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {onStatusChange && (
            <ConversationStatusSelector
              status={conversation.status || "open"}
              onStatusChange={onStatusChange}
              updating={updating}
            />
          )}
          {onPriorityChange && (
            <ConversationPrioritySelector
              priority={currentPriority}
              onPriorityChange={onPriorityChange}
              updating={updating}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

