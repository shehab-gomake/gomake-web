/**
 * Contact History Section
 *
 * Displays conversation history for a contact with infinite scroll.
 * Features:
 * - Date-grouped conversations (Today, Yesterday, This Week, Older)
 * - Hidden scrollbar with visual scroll indicators
 * - Smooth infinite scroll with Intersection Observer
 * - Performance optimized with memoization
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Box, Typography, CircularProgress, Collapse, IconButton } from "@mui/material";
import { 
  ConfirmationNumber as TicketIcon, 
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowDown as ArrowDownIcon
} from "@mui/icons-material";
import { chatwootService } from "@/services/frontdesk";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { ChatwootInbox } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { useChatwootRouter } from "../hooks/use-chatwoot-router";
import { TicketHistoryCard } from "./ticket-history-card";

// ============================================================================
// Types & Constants
// ============================================================================

interface ContactHistorySectionProps {
  contactId?: number;
  accountId?: number;
  router: ReturnType<typeof useChatwootRouter>;
  currentConversationId?: number;
  inboxes?: ChatwootInbox[];
}

interface GroupedConversations {
  today: ChatwootConversation[];
  yesterday: ChatwootConversation[];
  thisWeek: ChatwootConversation[];
  older: ChatwootConversation[];
}

const CONFIG = {
  INITIAL_LIMIT: 5,
  LOAD_INCREMENT: 10,
  MAX_HEIGHT: 500,
  SCROLL_TRIGGER_MARGIN: "50px",
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Group conversations by date buckets
 */
const groupByDate = (conversations: ChatwootConversation[]): GroupedConversations => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const grouped: GroupedConversations = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  conversations.forEach((conv) => {
    const timestamp = conv.last_activity_at || conv.created_at;
    if (!timestamp) {
      grouped.older.push(conv);
      return;
    }

    const date = new Date(typeof timestamp === "number" ? timestamp * 1000 : timestamp);
    if (isNaN(date.getTime())) {
      grouped.older.push(conv);
      return;
    }

    if (date >= today) grouped.today.push(conv);
    else if (date >= yesterday) grouped.yesterday.push(conv);
    else if (date >= weekStart) grouped.thisWeek.push(conv);
    else grouped.older.push(conv);
  });

  return grouped;
};

/**
 * Sort conversations by activity (newest first)
 */
const sortByActivity = (conversations: ChatwootConversation[]): ChatwootConversation[] => {
  return [...conversations].sort((a, b) => {
    const aTime = (a as any).last_activity_at || (a as any).created_at || 0;
    const bTime = (b as any).last_activity_at || (b as any).created_at || 0;
    return bTime - aTime;
  });
};

// ============================================================================
// Main Component
// ============================================================================

export const ContactHistorySection: React.FC<ContactHistorySectionProps> = ({
  contactId,
  accountId,
  router,
  currentConversationId,
  inboxes = [],
}) => {
  // State
  const [conversations, setConversations] = useState<ChatwootConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(CONFIG.INITIAL_LIMIT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // ============================================================================
  // Data Fetching
  // ============================================================================

  useEffect(() => {
    if (!contactId || !accountId) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await chatwootService.contacts.getContactConversations(accountId, contactId);
        const sorted = sortByActivity(response.payload || []);
        setConversations(sorted);
      } catch (err) {
        setError("Failed to load contact history.");
        console.error("[ContactHistory] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [contactId, accountId]);

  // Reset on contact change
  useEffect(() => {
    setDisplayLimit(CONFIG.INITIAL_LIMIT);
  }, [contactId]);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const { displayedConversations, totalCount, remainingCount, hasMore } = useMemo(() => {
    const limited = conversations.slice(0, displayLimit);
    return {
      displayedConversations: groupByDate(limited),
      totalCount: conversations.length,
      remainingCount: conversations.length - displayLimit,
      hasMore: displayLimit < conversations.length,
    };
  }, [conversations, displayLimit]);

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleConversationClick = useCallback(
    (conversation: ChatwootConversation) => {
      router.navigateToConversation(
        conversation.id.toString(),
        conversation.inbox_id?.toString()
      );
    },
    [router]
  );

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    requestAnimationFrame(() => {
      setDisplayLimit((prev) => 
        Math.min(prev + CONFIG.LOAD_INCREMENT, conversations.length)
      );
      setIsLoadingMore(false);
    });
  }, [isLoadingMore, hasMore, conversations.length]);

  // ============================================================================
  // Infinite Scroll Setup
  // ============================================================================

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!isExpanded || !hasMore) return;

    const options: IntersectionObserverInit = {
      root: scrollContainerRef.current,
      rootMargin: CONFIG.SCROLL_TRIGGER_MARGIN,
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      options
    );

    if (loadTriggerRef.current) {
      observerRef.current.observe(loadTriggerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isExpanded, hasMore, isLoadingMore, loadMore]);

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const renderDateGroup = (
    label: string,
    conversations: ChatwootConversation[]
  ) => {
    if (conversations.length === 0) return null;

    return (
      <Box key={label} sx={{ mb: 2 }}>
        {/* Date Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
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
            {label} ({conversations.length})
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {conversations.map((conversation) => (
            <TicketHistoryCard
              key={conversation.id}
              conversation={conversation}
              onClick={handleConversationClick}
              isActive={currentConversationId === conversation.id}
              inboxes={inboxes}
            />
          ))}
        </Box>
      </Box>
    );
  };

  const renderEmptyState = () => (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        backgroundColor: colorTokens.neutral[50],
        borderRadius: "8px",
        border: `1px solid ${colorTokens.semantic.border.default}`,
      }}
    >
      <TicketIcon
        sx={{
          fontSize: 40,
          color: colorTokens.neutral[400],
          mb: 1.5,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontSize: 13,
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

  const renderError = () => (
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

  const renderLoadingState = () => (
    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
      <CircularProgress size={24} />
    </Box>
  );

  const renderScrollIndicator = () => (
    <Box
      sx={{
        position: "absolute",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
        pointerEvents: "none",
      }}
    >
      {/* Arrow Circle */}
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: colorTokens.primary[500],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 1px 4px ${colorTokens.primary[400]}40`,
        }}
      >
        <ArrowDownIcon
          sx={{
            fontSize: 14,
            color: "white",
          }}
        />
      </Box>

      {/* Count Badge */}
      <Box
        sx={{
          px: 1,
          py: 0.25,
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: `0 1px 4px ${colorTokens.neutral[300]}`,
          border: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: 9.5,
            fontWeight: 600,
            color: colorTokens.semantic.text.primary,
          }}
        >
          +{remainingCount} more
        </Typography>
      </Box>
    </Box>
  );

  const renderLoadingIndicator = () => (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: "white",
        px: 2,
        py: 1,
        borderRadius: "20px",
        boxShadow: `0 2px 12px ${colorTokens.neutral[300]}`,
        border: `1px solid ${colorTokens.neutral[200]}`,
      }}
    >
      <CircularProgress size={14} thickness={5} />
      <Typography
        variant="caption"
        sx={{
          fontSize: 11,
          color: colorTokens.semantic.text.secondary,
          fontWeight: 500,
        }}
      >
        Loading...
      </Typography>
    </Box>
  );

  // ============================================================================
  // Main Render
  // ============================================================================

  const renderContent = () => {
    if (loading) return renderLoadingState();
    if (error) return renderError();
    if (conversations.length === 0) return renderEmptyState();

    return (
      <>
        {renderDateGroup("Today", displayedConversations.today)}
        {renderDateGroup("Yesterday", displayedConversations.yesterday)}
        {renderDateGroup("This Week", displayedConversations.thisWeek)}
        {renderDateGroup("Older", displayedConversations.older)}

        {/* Infinite Scroll Trigger */}
        {hasMore && <Box ref={loadTriggerRef} sx={{ height: 1, py: 2 }} />}
      </>
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: isExpanded ? 1 : 0,
          cursor: "pointer",
          userSelect: "none",
          "&:hover .expand-icon": {
            color: colorTokens.semantic.text.secondary,
          },
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
          className="expand-icon"
          sx={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "all 0.2s ease",
            p: 0.5,
          }}
        >
          <ExpandMoreIcon
            sx={{
              fontSize: 16,
              color: colorTokens.semantic.text.tertiary,
              transition: "color 0.2s ease",
            }}
          />
        </IconButton>
      </Box>

      {/* Content with Infinite Scroll */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ position: "relative" }}>
          {/* Scrollable Container */}
          <Box
            ref={scrollContainerRef}
            sx={{
              maxHeight: `${CONFIG.MAX_HEIGHT}px`,
              overflowY: "auto",
              overflowX: "hidden",
              // Hide scrollbar
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Smooth scrolling
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {renderContent()}
          </Box>

          {/* Bottom Gradient Overlay */}
          {hasMore && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "80px",
                background: `linear-gradient(to bottom, 
                  transparent 0%, 
                  ${colorTokens.neutral[50]}80 50%, 
                  ${colorTokens.neutral[50]} 100%)`,
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
          )}

          {/* Scroll Indicators */}
          {hasMore && !isLoadingMore && renderScrollIndicator()}
          {hasMore && isLoadingMore && renderLoadingIndicator()}
        </Box>
      </Collapse>
    </Box>
  );
};
