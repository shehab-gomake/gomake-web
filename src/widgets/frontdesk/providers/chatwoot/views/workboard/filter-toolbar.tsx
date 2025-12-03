/**
 * Filter Toolbar Component
 * 
 * Provides filtering controls for the Kanban board.
 * Includes search, inbox filter, priority filter, and quick filter buttons.
 * 
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  TextField, 
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Button,
  Collapse,
  alpha,
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Inbox as InboxIcon,
  PriorityHigh as PriorityIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Label as LabelIcon,
} from '@mui/icons-material';

// Design system
import { 
  colorTokens, 
  shadowTokens, 
  radiusTokens, 
  semanticSpacing,
} from '@/widgets/frontdesk/design-system';

// Types
import type { ChatwootInbox } from '@/services/frontdesk/api/chatwoot/types/inboxes.types';
import type { Agent } from '@/services/frontdesk/api/chatwoot/types/agents.types';
import { KanbanConversationFilters } from '../../types/kanban.types';
import { ConversationPriority } from '@/services/frontdesk/api/chatwoot/types/conversations.types';

// ============================================
// Types
// ============================================

export interface FilterToolbarProps {
  filters: KanbanConversationFilters;
  onFiltersChange: (filters: Partial<KanbanConversationFilters>) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  inboxes: ChatwootInbox[];
  agents: Agent[];
  inboxesLoading?: boolean;
}

// Priority options
const PRIORITY_OPTIONS: { value: ConversationPriority | ''; label: string }[] = [
  { value: '', label: 'All Priorities' },
  { value: ConversationPriority.URGENT, label: 'Urgent' },
  { value: ConversationPriority.HIGH, label: 'High' },
  { value: ConversationPriority.MEDIUM, label: 'Medium' },
  { value: ConversationPriority.LOW, label: 'Low' },
];

// Quick filter presets
interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  filters: Partial<KanbanConversationFilters>;
  color: string;
}

const QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'urgent',
    label: 'Urgent',
    icon: <WarningIcon sx={{ fontSize: 16 }} />,
    filters: { priority: ConversationPriority.URGENT },
    color: colorTokens.error[500],
  },
  {
    id: 'high-priority',
    label: 'High Priority',
    icon: <PriorityIcon sx={{ fontSize: 16 }} />,
    filters: { priority: ConversationPriority.HIGH },
    color: colorTokens.warning[600],
  },
];

// ============================================
// Component
// ============================================

const FilterToolbarComponent: React.FC<FilterToolbarProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFilterCount,
  inboxes,
  agents,
  inboxesLoading,
}) => {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Debounce the filter update
    const timeoutId = setTimeout(() => {
      onFiltersChange({ search: value || undefined });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [onFiltersChange]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    onFiltersChange({ search: undefined });
  }, [onFiltersChange]);

  const handleInboxChange = useCallback((e: any) => {
    const value = e.target.value;
    onFiltersChange({ inboxId: value || undefined });
  }, [onFiltersChange]);

  const handlePriorityChange = useCallback((e: any) => {
    const value = e.target.value;
    onFiltersChange({ priority: value || undefined });
  }, [onFiltersChange]);

  const handleQuickFilterClick = useCallback((quickFilter: QuickFilter) => {
    // Toggle the filter
    const isActive = filters.priority === quickFilter.filters.priority;
    if (isActive) {
      onFiltersChange({ priority: undefined });
    } else {
      onFiltersChange(quickFilter.filters);
    }
  }, [filters, onFiltersChange]);

  const handleClearAll = useCallback(() => {
    setSearchValue('');
    onClearFilters();
  }, [onClearFilters]);

  // Check if a quick filter is active
  const isQuickFilterActive = useCallback((quickFilter: QuickFilter) => {
    return filters.priority === quickFilter.filters.priority;
  }, [filters]);

  return (
    <Box
      sx={{
        backgroundColor: colorTokens.semantic.background.primary,
        borderBottom: `1px solid ${colorTokens.neutral[200]}`,
      }}
    >
      {/* Main Toolbar */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          padding: `${semanticSpacing.component.sm}px ${semanticSpacing.component.lg}px`,
        }}
      >
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search contacts, messages..."
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            minWidth: 280,
            '& .MuiOutlinedInput-root': {
              borderRadius: `${radiusTokens.md}px`,
              backgroundColor: colorTokens.neutral[50],
              '&:hover': {
                backgroundColor: colorTokens.neutral[100],
              },
              '&.Mui-focused': {
                backgroundColor: colorTokens.semantic.background.primary,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colorTokens.neutral[400], fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Quick Filters */}
        <Stack direction="row" spacing={1}>
          {QUICK_FILTERS.map((qf) => (
            <Chip
              key={qf.id}
              label={qf.label}
              icon={qf.icon as React.ReactElement}
              onClick={() => handleQuickFilterClick(qf)}
              variant={isQuickFilterActive(qf) ? 'filled' : 'outlined'}
              sx={{
                borderColor: isQuickFilterActive(qf) ? qf.color : colorTokens.neutral[300],
                backgroundColor: isQuickFilterActive(qf) ? alpha(qf.color, 0.1) : 'transparent',
                color: isQuickFilterActive(qf) ? qf.color : colorTokens.semantic.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(qf.color, 0.15),
                  borderColor: qf.color,
                },
                '& .MuiChip-icon': {
                  color: isQuickFilterActive(qf) ? qf.color : colorTokens.neutral[500],
                },
              }}
            />
          ))}
        </Stack>

        {/* Spacer */}
        <Box flex={1} />

        {/* Inbox Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: '0.85rem' }}>Inbox</InputLabel>
          <Select
            value={filters.inboxId || ''}
            onChange={handleInboxChange}
            label="Inbox"
            sx={{
              borderRadius: `${radiusTokens.md}px`,
              fontSize: '0.85rem',
            }}
          >
            <MenuItem value="">All Inboxes</MenuItem>
            {inboxes.map((inbox) => (
              <MenuItem key={inbox.id} value={inbox.id}>
                {inbox.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Priority Filter */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel sx={{ fontSize: '0.85rem' }}>Priority</InputLabel>
          <Select
            value={filters.priority || ''}
            onChange={handlePriorityChange}
            label="Priority"
            sx={{
              borderRadius: `${radiusTokens.md}px`,
              fontSize: '0.85rem',
            }}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Clear All Button */}
        {activeFilterCount > 0 && (
          <Tooltip title="Clear all filters">
            <Button
              size="small"
              variant="text"
              onClick={handleClearAll}
              startIcon={<ClearIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: colorTokens.error[600],
                fontSize: '0.8rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: colorTokens.error[50],
                },
              }}
            >
              Clear ({activeFilterCount})
            </Button>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
};

export const FilterToolbar = memo(FilterToolbarComponent);

