import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Panel,
  PanelHeader,
  PanelContent,
  SearchInput,
  EmptyState,
} from '@/widgets/frontdesk/design-system';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Ticket } from '../types/ticket.types';
import { TicketListItem } from './ticket-list-item';

interface TicketListPanelProps {
  viewTitle: string;
  tickets: Ticket[];
  selectedTicketId: string | null;
  selectedTicketIds: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTicketSelect: (ticketId: string) => void;
  onTicketCheck: (ticketId: string, checked: boolean) => void;
  onViewChange?: (view: string) => void;
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
  onViewChange
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
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
          {/* View Title with Dropdown */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              cursor: 'pointer'
            }}
            onClick={handleViewMenuOpen}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {viewTitle}
              </Typography>
              <ArrowDropDownIcon fontSize="small" />
            </Box>
            <IconButton size="small">
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Search Bar */}
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
          {tickets.length === 0 ? (
            <EmptyState
              title="No tickets found"
              description="Try adjusting your search or filters"
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