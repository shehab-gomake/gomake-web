import React, { useMemo } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { StatsOverviewCards } from './StatsOverviewCards';
import { ActivityFeedPanel } from './ActivityFeedPanel';
import { TicketQuickView } from './TicketQuickView';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useUnifiedProvider } from '../hooks/useAggregatedConversations';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { useRecoilValue } from 'recoil';
import { ticketsAtom } from '@/store/frontdesk/atoms/tickets.atoms';
import { TicketWithDetails } from '@/widgets/frontdesk/providers/tickets/types';

export const DashboardView: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const stats = useDashboardStats();

  const {
    conversations,
    selectedConversation,
    selectConversation,
  } = useUnifiedProvider();

  // Get all tickets for quick view
  const allTickets = useRecoilValue(ticketsAtom);

  // Filter tickets for quick view sections
  const myTickets = useMemo(
    () =>
      allTickets
        .filter(
          (ticket) =>
            ticket.assignee &&
            (ticket.status === 'OPEN' ||
              ticket.status === 'IN_PROGRESS' ||
              ticket.status === 'PENDING')
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 5),
    [allTickets]
  );

  const unassignedTickets = useMemo(
    () =>
      allTickets
        .filter((ticket) => ticket.status === 'OPEN' && !ticket.assignee)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 3),
    [allTickets]
  );

  const recentlyClosed = useMemo(
    () =>
      allTickets
        .filter((ticket) => ticket.status === 'RESOLVED')
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 3),
    [allTickets]
  );

  // Navigation handlers
  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      case 'unread-messages':
        // Could add a filter for unread
        break;
      case 'open-tickets':
        router.push('/frontdesk/tickets/all-tickets');
        break;
      case 'unassigned-tickets':
        router.push('/frontdesk/tickets/unassigned');
        break;
      default:
        break;
    }
  };

  const handleConversationSelect = (conversation: any) => {
    selectConversation(conversation);

    // Route to the specific provider's view
    switch (conversation.provider) {
      case 'email':
        router.push('/frontdesk/inbox/email');
        break;
      case 'whatsapp':
        router.push('/frontdesk/inbox/whatsapp');
        break;
      case 'internal':
        router.push('/frontdesk/inbox/internal');
        break;
    }
  };

  const handleTicketSelect = (ticketId: string) => {
    router.push(`/frontdesk/tickets/${ticketId}`);
  };

  const handleViewAllTickets = (
    view: 'my-tickets' | 'unassigned' | 'done'
  ) => {
    router.push(`/frontdesk/tickets/${view}`);
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
          Dashboard
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: colorTokens.neutral[600],
            mt: 0.5,
            fontSize: '0.875rem',
          }}
        >
          Overview of all your conversations, tickets, and activity
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Box
        sx={{
          px: 3,
          py: 3,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
        }}
      >
        <StatsOverviewCards stats={stats} onCardClick={handleCardClick} />
      </Box>

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
              {conversations.length} conversations across all channels
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <ActivityFeedPanel
              conversations={conversations}
              selectedId={selectedConversation?.id}
              onSelect={handleConversationSelect}
            />
          </Box>
        </Box>

        {/* Ticket Quick View - Right Sidebar (1/3 width) */}
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
          <TicketQuickView
            myTickets={myTickets}
            unassignedTickets={unassignedTickets}
            recentlyClosed={recentlyClosed}
            onTicketSelect={handleTicketSelect}
            onViewAll={handleViewAllTickets}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardView;
