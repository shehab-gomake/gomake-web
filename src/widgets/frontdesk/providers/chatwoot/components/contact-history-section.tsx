/**
 * Contact History Section
 *
 * Displays the conversation history for the selected contact.
 * Enhanced with rich card-based UI showing status, priority, assignee, and message previews.
 */

import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Collapse, IconButton } from "@mui/material";
import { ConfirmationNumber as TicketIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { chatwootService } from "@/services/frontdesk";
import { colorTokens } from "@/widgets/frontdesk/design-system";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { useChatwootRouter } from "../hooks/use-chatwoot-router";
import { TicketHistoryCard } from "./ticket-history-card";

interface ContactHistorySectionProps {
  contactId?: number;
  accountId?: number;
  router: ReturnType<typeof useChatwootRouter>;
}

export const ContactHistorySection: React.FC<ContactHistorySectionProps> = ({ contactId, accountId, router }) => {
  const [conversations, setConversations] = useState<ChatwootConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

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

  const handleConversationClick = (conversation: ChatwootConversation) => {
    router.navigateToConversation(conversation.id.toString(), conversation.inbox_id?.toString());
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (error) {
      return (
        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            backgroundColor: colorTokens.error[50],
            borderRadius: '6px',
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
            textAlign: 'center',
            backgroundColor: colorTokens.neutral[50],
            borderRadius: '8px',
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

    return (
      <Box>
        {conversations.map((convo) => (
          <TicketHistoryCard
            key={convo.id}
            conversation={convo}
            onClick={handleConversationClick}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      {/* Header with Collapse Toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: isExpanded ? 1.5 : 0,
          cursor: 'pointer',
          userSelect: 'none',
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
          Ticket History {conversations.length > 0 && `(${conversations.length})`}
        </Typography>

        <IconButton
          size="small"
          sx={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
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
