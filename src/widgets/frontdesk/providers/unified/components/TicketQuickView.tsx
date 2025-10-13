import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Collapse, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Panel, PanelHeader, PanelContent, TicketListItem, EmptyState } from '@/widgets/frontdesk/design-system';
import { TicketWithDetails, TicketPriority } from '@/widgets/frontdesk/providers/tickets/types';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Helper to map backend priority (UPPERCASE) to design system priority (Title Case)
const mapPriority = (priority: TicketPriority): 'Urgent' | 'High' | 'Medium' | 'Low' => {
  switch (priority) {
    case 'URGENT':
      return 'Urgent';
    case 'HIGH':
      return 'High';
    case 'MEDIUM':
      return 'Medium';
    case 'LOW':
      return 'Low';
    default:
      return 'Low';
  }
};

export interface TicketQuickViewProps {
  myTickets: TicketWithDetails[];
  unassignedTickets: TicketWithDetails[];
  recentlyClosed: TicketWithDetails[];
  onTicketSelect: (ticketId: string) => void;
  onViewAll: (view: 'my-tickets' | 'unassigned' | 'done') => void;
  isLoading?: boolean;
}

export const TicketQuickView: React.FC<TicketQuickViewProps> = ({
  myTickets,
  unassignedTickets,
  recentlyClosed,
  onTicketSelect,
  onViewAll,
  isLoading = false,
}) => {
  const theme = useTheme();

  // State for collapsible sections (all expanded by default)
  const [myTicketsExpanded, setMyTicketsExpanded] = useState(true);
  const [unassignedExpanded, setUnassignedExpanded] = useState(true);
  const [recentlyClosedExpanded, setRecentlyClosedExpanded] = useState(true);

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
          Ticket Overview
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* My Tickets Section */}
        <Box sx={{ mb: 2 }}>
          <SectionHeader
            title="My Tickets"
            count={myTickets.length}
            isExpanded={myTicketsExpanded}
            onToggle={() => setMyTicketsExpanded(!myTicketsExpanded)}
            onViewAll={() => onViewAll('my-tickets')}
          />
          <Collapse in={myTicketsExpanded}>
            {myTickets.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.813rem', textAlign: 'center' }}
                >
                  No tickets assigned to you
                </Typography>
              </Box>
            ) : (
              <Box>
                {myTickets.slice(0, 5).map((ticket) => (
                  <TicketListItem
                    key={ticket.id}
                    id={ticket.id}
                    ticketNumber={String(ticket.ticketNumber)}
                    title={ticket.conversation?.name || `Ticket ${ticket.ticketNumber}`}
                    status={ticket.status}
                    priority={mapPriority(ticket.priority)}
                    updatedAt={new Date(ticket.updatedAt).toLocaleDateString()}
                    isUnread={false}
                    onClick={() => onTicketSelect(ticket.id)}
                  />
                ))}
              </Box>
            )}
          </Collapse>
        </Box>

        <Divider />

        {/* Unassigned Tickets Section */}
        <Box sx={{ my: 2 }}>
          <SectionHeader
            title="Unassigned"
            count={unassignedTickets.length}
            isExpanded={unassignedExpanded}
            onToggle={() => setUnassignedExpanded(!unassignedExpanded)}
            onViewAll={() => onViewAll('unassigned')}
          />
          <Collapse in={unassignedExpanded}>
            {unassignedTickets.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.813rem', textAlign: 'center' }}
                >
                  All tickets are assigned
                </Typography>
              </Box>
            ) : (
              <Box>
                {unassignedTickets.slice(0, 3).map((ticket) => (
                  <TicketListItem
                    key={ticket.id}
                    id={ticket.id}
                    ticketNumber={String(ticket.ticketNumber)}
                    title={ticket.conversation?.name || `Ticket ${ticket.ticketNumber}`}
                    status={ticket.status}
                    priority={mapPriority(ticket.priority)}
                    updatedAt={new Date(ticket.updatedAt).toLocaleDateString()}
                    isUnread={false}
                    onClick={() => onTicketSelect(ticket.id)}
                  />
                ))}
              </Box>
            )}
          </Collapse>
        </Box>

        <Divider />

        {/* Recently Closed Section */}
        <Box sx={{ mt: 2 }}>
          <SectionHeader
            title="Recently Closed"
            count={recentlyClosed.length}
            isExpanded={recentlyClosedExpanded}
            onToggle={() => setRecentlyClosedExpanded(!recentlyClosedExpanded)}
            onViewAll={() => onViewAll('done')}
          />
          <Collapse in={recentlyClosedExpanded}>
            {recentlyClosed.length === 0 ? (
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.813rem', textAlign: 'center' }}
                >
                  No recently closed tickets
                </Typography>
              </Box>
            ) : (
              <Box>
                {recentlyClosed.slice(0, 3).map((ticket) => (
                  <TicketListItem
                    key={ticket.id}
                    id={ticket.id}
                    ticketNumber={String(ticket.ticketNumber)}
                    title={ticket.conversation?.name || `Ticket ${ticket.ticketNumber}`}
                    status={ticket.status}
                    priority={mapPriority(ticket.priority)}
                    updatedAt={new Date(ticket.updatedAt).toLocaleDateString()}
                    isUnread={false}
                    onClick={() => onTicketSelect(ticket.id)}
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

export default TicketQuickView;
