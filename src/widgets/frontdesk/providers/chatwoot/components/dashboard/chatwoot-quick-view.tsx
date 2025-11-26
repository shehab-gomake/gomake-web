/**
 * Chatwoot Quick View Panel
 *
 * Right sidebar showing conversation summaries in collapsible sections.
 * Based on TicketQuickView from unified dashboard.
 */

import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Collapse, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ConversationListItem, EmptyState } from '@/widgets/frontdesk/design-system';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { ChatwootConversation } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import {
  getConversationName,
  getLastMessage,
  getParticipants,
  getConversationTimestamp,
  isConversationUnread,
  getUnreadCount,
} from '../../utils/conversation-helpers';
import { DASHBOARD_LIMITS } from '../../constants/dashboard.constants';

/**
 * Props for ChatwootQuickView component
 *
 * Displays three collapsible sections showing filtered conversation lists
 */
export interface ChatwootQuickViewProps {
  /** Conversations assigned to current user (for display) */
  myConversations: ChatwootConversation[];

  /** Conversations where user was mentioned (for display) */
  mentionedConversations: ChatwootConversation[];

  /** Conversations that are unassigned (for display) */
  unattendedConversations: ChatwootConversation[];

  /** API-provided counts (accurate across all conversations) */
  counts?: {
    mine?: number;
    unassigned?: number;
    mentions?: number;
  };

  /** Callback when a conversation is clicked */
  onConversationSelect: (conversationId: number, inboxId?: number) => void;

  /** Callback when "View All" is clicked for a section */
  onViewAll: (view: 'my-inbox' | 'mentions' | 'unattended') => void;

  /** Whether the data is currently loading */
  isLoading?: boolean;
}


export const ChatwootQuickView: React.FC<ChatwootQuickViewProps> = ({
  myConversations,
  mentionedConversations,
  unattendedConversations,
  counts,
  onConversationSelect,
  onViewAll,
  isLoading = false,
}) => {
  const theme = useTheme();

  // State for collapsible sections (all expanded by default)
  const [myConversationsExpanded, setMyConversationsExpanded] = useState(true);
  const [mentionsExpanded, setMentionsExpanded] = useState(true);
  const [unattendedExpanded, setUnattendedExpanded] = useState(true);

  // Use API-provided counts if available, otherwise fall back to array length
  const myCount = counts?.mine ?? myConversations.length;
  const unassignedCount = counts?.unassigned ?? unattendedConversations.length;
  const mentionsCount = counts?.mentions ?? mentionedConversations.length;

  const SectionHeader: React.FC<{
    title: string;
    count: number;
    isExpanded: boolean;
    onToggle: () => void;
    onViewAll: () => void;
  }> = ({ title, count, isExpanded, onToggle, onViewAll }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1.5,
        backgroundColor: colorTokens.neutral[50],
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: colorTokens.neutral[100],
        },
      }}
      onClick={onToggle}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          sx={{
            p: 0.25,
            color: colorTokens.neutral[600],
          }}
        >
          {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: colorTokens.neutral[700],
          }}
        >
          {title} ({count})
        </Typography>
      </Box>
      <Button
        size="small"
        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
        onClick={(e) => {
          e.stopPropagation(); // Prevent toggle when clicking View All
          onViewAll();
        }}
        sx={{
          fontSize: '0.75rem',
          textTransform: 'none',
          minWidth: 'auto',
          p: 0.5,
        }}
      >
        View All
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        borderLeft: `1px solid ${colorTokens.neutral[200]}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            color: colorTokens.neutral[900],
          }}
        >
          Conversation Overview
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* My Conversations Section */}
        <Box sx={{ mb: 2 }}>
          <SectionHeader
            title="My Conversations"
            count={myCount}
            isExpanded={myConversationsExpanded}
            onToggle={() => setMyConversationsExpanded(!myConversationsExpanded)}
            onViewAll={() => onViewAll('my-inbox')}
          />
          <Collapse in={myConversationsExpanded}>
            {myConversations.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.813rem', textAlign: 'center' }}
                >
                  No conversations assigned to you
                </Typography>
              </Box>
            ) : (
              <Box>
                {myConversations.slice(0, DASHBOARD_LIMITS.MAX_MY_CONVERSATIONS).map((conversation) => (
                  <ConversationListItem
                    key={conversation.id}
                    id={conversation.id.toString()}
                    title={getConversationName(conversation)}
                    participants={getParticipants(conversation)}
                    snippet={getLastMessage(conversation)}
                    timestamp={getConversationTimestamp(conversation)}
                    isRead={!isConversationUnread(conversation)}
                    isSelected={false}
                    unreadCount={getUnreadCount(conversation)}
                    hasAttachments={false}
                    onClick={() => onConversationSelect(conversation.id, conversation.inbox_id)}
                  />
                ))}
              </Box>
            )}
          </Collapse>
        </Box>

        <Divider />

        {/* Mentions Section */}
        <Box sx={{ my: 2 }}>
          <SectionHeader
            title="Mentions"
            count={mentionsCount}
            isExpanded={mentionsExpanded}
            onToggle={() => setMentionsExpanded(!mentionsExpanded)}
            onViewAll={() => onViewAll('mentions')}
          />
          <Collapse in={mentionsExpanded}>
            {mentionedConversations.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.813rem', textAlign: 'center' }}
                >
                  No mentions
                </Typography>
              </Box>
            ) : (
              <Box>
                {mentionedConversations.slice(0, DASHBOARD_LIMITS.MAX_MENTIONED_CONVERSATIONS).map((conversation) => (
                  <ConversationListItem
                    key={conversation.id}
                    id={conversation.id.toString()}
                    title={getConversationName(conversation)}
                    participants={getParticipants(conversation)}
                    snippet={getLastMessage(conversation)}
                    timestamp={getConversationTimestamp(conversation)}
                    isRead={!isConversationUnread(conversation)}
                    isSelected={false}
                    unreadCount={getUnreadCount(conversation)}
                    hasAttachments={false}
                    onClick={() => onConversationSelect(conversation.id, conversation.inbox_id)}
                  />
                ))}
              </Box>
            )}
          </Collapse>
        </Box>

        <Divider />

        {/* Unattended Section */}
        <Box sx={{ mt: 2 }}>
          <SectionHeader
            title="Unattended"
            count={unassignedCount}
            isExpanded={unattendedExpanded}
            onToggle={() => setUnattendedExpanded(!unattendedExpanded)}
            onViewAll={() => onViewAll('unattended')}
          />
          <Collapse in={unattendedExpanded}>
            {unattendedConversations.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.813rem', textAlign: 'center' }}
                >
                  No unattended conversations
                </Typography>
              </Box>
            ) : (
              <Box>
                {unattendedConversations.slice(0, DASHBOARD_LIMITS.MAX_UNATTENDED_CONVERSATIONS).map((conversation) => (
                  <ConversationListItem
                    key={conversation.id}
                    id={conversation.id.toString()}
                    title={getConversationName(conversation)}
                    participants={getParticipants(conversation)}
                    snippet={getLastMessage(conversation)}
                    timestamp={getConversationTimestamp(conversation)}
                    isRead={!isConversationUnread(conversation)}
                    isSelected={false}
                    unreadCount={getUnreadCount(conversation)}
                    hasAttachments={false}
                    onClick={() => onConversationSelect(conversation.id, conversation.inbox_id)}
                  />
                ))}
              </Box>
            )}
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatwootQuickView;
