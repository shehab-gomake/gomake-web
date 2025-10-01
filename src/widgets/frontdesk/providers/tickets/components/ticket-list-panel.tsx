import React, { useState } from 'react';
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
import { TicketWithDetails } from '../types/api.types';
import { TicketListItem } from './ticket-list-item';

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
  error = null
}) => {
  const [viewMenuAnchor, setViewMenuAnchor] = useState<null | HTMLElement>(null);

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
    t.conversation.lastMessageAt &&
    !t.firstResponseAt &&
    t.status === 'OPEN'
  ).length;

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
            <IconButton size="small" aria-label="Filter tickets">
              <Badge badgeContent={0} color="primary">
                <FilterListIcon fontSize="small" />
              </Badge>
            </IconButton>
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
          ) : tickets.length === 0 ? (
            <EmptyState
              title="No tickets found"
              description={searchQuery ? "Try adjusting your search" : "No tickets in this view"}
            />
          ) : (
            tickets.map((ticket) => (
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
          <MenuItem onClick={() => handleViewSelect('past-due')}>Past Due</MenuItem>
          <MenuItem onClick={() => handleViewSelect('high-priority')}>High Priority</MenuItem>
          <MenuItem onClick={() => handleViewSelect('unassigned')}>Unassigned</MenuItem>
          <Divider />
          <MenuItem onClick={() => handleViewSelect('all-tickets')}>All Tickets</MenuItem>
        </Menu>
      </Panel>
    </Box>
  );
};