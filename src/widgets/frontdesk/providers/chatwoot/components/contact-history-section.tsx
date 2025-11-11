/**
 * Contact History Section
 *
 * Displays the conversation history for the selected contact.
 */

import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Link } from "@mui/material";
import { chatwootService } from "@/services/frontdesk";
import type { ChatwootConversation } from "@/services/frontdesk/api/chatwoot/types/conversations.types";
import type { useChatwootRouter } from "../hooks/use-chatwoot-router";

interface ContactHistorySectionProps {
  contactId?: number;
  accountId?: number;
  router: ReturnType<typeof useChatwootRouter>;
}

export const ContactHistorySection: React.FC<ContactHistorySectionProps> = ({ contactId, accountId, router }) => {
  const [conversations, setConversations] = useState<ChatwootConversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contactId || !accountId) {
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await chatwootService.contacts.getContactConversations(accountId, contactId);
        setConversations(response.payload);
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
      return <CircularProgress size={24} />;
    }

    if (error) {
      return <Typography variant="body2" color="error">{error}</Typography>;
    }

    if (conversations.length === 0) {
      return <Typography variant="body2">No past conversations.</Typography>;
    }

    return (
      <Box>
        {conversations.map((convo) => (
          <Box key={convo.id} sx={{ mb: 1 }}>
            <Link component="button" variant="body2" onClick={() => handleConversationClick(convo)} sx={{ textAlign: 'left' }}>
              Conversation #{convo.id}
            </Link>
            <Typography variant="caption" color="text.secondary" component="div">
              {new Date(convo.created_at * 1000).toLocaleDateString()}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="caption"
        sx={{
          mb: 1,
          display: "block",
          fontWeight: 600,
          textTransform: "uppercase",
          fontSize: 10,
        }}
      >
        Contact History
      </Typography>
      {renderContent()}
    </Box>
  );
};
