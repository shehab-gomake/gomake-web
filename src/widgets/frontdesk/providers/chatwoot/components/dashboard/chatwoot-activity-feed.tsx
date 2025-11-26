/**
 * Chatwoot Activity Feed Panel
 *
 * Displays recent Chatwoot conversations grouped by time.
 * Based on ActivityFeedPanel from unified dashboard.
 */

import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ConversationListItem, EmptyState } from "@/widgets/frontdesk/design-system";
import { colorTokens } from "@/widgets/frontdesk/design-system/tokens";
import InboxIcon from "@mui/icons-material/Inbox";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import { ConversationListSkeleton } from "../skeletons";
import {
  getConversationName,
  getLastMessage,
  getParticipants,
  getConversationTimestamp,
  isConversationUnread,
  getUnreadCount,
} from "../../utils/conversation-helpers";

/**
 * Props for ChatwootActivityFeed component
 */
export interface ChatwootActivityFeedProps {
  /** List of conversations to display */
  conversations: ChatwootConversation[];

  /** ID of currently selected conversation (for highlighting) */
  selectedId?: number;

  /** Callback when a conversation is selected */
  onSelect: (conversationId: number, inboxId?: number) => void;

  /** Whether the data is currently loading */
  isLoading?: boolean;
}

interface GroupedConversations {
  today: ChatwootConversation[];
  yesterday: ChatwootConversation[];
  thisWeek: ChatwootConversation[];
  older: ChatwootConversation[];
}

const groupConversationsByDate = (conversations: ChatwootConversation[]): GroupedConversations => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const grouped: GroupedConversations = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  conversations.forEach((conversation) => {
    // Get timestamp: priority updated_at > created_at > timestamp
    const rawTimestamp = conversation.updated_at || conversation.created_at || conversation.timestamp;

    let timestamp: Date;
    if (!rawTimestamp) {
      timestamp = new Date(0);
    } else if (typeof rawTimestamp === "number") {
      // Unix timestamp (seconds) - convert to milliseconds
      timestamp = new Date(rawTimestamp * 1000);
    } else {
      // ISO string
      timestamp = new Date(rawTimestamp);
    }

    // Validate date
    if (isNaN(timestamp.getTime())) {
      timestamp = new Date(0);
    }

    if (timestamp >= today) {
      grouped.today.push(conversation);
    } else if (timestamp >= yesterday) {
      grouped.yesterday.push(conversation);
    } else if (timestamp >= thisWeekStart) {
      grouped.thisWeek.push(conversation);
    } else {
      grouped.older.push(conversation);
    }
  });

  return grouped;
};

const TimeGroupHeader: React.FC<{ label: string; count: number }> = ({ label, count }) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        backgroundColor: colorTokens.neutral[50],
        borderBottom: `1px solid ${colorTokens.neutral[200]}`,
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: colorTokens.neutral[600],
          fontWeight: 600,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label} ({count})
      </Typography>
    </Box>
  );
};

export const ChatwootActivityFeed: React.FC<ChatwootActivityFeedProps> = ({
  conversations,
  selectedId,
  onSelect,
  isLoading = false,
}) => {
  const theme = useTheme();

  const groupedConversations = useMemo(() => groupConversationsByDate(conversations), [conversations]);

  // Handle loading state with Skeleton
  if (isLoading && conversations.length === 0) {
    return (
      <Box sx={{ height: "100%", overflow: "hidden" }}>
        <ConversationListSkeleton count={5} />
      </Box>
    );
  }

  // Show empty state if no conversations
  if (!isLoading && conversations.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 3,
        }}
      >
        <EmptyState
          icon={<InboxIcon sx={{ fontSize: 48 }} />}
          title="No Activity"
          description="You're all caught up! No conversations need attention."
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
      }}
    >
      <Box
        sx={{
          height: "100%",
          overflow: "auto",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Today */}
        {groupedConversations.today.length > 0 && (
          <>
            <TimeGroupHeader label="Today" count={groupedConversations.today.length} />
            {groupedConversations.today.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                id={conversation.id.toString()}
                title={getConversationName(conversation)}
                participants={getParticipants(conversation)}
                snippet={getLastMessage(conversation)}
                timestamp={getConversationTimestamp(conversation)}
                isRead={!isConversationUnread(conversation)}
                isSelected={selectedId === conversation.id}
                unreadCount={getUnreadCount(conversation)}
                hasAttachments={false}
                onClick={() => onSelect(conversation.id, conversation.inbox_id)}
              />
            ))}
          </>
        )}

        {/* Yesterday */}
        {groupedConversations.yesterday.length > 0 && (
          <>
            <TimeGroupHeader label="Yesterday" count={groupedConversations.yesterday.length} />
            {groupedConversations.yesterday.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                id={conversation.id.toString()}
                title={getConversationName(conversation)}
                participants={getParticipants(conversation)}
                snippet={getLastMessage(conversation)}
                timestamp={getConversationTimestamp(conversation)}
                isRead={!isConversationUnread(conversation)}
                isSelected={selectedId === conversation.id}
                unreadCount={getUnreadCount(conversation)}
                hasAttachments={false}
                onClick={() => onSelect(conversation.id, conversation.inbox_id)}
              />
            ))}
          </>
        )}

        {/* This Week */}
        {groupedConversations.thisWeek.length > 0 && (
          <>
            <TimeGroupHeader label="This Week" count={groupedConversations.thisWeek.length} />
            {groupedConversations.thisWeek.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                id={conversation.id.toString()}
                title={getConversationName(conversation)}
                participants={getParticipants(conversation)}
                snippet={getLastMessage(conversation)}
                timestamp={getConversationTimestamp(conversation)}
                isRead={!isConversationUnread(conversation)}
                isSelected={selectedId === conversation.id}
                unreadCount={getUnreadCount(conversation)}
                hasAttachments={false}
                onClick={() => onSelect(conversation.id, conversation.inbox_id)}
              />
            ))}
          </>
        )}

        {/* Older */}
        {groupedConversations.older.length > 0 && (
          <>
            <TimeGroupHeader label="Older" count={groupedConversations.older.length} />
            {groupedConversations.older.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                id={conversation.id.toString()}
                title={getConversationName(conversation)}
                participants={getParticipants(conversation)}
                snippet={getLastMessage(conversation)}
                timestamp={getConversationTimestamp(conversation)}
                isRead={!isConversationUnread(conversation)}
                isSelected={selectedId === conversation.id}
                unreadCount={getUnreadCount(conversation)}
                hasAttachments={false}
                onClick={() => onSelect(conversation.id, conversation.inbox_id)}
              />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatwootActivityFeed;
