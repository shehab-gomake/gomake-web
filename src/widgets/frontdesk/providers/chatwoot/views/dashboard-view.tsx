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
import { useAgentDashboardStats, useAdminDashboardStats } from '../hooks/use-chatwoot-dashboard-stats';
import { useChatwootDashboardType } from '../hooks/use-chatwoot-dashboard-type';
import { AgentStatsCards } from '../components/dashboard/agent-stats-cards';
import { AdminStatsCards } from '../components/dashboard/admin-stats-cards';
import { ChatwootActivityFeed } from '../components/dashboard/chatwoot-activity-feed';
import { ChatwootDashboardSidebar } from '../components/dashboard/chatwoot-dashboard-sidebar';
import { useRecoilValue } from 'recoil';
import { chatwootConversationsAtom, chatwootSelectedConversationAtom, chatwootConversationCountsAtom } from '@/store/frontdesk/atoms/chatwoot.atoms';
import { ErrorBoundary } from '@/widgets/frontdesk/components/shared/ErrorBoundary';
import { DASHBOARD_LIMITS } from '../constants/dashboard.constants';
import { ConversationStatus } from '@/services/frontdesk/api/chatwoot/types/conversations.types';
import { RouteBuilder } from '@/widgets/frontdesk/routing/route-builder';
import { ChatwootView } from '@/widgets/frontdesk/routing/types';

export const DashboardView: React.FC = () => {
  const theme = useTheme();
  const { router: chatwootRouter } = useChatwootProvider();
  const dashboardType = useChatwootDashboardType();
  
  // Use role-specific stats hooks - only call the one we need
  const agentStats = useAgentDashboardStats();
  const adminStats = useAdminDashboardStats();
  
  // Select stats based on dashboard type
  const stats = dashboardType === 'admin' ? adminStats : agentStats;

  // Debug logging (remove in production)
  React.useEffect(() => {
    console.log('[DashboardView] Dashboard type:', dashboardType);
    console.log('[DashboardView] Stats:', stats);
  }, [dashboardType, stats]);

  // Get conversations and selection state
  const conversations = useRecoilValue(chatwootConversationsAtom);
  const conversationCounts = useRecoilValue(chatwootConversationCountsAtom);
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

  // Navigation handlers with smart filters
  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      // Agent-specific navigation
      case 'my-open-tickets':
        // Navigate to My Inbox with filters for open tickets assigned to me
        chatwootRouter.navigate(
          RouteBuilder.chatwoot(ChatwootView.MY_INBOX, undefined, undefined, {
            status: 'open',
            assigneeType: 'me',
          })
        );
        break;
      case 'my-resolved-today':
        // Navigate to My Inbox with filters for resolved tickets
        chatwootRouter.navigate(
          RouteBuilder.chatwoot(ChatwootView.MY_INBOX, undefined, undefined, {
            status: 'resolved',
          })
        );
        break;
      case 'my-response-time':
        chatwootRouter.navigateToMyInbox();
        break;
      
      // Admin-specific navigation
      case 'total-open-tickets':
        // Navigate to All Conversations with filters for open tickets
        chatwootRouter.navigate(
          RouteBuilder.chatwoot(ChatwootView.ALL_CONVERSATIONS, undefined, undefined, {
            status: 'open',
          })
        );
        break;
      case 'unassigned-tickets':
        chatwootRouter.navigateToUnattended();
        break;
      case 'team-response-time':
        chatwootRouter.navigateToAllConversations();
        break;
      case 'active-today':
        chatwootRouter.navigateToAllConversations();
        break;
      
      // Common navigation
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
        console.warn('[DashboardView] Unknown card type:', cardType);
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
          FrontDesk
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
            mt: 0.5,
            fontSize: '0.875rem',
          }}
        >
          {dashboardType === 'admin'
            ? 'Team performance and operational overview'
            : 'Your personal performance and tasks'}
        </Typography>
      </Box>

      {/* Stats Overview - Role-specific */}
      <ErrorBoundary context="Dashboard Stats">
        <Box
          sx={{
            px: 3,
            py: 3,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          }}
        >
          {dashboardType === 'admin' ? (
            <AdminStatsCards stats={adminStats} onCardClick={handleCardClick} />
          ) : (
            <AgentStatsCards stats={agentStats} onCardClick={handleCardClick} />
          )}
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
              counts={{
                mine: conversationCounts.mine,
                unassigned: conversationCounts.unassigned,
                // Mentions count is approximate (no API endpoint for this)
                mentions: undefined,
              }}
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
