import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import { useUnifiedProvider } from './hooks/useAggregatedConversations';
import { UnifiedConversationList } from './components/UnifiedConversationList';
import { TicketDetailHeader } from './components/TicketDetailHeader';
import { UnifiedFilters, UnifiedSortBy } from './types/unified.types';

export const UnifiedProvider: React.FC = () => {
  const theme = useTheme();
  const {
    conversations,
    totalCount,
    unreadCount,
    byProvider,
    selectedConversation,
    filters,
    sortOptions,
    searchQuery,
    selectConversation,
    updateFilters,
    updateSort,
    setSearchQuery,
    clearFilters,
    refreshAll,
    // Ticket-specific data
    availableAgents,
    ticketCategories,
    ticketHistory,
    slaMetrics,
    loadingStates,
    ticketActions,
    createSampleTicket
  } = useUnifiedProvider();
  
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Handle filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };
  
  // Handle sort menu
  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchor(event.currentTarget);
  };
  
  const handleSortClose = () => {
    setSortMenuAnchor(null);
  };
  
  // Toggle provider filter
  const toggleProviderFilter = (provider: 'email' | 'whatsapp' | 'internal') => {
    const currentProviders = filters.providers || [];
    const newProviders = currentProviders.includes(provider)
      ? currentProviders.filter(p => p !== provider)
      : [...currentProviders, provider];
    
    updateFilters({ 
      providers: newProviders.length === 3 ? undefined : newProviders 
    });
  };
  
  // Count active filters
  const activeFilterCount = [
    filters.providers && filters.providers.length < 3,
    filters.unreadOnly,
    filters.assigned !== undefined,
    filters.priority,
    filters.ticketStatus && filters.ticketStatus.length > 0,
    filters.unassigned,
    filters.assigneeId,
    filters.showClosed,
    filters.slaBreached,
    filters.ticketsOnly
  ].filter(Boolean).length;
  
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Left side - List area (for when in standalone mode) */}
      <Box 
        sx={{ 
          width: 380, 
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header with stats */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Unified Inbox
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={createSampleTicket}
                sx={{ mr: 1 }}
              >
                Create Ticket
              </Button>
              <IconButton size="small" onClick={refreshAll}>
                <RefreshIcon fontSize="small" />
              </IconButton>
              <Badge badgeContent={activeFilterCount} color="primary">
                <IconButton size="small" onClick={handleFilterClick}>
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Badge>
              <IconButton size="small" onClick={handleSortClick}>
                <SortIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          {/* SLA Summary Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {slaMetrics.breachedCount > 0 && (
              <Chip
                label={`SLA Breached (${slaMetrics.breachedCount})`}
                size="small"
                sx={{
                  backgroundColor: theme.palette.error.main,
                  color: 'white',
                  fontWeight: 600
                }}
                onClick={() => updateFilters({ slaBreached: true })}
              />
            )}
            {slaMetrics.atRiskCount > 0 && (
              <Chip
                label={`Due Soon (${slaMetrics.atRiskCount})`}
                size="small"
                sx={{
                  backgroundColor: theme.palette.warning.main,
                  color: 'white',
                  fontWeight: 600
                }}
                onClick={() => updateFilters({ slaBreached: false })}
              />
            )}
            {slaMetrics.totalActiveTickets > 0 && (
              <Chip
                label={`Active Tickets (${slaMetrics.totalActiveTickets})`}
                size="small"
                variant="outlined"
                onClick={() => updateFilters({ ticketsOnly: true })}
              />
            )}
          </Box>

          {/* Provider stats */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`📧 Email (${byProvider.email})`}
              size="small"
              variant={filters.providers?.includes('email') ? 'filled' : 'outlined'}
              onClick={() => toggleProviderFilter('email')}
            />
            <Chip
              label={`💬 WhatsApp (${byProvider.whatsapp})`}
              size="small"
              variant={filters.providers?.includes('whatsapp') ? 'filled' : 'outlined'}
              onClick={() => toggleProviderFilter('whatsapp')}
            />
            <Chip
              label={`💬 Direct Messages (${byProvider.internal})`}
              size="small"
              variant={filters.providers?.includes('internal') ? 'filled' : 'outlined'}
              onClick={() => toggleProviderFilter('internal')}
            />
          </Box>
          
          {/* Summary stats */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {totalCount} conversations
            </Typography>
            <Typography variant="body2" color="error">
              {unreadCount} unread
            </Typography>
          </Box>
          
          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Filters:
              </Typography>
              {filters.unreadOnly && (
                <Chip label="Unread" size="small" onDelete={() => updateFilters({ unreadOnly: false })} />
              )}
              {filters.priority && (
                <Chip label={`Priority: ${filters.priority}`} size="small" onDelete={() => updateFilters({ priority: undefined })} />
              )}
              {filters.assigned !== undefined && (
                <Chip label={filters.assigned ? 'Assigned' : 'Unassigned'} size="small" onDelete={() => updateFilters({ assigned: undefined })} />
              )}
              <Button size="small" onClick={clearFilters}>Clear all</Button>
            </Box>
          )}
        </Box>
        
        {/* Conversation list */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <UnifiedConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id}
            onSelect={selectConversation}
            groupByDate={true}
          />
        </Box>
      </Box>
      
      {/* Right side - Message viewer */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedConversation ? (
          <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
            {/* Ticket Detail Header - shown above provider content */}
            <TicketDetailHeader
              conversation={selectedConversation}
              onReply={() => {
                if (selectedConversation.ticketId) {
                  ticketActions.reply(selectedConversation.ticketId, '');
                }
              }}
              onAssign={(assigneeId) => {
                if (selectedConversation.ticketId) {
                  ticketActions.assign(selectedConversation.ticketId, assigneeId);
                }
              }}
              onStatusChange={(status) => {
                if (selectedConversation.ticketId) {
                  ticketActions.updateStatus(selectedConversation.ticketId, status);
                }
              }}
              onPriorityChange={(priority) => {
                if (selectedConversation.ticketId) {
                  ticketActions.updatePriority(selectedConversation.ticketId, priority);
                }
              }}
              onAddNote={() => {
                if (selectedConversation.ticketId) {
                  ticketActions.addNote(selectedConversation.ticketId, '');
                }
              }}
              availableAgents={availableAgents}
              ticketHistory={ticketHistory}
              loading={loadingStates}
            />

            {/* Provider-specific content area */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5">{selectedConversation.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Provider: {selectedConversation.provider}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Messages will be displayed here by routing to the appropriate provider&apos;s message viewer.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: theme.palette.text.secondary
            }}
          >
            <Typography variant="h6">No conversation selected</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Select a conversation from the list to view messages
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => { updateFilters({ unreadOnly: !filters.unreadOnly }); handleFilterClose(); }}>
          {filters.unreadOnly ? '✓' : '  '} Unread Only
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ assigned: filters.assigned === true ? false : true }); handleFilterClose(); }}>
          {filters.assigned === true ? '✓' : '  '} Assigned
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ assigned: filters.assigned === false ? undefined : false }); handleFilterClose(); }}>
          {filters.assigned === false ? '✓' : '  '} Unassigned
        </MenuItem>

        <Divider />

        {/* Ticket Status Filters */}
        <MenuItem onClick={() => { updateFilters({ ticketStatus: ['OPEN'] }); handleFilterClose(); }}>
          {filters.ticketStatus?.includes('OPEN') ? '✓' : '  '} Open Tickets
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ ticketStatus: ['PENDING'] }); handleFilterClose(); }}>
          {filters.ticketStatus?.includes('PENDING') ? '✓' : '  '} Pending
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ ticketStatus: ['IN_PROGRESS'] }); handleFilterClose(); }}>
          {filters.ticketStatus?.includes('IN_PROGRESS') ? '✓' : '  '} In Progress
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ ticketStatus: ['RESOLVED'] }); handleFilterClose(); }}>
          {filters.ticketStatus?.includes('RESOLVED') ? '✓' : '  '} Resolved
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ ticketStatus: ['REOPENED'] }); handleFilterClose(); }}>
          {filters.ticketStatus?.includes('REOPENED') ? '✓' : '  '} Reopened
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ showClosed: true }); handleFilterClose(); }}>
          {filters.showClosed ? '✓' : '  '} Include Closed
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => { updateFilters({ priority: 'high' }); handleFilterClose(); }}>
          {filters.priority === 'high' ? '✓' : '  '} High Priority
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ priority: 'medium' }); handleFilterClose(); }}>
          {filters.priority === 'medium' ? '✓' : '  '} Medium Priority
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => { updateFilters({ slaBreached: true }); handleFilterClose(); }}>
          {filters.slaBreached ? '✓' : '  '} SLA Breached
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ ticketsOnly: true }); handleFilterClose(); }}>
          {filters.ticketsOnly ? '✓' : '  '} Tickets Only
        </MenuItem>
      </Menu>
      
      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => { updateSort({ by: 'recent' }); handleSortClose(); }}>
          {sortOptions.by === 'recent' ? '✓' : '  '} Most Recent
        </MenuItem>
        <MenuItem onClick={() => { updateSort({ by: 'unread' }); handleSortClose(); }}>
          {sortOptions.by === 'unread' ? '✓' : '  '} Unread Count
        </MenuItem>
        <MenuItem onClick={() => { updateSort({ by: 'priority' }); handleSortClose(); }}>
          {sortOptions.by === 'priority' ? '✓' : '  '} Priority
        </MenuItem>
        <MenuItem onClick={() => { updateSort({ by: 'provider' }); handleSortClose(); }}>
          {sortOptions.by === 'provider' ? '✓' : '  '} Provider
        </MenuItem>

        <Divider />

        {/* Ticket-specific sort options */}
        <MenuItem onClick={() => { updateSort({ by: 'sla' }); handleSortClose(); }}>
          {sortOptions.by === 'sla' ? '✓' : '  '} SLA Status
        </MenuItem>
        <MenuItem onClick={() => { updateSort({ by: 'status' }); handleSortClose(); }}>
          {sortOptions.by === 'status' ? '✓' : '  '} Ticket Status
        </MenuItem>
        <MenuItem onClick={() => { updateSort({ by: 'ticketNumber' }); handleSortClose(); }}>
          {sortOptions.by === 'ticketNumber' ? '✓' : '  '} Ticket Number
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UnifiedProvider;