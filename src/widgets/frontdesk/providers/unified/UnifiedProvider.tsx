import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUnifiedProvider } from './hooks/useAggregatedConversations';
import { UnifiedConversationList } from './components/UnifiedConversationList';
import { UnifiedConversation } from './types/unified.types';

// Import provider state atoms for routing
import { emailSelectedConversationAtom } from '@/store/frontdesk/atoms/email.atoms';
import { whatsappSelectedConversationAtom } from '@/store/frontdesk/atoms/whatsapp.atoms';
import { internalSelectedDMConversationAtom } from '@/store/frontdesk/atoms/internal.atoms';

// Import provider views
import { EmailProviderView } from '@/widgets/frontdesk/providers/email/email-provider-view';
import { WhatsAppProviderView } from '@/widgets/frontdesk/providers/whatsapp/whatsapp-provider-view';
import DirectMessagesProviderView from '@/widgets/frontdesk/providers/internal/direct-messages-provider-view';

export const UnifiedProvider: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const {
    conversations,
    totalCount,
    unreadCount,
    byProvider,
    selectedConversation,
    filters,
    sortOptions,
    selectConversation,
    updateFilters,
    updateSort,
    clearFilters,
    refreshAll
  } = useUnifiedProvider();

  // State setters for routing to specific providers
  const setSelectedEmail = useSetRecoilState(emailSelectedConversationAtom);
  const setSelectedWhatsApp = useSetRecoilState(whatsappSelectedConversationAtom);
  const setSelectedDM = useSetRecoilState(internalSelectedDMConversationAtom);

  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);

  // Handle conversation selection and route to appropriate provider
  const handleConversationSelect = (conversation: UnifiedConversation) => {
    selectConversation(conversation);

    // Route to the specific provider's view based on conversation type
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
    filters.priority
  ].filter(Boolean).length;

  return (
    <>
      {/* Header with stats and filters */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Unified Inbox
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
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

        {/* Provider stats chips */}
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
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
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
          onSelect={handleConversationSelect}
          groupByDate={true}
        />
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
        <MenuItem onClick={() => { updateFilters({ priority: 'high' }); handleFilterClose(); }}>
          {filters.priority === 'high' ? '✓' : '  '} High Priority
        </MenuItem>
        <MenuItem onClick={() => { updateFilters({ priority: 'medium' }); handleFilterClose(); }}>
          {filters.priority === 'medium' ? '✓' : '  '} Medium Priority
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
      </Menu>
    </>
  );
};

export default UnifiedProvider;