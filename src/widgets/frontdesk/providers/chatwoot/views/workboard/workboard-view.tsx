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
    assignConversation,
    setPriority,
  } = useKanbanBoard();

  // Handle refresh click
  const handleRefresh = useCallback(() => {
    refreshBoard();
  }, [refreshBoard]);

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
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          zIndex: 10,
        }}
      >
        {/* Title Row */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            padding: '16px 24px',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Icon Container - 44px with 12px radius */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                backgroundColor: colorTokens.primary[50],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${colorTokens.primary[100]}`,
              }}
            >
              <DashboardIcon sx={{ color: colorTokens.primary[600], fontSize: 22 }} />
            </Box>
            <Box>
              {/* Title - 22px semibold */}
              <Typography
                sx={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: colorTokens.semantic.text.primary,
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                }}
              >
                Control Station
              </Typography>
              {/* Subtitle - 13px muted gray */}
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: colorTokens.neutral[500],
                  marginTop: '2px',
                }}
              >
                {activeCount} active conversations • {agents.length} agents
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2.5}>
            {/* View Toggle */}
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                height: 28, 
                alignSelf: 'center',
                borderColor: colorTokens.neutral[200],
              }} 
            />

            {/* Refresh Button - refined styling */}
            <Tooltip title="Refresh now">
              <IconButton
                onClick={handleRefresh}
                disabled={isLoading}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  color: colorTokens.neutral[600],
                  backgroundColor: colorTokens.neutral[50],
                  border: `1px solid ${colorTokens.neutral[200]}`,
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: colorTokens.neutral[100],
                    borderColor: colorTokens.neutral[300],
                  },
                  '&:disabled': {
                    backgroundColor: colorTokens.neutral[50],
                    borderColor: colorTokens.neutral[200],
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={18} sx={{ color: colorTokens.primary[500] }} />
                ) : (
                  <RefreshIcon sx={{ fontSize: 18 }} />
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
          onAssign={assignConversation}
          onPriorityChange={setPriority}
        />
      </Box>
    </Box>
  );
};

export const WorkboardView = memo(WorkboardViewComponent);
