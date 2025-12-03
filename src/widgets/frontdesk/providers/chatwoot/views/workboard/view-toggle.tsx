/**
 * View Toggle Component
 * 
 * Toggle between Status and Assignee views for the Kanban board.
 * 
 * Uses FrontDesk design system tokens for consistent styling.
 */

import React, { memo } from 'react';
import { ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { 
  ViewColumn as StatusIcon,
  People as AssigneeIcon,
} from '@mui/icons-material';

// Design system
import { 
  colorTokens, 
  radiusTokens, 
} from '@/widgets/frontdesk/design-system';

// Types
import { KanbanViewMode } from '../../types/kanban.types';

// ============================================
// Types
// ============================================

export interface ViewToggleProps {
  viewMode: KanbanViewMode;
  onViewModeChange: (mode: KanbanViewMode) => void;
}

// ============================================
// Component
// ============================================

const ViewToggleComponent: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: KanbanViewMode | null,
  ) => {
    if (newViewMode !== null) {
      onViewModeChange(newViewMode);
    }
  };

  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={handleChange}
      aria-label="kanban view mode"
      size="small"
      sx={{
        backgroundColor: colorTokens.neutral[100],
        borderRadius: `${radiusTokens.md}px`,
        '& .MuiToggleButton-root': {
          fontSize: '0.8rem',
          fontWeight: 500,
          color: colorTokens.semantic.text.secondary,
          border: 'none',
          padding: '6px 12px',
          textTransform: 'none',
          '&.Mui-selected': {
            backgroundColor: colorTokens.primary[600],
            color: colorTokens.semantic.text.inverse,
            '&:hover': {
              backgroundColor: colorTokens.primary[700],
            },
          },
          '&:hover': {
            backgroundColor: colorTokens.neutral[200],
          },
        },
      }}
    >
      <Tooltip title="Group by conversation status">
        <ToggleButton value="status" aria-label="status view">
          <StatusIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Status
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Group by assigned agent">
        <ToggleButton value="assignee" aria-label="assignee view">
          <AssigneeIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Assignee
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};

export const ViewToggle = memo(ViewToggleComponent);
