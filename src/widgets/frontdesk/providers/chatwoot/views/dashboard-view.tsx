/**
 * Chatwoot Dashboard View
 *
 * Main dashboard for Chatwoot showing stats, activity feed, and quick views.
 * Follows the same structure as the unified dashboard but specifically for Chatwoot data.
 */

import React, { useMemo } from 'react';
import { Box, Typography, Stack, IconButton, Tooltip, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { useChatwootProvider } from '../hooks/use-chatwoot-provider';
import { useAgentDashboardStats, useAdminDashboardStats } from '../hooks/use-chatwoot-dashboard-stats';
import { useChatwootDashboardType } from '../hooks/use-chatwoot-dashboard-type';
import { useChatwootNotifications } from '../hooks/use-chatwoot-notifications';
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
  const { router: chatwootRouter, refresh: refreshConversations } = useChatwootProvider();
  const dashboardType = useChatwootDashboardType();
  const { refresh: refreshNotifications } = useChatwootNotifications();
  
  // Use role-specific stats hooks - only call the one we need
  const agentStats = useAgentDashboardStats();
  const adminStats = useAdminDashboardStats();
  
  // Select stats based on dashboard type
  const stats = dashboardType === 'admin' ? adminStats : agentStats;

  // Simple refresh handler
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshConversations();
    refreshNotifications();
    setTimeout(() => setIsRefreshing(false), 500);
  };

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
          px: 4,
          py: 3.5,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${colorTokens.neutral[25]} 50%, ${theme.palette.background.paper} 100%)`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.main} 100%)`,
            opacity: 0.6,
          },
        }}
      >
        <Stack direction="row" spacing={2.5} alignItems="flex-start" justifyContent="space-between">
          <Stack direction="row" spacing={2.5} alignItems="flex-start" sx={{ flex: 1 }}>
            {/* Icon Container */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 2.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
                border: `1.5px solid ${theme.palette.primary.main}25`,
                boxShadow: `0 2px 8px ${theme.palette.primary.main}15`,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 2.5,
                  padding: '1.5px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}40, transparent)`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                },
              }}
            >
              <DashboardIcon
                sx={{
                  fontSize: 32,
                  color: theme.palette.primary.main,
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
              />
            </Box>

            {/* Title and Subtitle */}
            <Box sx={{ flex: 1, pt: 0.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.75 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.875rem',
                    lineHeight: 1.2,
                    color: colorTokens.neutral[900],
                    letterSpacing: '-0.025em',
                    background: `linear-gradient(135deg, ${colorTokens.neutral[900]} 0%, ${colorTokens.neutral[700]} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  FrontDesk
                </Typography>
                <Chip
                  icon={dashboardType === 'admin' ? <AdminPanelSettingsIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 16 }} />}
                  label={dashboardType === 'admin' ? 'Admin' : 'Agent'}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: dashboardType === 'admin' 
                      ? `${theme.palette.primary.main}15` 
                      : `${colorTokens.neutral[200]}`,
                    color: dashboardType === 'admin' 
                      ? theme.palette.primary.main 
                      : colorTokens.neutral[700],
                    border: `1px solid ${dashboardType === 'admin' ? theme.palette.primary.main + '30' : colorTokens.neutral[300]}`,
                    '& .MuiChip-icon': {
                      color: dashboardType === 'admin' 
                        ? theme.palette.primary.main 
                        : colorTokens.neutral[600],
                    },
                  }}
                />
              </Stack>
              <Typography
                variant="body1"
                sx={{
                  color: colorTokens.neutral[600],
                  fontSize: '0.938rem',
                  lineHeight: 1.6,
                  fontWeight: 400,
                  maxWidth: '600px',
                }}
              >
                {dashboardType === 'admin'
                  ? 'Team performance and operational overview'
                  : 'Your personal performance and tasks'}
              </Typography>
            </Box>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 0.5 }}>
            <Tooltip title="Refresh dashboard" arrow>
              <IconButton
                onClick={handleRefresh}
                disabled={isRefreshing}
                size="medium"
                sx={{
                  color: colorTokens.neutral[600],
                  backgroundColor: colorTokens.neutral[100],
                  border: `1px solid ${colorTokens.neutral[200]}`,
                  width: 40,
                  height: 40,
                  '&:hover:not(:disabled)': {
                    backgroundColor: colorTokens.neutral[200],
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main + '40',
                    transform: 'rotate(180deg)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                  transition: 'all 0.2s ease-in-out',
                  ...(isRefreshing && {
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }),
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
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
