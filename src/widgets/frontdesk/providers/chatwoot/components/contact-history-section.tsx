/**
 * Contact History Section
 *
 * Displays the conversation history for the selected contact.
 * Enhanced with rich card-based UI showing status, priority, assignee, and message previews.
 * Features date grouping, current ticket highlighting, and improved visual hierarchy.
 */

import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, CircularProgress, Collapse, IconButton, Button } from "@mui/material";
import { ConfirmationNumber as TicketIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { chatwootService } from "@/services/frontdesk";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { useChatwootRouter } from "../hooks/use-chatwoot-router";
import { TicketHistoryCard } from "./ticket-history-card";

interface ContactHistorySectionProps {
  contactId?: number;
  accountId?: number;
  router: ReturnType<typeof useChatwootRouter>;
  currentConversationId?: number; // ID of the conversation currently being viewed
  inboxes?: ChatwootInbox[]; // Inboxes list to get inbox names
}

interface GroupedConversations {
  today: ChatwootConversation[];
  yesterday: ChatwootConversation[];
  thisWeek: ChatwootConversation[];
  older: ChatwootConversation[];
}

const INITIAL_DISPLAY_LIMIT = 3;

export const ContactHistorySection: React.FC<ContactHistorySectionProps> = ({
  contactId,
  accountId,
  router,
  currentConversationId,
  inboxes = [],
}) => {
  const [conversations, setConversations] = useState<ChatwootConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_LIMIT);

  useEffect(() => {
    if (!contactId || !accountId) {
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await chatwootService.contacts.getContactConversations(accountId, contactId);

        // Sort conversations by last_activity_at (most recent first)
        // Type assertion is safe here as the API returns conversations with full metadata
        const sortedConversations = (response.payload || []).sort((a, b) => {
          const aTime = (a as any).last_activity_at || (a as any).created_at || 0;
          const bTime = (b as any).last_activity_at || (b as any).created_at || 0;
          return bTime - aTime; // Descending order (newest first)
        }) as ChatwootConversation[];

        setConversations(sortedConversations);
      } catch (err) {
        setError("Failed to load contact history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [contactId, accountId]);

  // Reset display limit when contact changes
  useEffect(() => {
    setDisplayLimit(INITIAL_DISPLAY_LIMIT);
  }, [contactId]);

  const handleConversationClick = (conversation: ChatwootConversation) => {
    router.navigateToConversation(conversation.id.toString(), conversation.inbox_id?.toString());
  };

  /**
   * Group conversations by date (Today, Yesterday, This Week, Older)
   */
  const groupConversationsByDate = (convs: ChatwootConversation[]): GroupedConversations => {
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

    convs.forEach((conversation) => {
      const rawTimestamp = conversation.last_activity_at || conversation.created_at;

      if (!rawTimestamp) {
        grouped.older.push(conversation);
        return;
      }

      // Convert Unix timestamp (seconds) to Date
      const timestamp = new Date(typeof rawTimestamp === "number" ? rawTimestamp * 1000 : rawTimestamp);

      if (isNaN(timestamp.getTime())) {
        grouped.older.push(conversation);
        return;
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

  /**
   * Format date header label
   */
  const formatDateHeader = (label: string, count: number): string => {
    return `${label} (${count})`;
  };

  /**
   * Get grouped and limited conversations for display
   */
  const { groupedConversations, totalCount, hasMore } = useMemo(() => {
    const grouped = groupConversationsByDate(conversations);
    const allConversations = [...grouped.today, ...grouped.yesterday, ...grouped.thisWeek, ...grouped.older];

    const limited = allConversations.slice(0, displayLimit);
    const limitedGrouped = groupConversationsByDate(limited);

    return {
      groupedConversations: limitedGrouped,
      totalCount: conversations.length,
      hasMore: conversations.length > displayLimit,
    };
  }, [conversations, displayLimit]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            backgroundColor: colorTokens.error[50],
            borderRadius: "6px",
            border: `1px solid ${colorTokens.error[200]}`,
          }}
        >
          <Typography variant="body2" color="error" sx={{ fontSize: 12 }}>
            {error}
          </Typography>
        </Box>
      );
    }

    if (conversations.length === 0) {
      return (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: colorTokens.neutral[50],
            borderRadius: "8px",
            border: `1px solid ${colorTokens.semantic.border.default}`,
          }}
        >
          <TicketIcon
            sx={{
              fontSize: 32,
              color: colorTokens.neutral[400],
              mb: 1,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: 12,
              color: colorTokens.semantic.text.primary,
              mb: 0.5,
            }}
          >
            No previous tickets
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: 11,
              color: colorTokens.semantic.text.tertiary,
            }}
          >
            This contact's ticket history will appear here
          </Typography>
        </Box>
      );
    }

    const renderGroup = (label: string, convos: ChatwootConversation[], isLast: boolean) => {
      if (convos.length === 0) return null;

      return (
        <Box key={label} sx={{ mb: isLast ? 0 : 1.5 }}>
          {/* Date Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mb: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: 10,
                color: colorTokens.semantic.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {formatDateHeader(label, convos.length)}
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: 1,
                backgroundColor: colorTokens.neutral[200],
              }}
            />
          </Box>

          {/* Conversation Cards */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {convos.map((convo) => (
              <TicketHistoryCard
                key={convo.id}
                conversation={convo}
                onClick={handleConversationClick}
                isActive={currentConversationId === convo.id}
                inboxes={inboxes}
              />
            ))}
          </Box>
        </Box>
      );
    };

    return (
      <Box>
        {renderGroup("Today", groupedConversations.today, false)}
        {renderGroup("Yesterday", groupedConversations.yesterday, false)}
        {renderGroup("This Week", groupedConversations.thisWeek, false)}
        {renderGroup("Older", groupedConversations.older, !hasMore)}

        {/* Expand Button */}
        {hasMore && (
          <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setDisplayLimit(totalCount)}
              startIcon={<ExpandMoreIcon />}
              sx={{
                fontSize: 11,
                textTransform: "none",
                py: 0.5,
                px: 2,
                borderColor: colorTokens.semantic.border.default,
                color: colorTokens.semantic.text.secondary,
                "&:hover": {
                  borderColor: colorTokens.primary[400],
                  backgroundColor: colorTokens.primary[50],
                },
              }}
            >
              Show {totalCount - displayLimit} More {totalCount - displayLimit === 1 ? 'Ticket' : 'Tickets'}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Header with Collapse Toggle */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: isExpanded ? 1 : 0,
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: 10,
            color: colorTokens.semantic.text.secondary,
          }}
        >
          Ticket History {totalCount > 0 && `(${totalCount})`}
        </Typography>

        <IconButton
          size="small"
          sx={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            p: 0.5,
          }}
        >
          <ExpandMoreIcon
            sx={{
              fontSize: 16,
              color: colorTokens.semantic.text.tertiary,
            }}
          />
        </IconButton>
      </Box>

      {/* Collapsible Content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        {renderContent()}
      </Collapse>
    </Box>
  );
};
