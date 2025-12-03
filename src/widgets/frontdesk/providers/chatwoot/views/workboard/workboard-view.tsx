/**
 * Workboard View Component - Control Station
 * 
 * Main view for the Kanban board of Chatwoot conversations.
 * Serves as a comprehensive control station for managing all conversations.
 * 
 * Features:
 * - Statistics panel with key metrics
 * - Filter toolbar with search, quick filters
 * - View toggle (status/assignee)
 * - Kanban board with drag-and-drop
 * - Quick actions on cards
 * - Auto-refresh capability
 * 
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo, useCallback } from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  IconButton, 
  Tooltip, 
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  alpha,
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  AutorenewOutlined as AutoRefreshIcon,
} from '@mui/icons-material';

// Design system
import { 
  colorTokens, 
  semanticSpacing,
  shadowTokens,
  radiusTokens,
} from '@/widgets/frontdesk/design-system';

// Components
import { StatisticsPanel } from './statistics-panel';
import { FilterToolbar } from './filter-toolbar';
import { WorkloadHeader } from './workload-header';
import { ViewToggle } from './view-toggle';
import { KanbanBoard } from './kanban-board';

// Hooks
import { useKanbanBoard } from '../../hooks/use-kanban-board';

// ============================================
// Component
// ============================================

const WorkboardViewComponent: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    columns,
    conversations,
    filters,
    setFilters,
    clearFilters,
    activeFilterCount,
    isLoading,
    isOperationLoading,
    error,
    agents,
    agentsLoading,
    inboxes,
    inboxesLoading,
    refreshBoard,
    handleDragEnd,
    resolveConversation,
    snoozeConversation,
    assignConversation,
    setPriority,
    enableAutoRefresh,
    setEnableAutoRefresh,
  } = useKanbanBoard();

  // Handle refresh click
  const handleRefresh = useCallback(() => {
    refreshBoard();
  }, [refreshBoard]);

  // Handle auto-refresh toggle
  const handleAutoRefreshToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableAutoRefresh(e.target.checked);
  }, [setEnableAutoRefresh]);

  // Total active conversations
  const activeCount = conversations.filter(c => c.status !== 'resolved').length;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colorTokens.neutral[100],
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: colorTokens.semantic.background.primary,
          borderBottom: `1px solid ${colorTokens.neutral[200]}`,
          boxShadow: shadowTokens.sm,
          zIndex: 10,
        }}
      >
        {/* Title Row */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            padding: `${semanticSpacing.component.md}px ${semanticSpacing.component.lg}px`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: `${radiusTokens.md}px`,
                backgroundColor: colorTokens.primary[50],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DashboardIcon sx={{ color: colorTokens.primary[600], fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: colorTokens.semantic.text.primary,
                  lineHeight: 1.2,
                }}
              >
                Control Station
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colorTokens.semantic.text.secondary,
                  fontSize: '0.85rem',
                }}
              >
                {activeCount} active conversations • {agents.length} agents
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            {/* View Toggle */}
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Auto-refresh Toggle */}
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={enableAutoRefresh}
                  onChange={handleAutoRefreshToggle}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: colorTokens.primary[500],
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: colorTokens.primary[400],
                    },
                  }}
                />
              }
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AutoRefreshIcon sx={{ fontSize: 16, color: enableAutoRefresh ? colorTokens.primary[500] : colorTokens.neutral[400] }} />
                  <Typography variant="caption" sx={{ color: colorTokens.semantic.text.secondary }}>
                    Auto
                  </Typography>
                </Stack>
              }
              sx={{ mr: 0 }}
            />

            {/* Refresh Button */}
            <Tooltip title="Refresh now">
              <IconButton
                onClick={handleRefresh}
                disabled={isLoading}
                sx={{
                  color: colorTokens.semantic.text.secondary,
                  backgroundColor: colorTokens.neutral[100],
                  '&:hover': {
                    backgroundColor: colorTokens.neutral[200],
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} sx={{ color: colorTokens.primary[500] }} />
                ) : (
                  <RefreshIcon />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Statistics Panel */}
        <StatisticsPanel
          conversations={conversations}
          agents={agents}
          loading={isLoading}
        />

        {/* Filter Toolbar */}
        <FilterToolbar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
          inboxes={inboxes}
          agents={agents}
          inboxesLoading={inboxesLoading}
        />

        {/* Workload Header - Only show in assignee view */}
        {viewMode === 'assignee' && (
          <WorkloadHeader
            agents={agents}
            conversations={conversations}
            loading={agentsLoading}
          />
        )}
      </Box>

      {/* Main Board Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <KanbanBoard
          columns={columns}
          agents={agents}
          isLoading={isLoading}
          isOperationLoading={isOperationLoading}
          error={error}
          onDragEnd={handleDragEnd}
          onRefresh={handleRefresh}
          onResolve={resolveConversation}
          onSnooze={snoozeConversation}
          onAssign={assignConversation}
          onPriorityChange={setPriority}
        />
      </Box>
    </Box>
  );
};

export const WorkboardView = memo(WorkboardViewComponent);
