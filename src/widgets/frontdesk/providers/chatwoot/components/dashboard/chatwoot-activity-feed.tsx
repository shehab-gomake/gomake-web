/**
 * Chatwoot Activity Feed Panel - Modern SaaS Design
 *
 * Displays recent Chatwoot conversations grouped by time.
 * Redesigned with better spacing, alignment, and modern aesthetics.
 */

import React, { useMemo } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { ConversationListItem, EmptyState } from "@/widgets/frontdesk/design-system";
import InboxIcon from "@mui/icons-material/Inbox";
import ScheduleIcon from "@mui/icons-material/Schedule";
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

// Modern design tokens
const FEED_TOKENS = {
  colors: {
    background: "#FFFFFF",
    backgroundAlt: "#FAFBFC",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    border: "#E2E8F0",
    borderSubtle: "#F1F5F9",
    primary: "#3B82F6",
    primaryLight: "#EFF6FF",
  },
  spacing: {
    itemPadding: 16,
    headerPadding: 14,
    groupGap: 2,
  },
  borderRadius: 8,
};

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

interface TimeGroupHeaderProps {
  label: string;
  count: number;
  isFirst?: boolean;
}

const TimeGroupHeader: React.FC<TimeGroupHeaderProps> = ({ label, count, isFirst = false }) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.25,
        backgroundColor: FEED_TOKENS.colors.backgroundAlt,
        borderBottom: `1px solid ${FEED_TOKENS.colors.borderSubtle}`,
        borderTop: !isFirst ? `1px solid ${FEED_TOKENS.colors.borderSubtle}` : "none",
        position: "sticky",
        top: 0,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <ScheduleIcon
          sx={{
            fontSize: 14,
            color: FEED_TOKENS.colors.textMuted,
          }}
        />
        <Typography
          sx={{
            color: FEED_TOKENS.colors.textSecondary,
            fontWeight: 600,
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Box
        sx={{
          minWidth: 20,
          height: 20,
          px: 0.75,
          borderRadius: "10px",
          backgroundColor: FEED_TOKENS.colors.borderSubtle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            color: FEED_TOKENS.colors.textMuted,
          }}
        >
          {count}
        </Typography>
      </Box>
    </Box>
  );
};

export const ChatwootActivityFeed: React.FC<ChatwootActivityFeedProps> = ({
  conversations,
  selectedId,
  onSelect,
  isLoading = false,
}) => {
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
          p: 4,
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: 280 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              backgroundColor: FEED_TOKENS.colors.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <InboxIcon sx={{ fontSize: 32, color: FEED_TOKENS.colors.primary }} />
          </Box>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: FEED_TOKENS.colors.textPrimary,
              mb: 1,
            }}
          >
            No Activity
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: FEED_TOKENS.colors.textMuted,
              lineHeight: 1.5,
            }}
          >
            You're all caught up! No conversations need attention right now.
          </Typography>
        </Box>
      </Box>
    );
  }

  const renderConversationGroup = (
    group: ChatwootConversation[],
    label: string,
    isFirst: boolean
  ) => {
    if (group.length === 0) return null;

    return (
      <React.Fragment key={label}>
        <TimeGroupHeader label={label} count={group.length} isFirst={isFirst} />
        {group.map((conversation) => (
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
      </React.Fragment>
    );
  };

  // Determine which is the first non-empty group
  const groups = [
    { data: groupedConversations.today, label: "Today" },
    { data: groupedConversations.yesterday, label: "Yesterday" },
    { data: groupedConversations.thisWeek, label: "This Week" },
    { data: groupedConversations.older, label: "Older" },
  ];

  let isFirst = true;

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
          backgroundColor: FEED_TOKENS.colors.background,
          // Custom scrollbar styling
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: FEED_TOKENS.colors.border,
            borderRadius: 3,
            "&:hover": {
              backgroundColor: FEED_TOKENS.colors.textMuted,
            },
          },
        }}
      >
        {groups.map((group) => {
          if (group.data.length === 0) return null;
          const result = renderConversationGroup(group.data, group.label, isFirst);
          if (result) isFirst = false;
          return result;
        })}
      </Box>
    </Box>
  );
};

export default ChatwootActivityFeed;
