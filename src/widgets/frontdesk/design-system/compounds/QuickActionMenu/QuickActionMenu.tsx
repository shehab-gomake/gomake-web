import React from 'react';
import { Menu, MenuProps, Typography, Box, Divider, Tooltip } from '@mui/material';
import { ActionMenuItem } from '../../primitives/MenuItem';
import { colorTokens, spacingTokens, radiusTokens, shadowTokens } from '../../tokens';

export interface QuickActionItem {
  /** Unique action identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ReactNode;
  /** Optional tooltip */
  tooltip?: string;
  /** Whether action is disabled */
  disabled?: boolean;
  /** Disabled reason (shown in tooltip) */
  disabledReason?: string;
  /** Action group */
  group: string;
}

export interface QuickActionMenuProps extends Omit<MenuProps, 'onClose'> {
  /** Menu anchor element */
  anchorEl: HTMLElement | null;
  /** Whether menu is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Actions to display */
  actions: QuickActionItem[];
  /** Group labels */
  groupLabels?: Record<string, string>;
  /** Handler when action is clicked */
  onActionClick: (action: QuickActionItem) => void;
  /** Whether any actions are loading */
  loading?: boolean;
}

/**
 * QuickActionMenu Component
 *
 * Dropdown menu for displaying grouped quick actions
 * with icons, tooltips, and disabled states
 */
export const QuickActionMenu: React.FC<QuickActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  actions,
  groupLabels = {},
  onActionClick,
  loading = false,
  ...menuProps
}) => {
  // Group actions by category
  const groupedActions = actions.reduce((acc, action) => {
    if (!acc[action.group]) {
      acc[action.group] = [];
    }
    acc[action.group].push(action);
    return acc;
  }, {} as Record<string, QuickActionItem[]>);

  const groups = Object.keys(groupedActions);

  const handleActionClick = (action: QuickActionItem) => {
    if (!action.disabled && !loading) {
      onActionClick(action);
      onClose();
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 240,
            maxWidth: 320,
            borderRadius: radiusTokens.lg,
            boxShadow: shadowTokens.lg,
            border: `1px solid ${colorTokens.semantic.border.default}`,
          },
        },
      }}
      {...menuProps}
    >
      {groups.length === 0 && (
        <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            No actions available
          </Typography>
        </Box>
      )}

      {groups.map((group, groupIndex) => (
        <Box key={group}>
          {/* Group Label */}
          {groupLabels[group] && (
            <Box
              sx={{
                px: 2,
                py: 1,
                backgroundColor: colorTokens.neutral[50],
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: colorTokens.semantic.text.secondary,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: 10,
                  letterSpacing: '0.5px',
                }}
              >
                {groupLabels[group]}
              </Typography>
            </Box>
          )}

          {/* Group Actions */}
          {groupedActions[group].map((action) => {
            const isDisabled = action.disabled || loading;
            const tooltipContent = action.disabled ? action.disabledReason || action.tooltip : action.tooltip;

            const menuItem = (
              <ActionMenuItem
                key={action.id}
                id={action.id}
                label={action.label}
                icon={action.icon}
                disabled={isDisabled}
                onClick={() => handleActionClick(action)}
              />
            );

            // Wrap in tooltip if there's a tooltip or disabled reason
            return tooltipContent ? (
              <Tooltip key={action.id} title={tooltipContent} placement="left" arrow>
                {/* Span wrapper needed for tooltip on disabled elements */}
                <span>{menuItem}</span>
              </Tooltip>
            ) : (
              menuItem
            );
          })}

          {/* Divider between groups */}
          {groupIndex < groups.length - 1 && <Divider sx={{ my: 1 }} />}
        </Box>
      ))}
    </Menu>
  );
};
