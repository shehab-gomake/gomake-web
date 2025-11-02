/**
 * Chatwoot Dashboard View
 *
 * Main dashboard for Chatwoot showing stats, activity feed, and quick views.
 * Follows the same structure as the unified dashboard but specifically for Chatwoot data.
 */

import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { useChatwootProvider } from '../hooks/use-chatwoot-provider';
import { useChatwootDashboardStats } from '../hooks/use-chatwoot-dashboard-stats';
import { ChatwootStatsCards } from '../components/dashboard/chatwoot-stats-cards';
import { ChatwootActivityFeed } from '../components/dashboard/chatwoot-activity-feed';
import { ChatwootDashboardSidebar } from '../components/dashboard/chatwoot-dashboard-sidebar';
import { useRecoilValue } from 'recoil';
import { chatwootConversationsAtom, chatwootSelectedConversationAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { ErrorBoundary } from '@/widgets/frontdesk/components/shared/ErrorBoundary';
import { DASHBOARD_LIMITS } from '../constants/dashboard.constants';
import { ConversationStatus } from '@/services/frontdesk/api/chatwoot/types/conversations.types';

export const DashboardView: React.FC = () => {
  const theme = useTheme();
  const { router: chatwootRouter } = useChatwootProvider();
  const stats = useChatwootDashboardStats();

  // Get conversations and selection state
  const conversations = useRecoilValue(chatwootConversationsAtom);
  const selectedConversation = useRecoilValue(chatwootSelectedConversationAtom);

  // Filter conversations for quick view sections
  // Memoized to prevent recalculation on every render
  const filteredConversations = useMemo(() => {
    // Helper function to sort by timestamp descending
    // Handles Unix timestamps (numbers) and ISO strings
    const sortByTimestamp = (a: typeof conversations[0], b: typeof conversations[0]) => {
      const getTimestamp = (conv: typeof conversations[0]): number => {
        const rawTimestamp = conv.updated_at || conv.created_at || conv.timestamp;
        if (!rawTimestamp) return 0;
        if (typeof rawTimestamp === 'number') {
          // Unix timestamp (seconds) - convert to milliseconds
          return rawTimestamp * 1000;
        }
        // ISO string
        const date = new Date(rawTimestamp);
        return isNaN(date.getTime()) ? 0 : date.getTime();
      };
      
      const aTime = getTimestamp(a);
      const bTime = getTimestamp(b);
      return bTime - aTime;
    };

    return {
      my: conversations
        .filter((conv) => conv.status === ConversationStatus.OPEN && conv.meta?.assignee?.id)
        .sort(sortByTimestamp)
        .slice(0, DASHBOARD_LIMITS.MAX_MY_CONVERSATIONS),

      mentioned: conversations
        .filter((conv) => conv.unread_count > 0 && conv.meta?.sender?.name)
        .sort(sortByTimestamp)
        .slice(0, DASHBOARD_LIMITS.MAX_MENTIONED_CONVERSATIONS),

      unattended: conversations
        .filter((conv) => conv.status === ConversationStatus.OPEN && !conv.meta?.assignee?.id)
        .sort(sortByTimestamp)
        .slice(0, DASHBOARD_LIMITS.MAX_UNATTENDED_CONVERSATIONS),
    };
  }, [conversations]);

  // Navigation handlers
  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      case 'unread-conversations':
        chatwootRouter.navigateToMyInbox();
        break;
      case 'open-conversations':
        chatwootRouter.navigateToAllConversations();
        break;
      case 'mentions':
        chatwootRouter.navigateToMentions();
        break;
      case 'unattended':
        chatwootRouter.navigateToUnattended();
        break;
      default:
        break;
    }
  };

  const handleConversationSelect = (conversationId: number, inboxId?: number) => {
    const channelId = inboxId?.toString();
    chatwootRouter.navigateToConversation(conversationId.toString(), channelId);
  };

  const handleViewAllConversations = (
    view: 'my-inbox' | 'mentions' | 'unattended'
  ) => {
    switch (view) {
      case 'my-inbox':
        chatwootRouter.navigateToMyInbox();
        break;
      case 'mentions':
        chatwootRouter.navigateToMentions();
        break;
      case 'unattended':
        chatwootRouter.navigateToUnattended();
        break;
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colorTokens.neutral[50],
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            color: colorTokens.neutral[900],
          }}
        >
          Chatwoot Dashboard
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
            mt: 0.5,
            fontSize: '0.875rem',
          }}
        >
          Overview of all your Chatwoot conversations, notifications, and activity
        </Typography>
      </Box>

      {/* Stats Overview */}
      <ErrorBoundary context="Dashboard Stats">
        <Box
          sx={{
            px: 3,
            py: 3,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          }}
        >
          <ChatwootStatsCards stats={stats} onCardClick={handleCardClick} />
        </Box>
      </ErrorBoundary>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Activity Feed - Left Side (2/3 width) */}
        <ErrorBoundary context="Activity Feed">
          <Box
            sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRight: `1px solid ${colorTokens.neutral[200]}`,
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2,
                backgroundColor: theme.palette.background.paper,
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
                Recent Activity
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colorTokens.neutral[600],
                  mt: 0.5,
                  fontSize: '0.813rem',
                }}
              >
                {conversations.length} conversations
              </Typography>
            </Box>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <ChatwootActivityFeed
                conversations={conversations}
                selectedId={selectedConversation?.id}
                onSelect={handleConversationSelect}
              />
            </Box>
          </Box>
        </ErrorBoundary>

        {/* Dashboard Sidebar with Tabs - Right Sidebar (1/3 width) */}
        <ErrorBoundary context="Dashboard Sidebar">
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minWidth: 320,
              maxWidth: 400,
            }}
          >
            <ChatwootDashboardSidebar
              myConversations={filteredConversations.my}
              mentionedConversations={filteredConversations.mentioned}
              unattendedConversations={filteredConversations.unattended}
              onConversationSelect={handleConversationSelect}
              onViewAll={handleViewAllConversations}
              unreadNotificationCount={stats.unreadNotifications}
            />
          </Box>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default DashboardView;
