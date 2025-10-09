import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Panel,
  PanelHeader,
  PanelContent,
  SearchInput,
  EmptyState,
  colorTokens
} from '@/widgets/frontdesk/design-system';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TicketWithDetails, TicketFilters } from '../types/api.types';
import { TicketListItem } from './ticket-list-item';
import { TicketFiltersModal } from './ticket-filters-modal';
import { TicketSortMenu } from './ticket-sort-menu';

interface TicketListPanelProps {
  viewTitle: string;
  tickets: TicketWithDetails[];
  selectedTicketId: string | null;
  selectedTicketIds: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTicketSelect: (ticketId: string) => void;
  onTicketCheck: (ticketId: string, checked: boolean) => void;
  onViewChange?: (view: string) => void;
  isLoading?: boolean;
  error?: string | null;
  filters: TicketFilters;
  activeFilterCount: number;
  onApplyFilters: (filters: TicketFilters) => void;
  onClearFilters: () => void;
}

export const TicketListPanel: React.FC<TicketListPanelProps> = ({
  viewTitle,
  tickets,
  selectedTicketId,
  selectedTicketIds,
  searchQuery,
  onSearchChange,
  onTicketSelect,
  onTicketCheck,
  onViewChange,
  isLoading = false,
  error = null,
  filters,
  activeFilterCount,
  onApplyFilters,
  onClearFilters
}) => {
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const handleViewMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setViewMenuAnchor(event.currentTarget);
  };

  const handleViewMenuClose = () => {
    setViewMenuAnchor(null);
  };

  const handleViewSelect = (view: string) => {
    onViewChange?.(view);
    handleViewMenuClose();
  };

  // Count tickets with unread messages (check if lastMessageAt is recent and no response)
  const unreadCount = tickets.filter(t =>
    t.conversation?.lastMessageAt &&
    !t.firstResponseAt &&
    t.status === 'OPEN'
  ).length;

  // Client-side search on displayed tickets (backend has no search param)
  const displayedTickets = useMemo(() => {
    if (!searchQuery) return tickets;

    const query = searchQuery.toLowerCase();
    return tickets.filter(t => {
      const ticketNum = t.ticketNumber?.toString() || '';
      const conversationName = t.conversation?.name?.toLowerCase() || '';
      const custEmail = t.customerEmail?.toLowerCase() || '';
      const custName = t.customerName?.toLowerCase() || '';
      const custPhone = t.customerPhone || '';

      return (
        ticketNum.includes(query) ||
        conversationName.includes(query) ||
        custEmail.includes(query) ||
        custName.includes(query) ||
        custPhone.includes(query)
      );
    });
  }, [tickets, searchQuery]);

  return (
    <Box sx={{ width: 280, minWidth: 280, height: '100%' }}>
      <Panel
        elevation={0}
        border="default"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with PanelHeader component */}
        <PanelHeader
          title={`${viewTitle}${tickets.length > 0 ? ` (${tickets.length})` : ''}`}
          actions={
            <Box display="flex" gap={0.5}>
              {/* Sort Menu */}
              <TicketSortMenu
                sortBy={filters.sortBy || 'createdAt'}
                sortOrder={filters.sortOrder || 'desc'}
                onSortChange={(sortBy, sortOrder) => {
                  const newFilters = { ...filters, sortBy: sortBy as TicketFilters['sortBy'], sortOrder };
                  onApplyFilters(newFilters);
                }}
              />

              {/* Filter Button */}
              <IconButton
                size="small"
                onClick={() => setFilterModalOpen(true)}
                aria-label="Filter tickets"
              >
                <Badge badgeContent={activeFilterCount} color="primary">
                  <FilterListIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Box>
          }
        />

        {/* Search Bar */}
        <Box sx={{ px: 2, pb: 1.5, borderBottom: `1px solid ${colorTokens.semantic.border.default}` }}>
          <SearchInput
            placeholder="Search tickets"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            showClear={searchQuery.length > 0}
          />
        </Box>

        {/* Ticket List */}
        <PanelContent padding="none" scrollable sx={{ flex: 1 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <CircularProgress size={32} />
            </Box>
          ) : error ? (
            <EmptyState
              title="Error loading tickets"
              description={error}
            />
          ) : displayedTickets.length === 0 ? (
            <EmptyState
              title="No tickets found"
              description={searchQuery ? "Try adjusting your search" : "No tickets match your filters"}
            />
          ) : (
            displayedTickets.map((ticket) => (
              <TicketListItem
                key={ticket.id}
                ticket={ticket}
                selected={selectedTicketId === ticket.id}
                checked={selectedTicketIds.includes(ticket.id)}
                onSelect={onTicketSelect}
                onCheck={onTicketCheck}
              />
            ))
          )}
        </PanelContent>

        {/* View Change Menu */}
        <Menu
          anchorEl={viewMenuAnchor}
          open={Boolean(viewMenuAnchor)}
          onClose={handleViewMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <MenuItem onClick={() => handleViewSelect('my-tickets')}>My Tickets</MenuItem>
          <MenuItem onClick={() => handleViewSelect('unassigned')}>Unassigned</MenuItem>
          <MenuItem onClick={() => handleViewSelect('all-tickets')}>All Tickets</MenuItem>
          <Divider />
          <MenuItem onClick={() => handleViewSelect('done')}>Done</MenuItem>
        </Menu>

        {/* Filter Modal */}
        <TicketFiltersModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          filters={filters}
          onApply={(partialFilters) => {
            onApplyFilters({ ...filters, ...partialFilters, page: 1 });
          }}
          onClear={() => {
            onClearFilters();
            setFilterModalOpen(false);
          }}
        />
      </Panel>
    </Box>
  );
};