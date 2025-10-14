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
  colorTokens,
  TagFilterChips,
} from '@/widgets/frontdesk/design-system';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TicketWithDetails, TicketFilters, Tag } from '../types/api.types';
import { TicketListItem } from './ticket-list-item';
import { TicketFiltersMenu } from './ticket-filters-menu';
import { TicketSortMenu } from './ticket-sort-menu';

interface TicketListPanelProps {
  viewTitle: string;
  tickets: TicketWithDetails[];
  selectedTicketId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTicketSelect: (ticketId: string) => void;
  onViewChange?: (view: string) => void;
  isLoading?: boolean;
  error?: string | null;
  filters: TicketFilters;
  activeFilterCount: number;
  onApplyFilters: (filters: TicketFilters) => void;
  onClearFilters: () => void;
  onTagClick?: (tag: Tag) => void;
  popularTags?: Tag[];
  onFetchPopularTags?: () => void;
}

export const TicketListPanel: React.FC<TicketListPanelProps> = ({
  viewTitle,
  tickets,
  selectedTicketId,
  searchQuery,
  onSearchChange,
  onTicketSelect,
  onViewChange,
  isLoading = false,
  error = null,
  filters,
  activeFilterCount,
  onApplyFilters,
  onClearFilters,
  onTagClick,
  popularTags = [],
  onFetchPopularTags,
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
    t.conversation?.lastMessageAt &&
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

              {/* Filter Menu */}
              <TicketFiltersMenu
                filters={filters}
                onApply={(partialFilters) => {
                  onApplyFilters({ ...filters, ...partialFilters, page: 1 });
                }}
                onClear={onClearFilters}
                activeFilterCount={activeFilterCount}
                popularTags={popularTags}
                onFetchPopularTags={onFetchPopularTags}
              />
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

        {/* Active Tag Filters */}
        {filters.tags && filters.tags.length > 0 && (
          <TagFilterChips
            tags={filters.tags.map((tagName) => ({
              id: tagName,
              name: tagName,
              displayName: tagName,
              color: null,
              category: 'GENERAL' as any,
              usageCount: 0,
              isSystem: false,
              printHouseId: '',
              createdAt: '',
            }))}
            onRemoveTag={(tag) => {
              const newTags = filters.tags?.filter(t => t !== tag.name) || [];
              onApplyFilters({ ...filters, tags: newTags.length > 0 ? newTags : undefined, page: 1 });
            }}
            onClearAll={() => {
              onApplyFilters({ ...filters, tags: undefined, page: 1 });
            }}
          />
        )}

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
              description={searchQuery ? "Try adjusting your search" : "No tickets match your filters"}
            />
          ) : (
            tickets.map((ticket) => (
              <TicketListItem
                key={ticket.id}
                ticket={ticket}
                selected={selectedTicketId === ticket.id}
                onSelect={onTicketSelect}
                onTagClick={onTagClick}
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
          <MenuItem onClick={() => handleViewSelect('resolved')}>Resolved</MenuItem>
        </Menu>
      </Panel>
    </Box>
  );
};