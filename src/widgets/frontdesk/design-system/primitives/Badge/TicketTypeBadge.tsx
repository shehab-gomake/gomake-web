import React from 'react';
import { Box, SvgIconProps } from '@mui/material';
import { colorTokens } from '../../tokens';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BuildIcon from '@mui/icons-material/Build';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export type TicketType = 'Bug' | 'Feature' | 'Task' | 'Support';

export interface TicketTypeBadgeProps {
  /** Ticket type */
  type: TicketType;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md';
  /** Show tooltip on hover */
  showTooltip?: boolean;
}

const typeConfig = {
  Bug: {
    icon: BugReportIcon,
    color: colorTokens.error[600],
    label: 'Bug',
    ariaLabel: 'Bug ticket',
  },
  Feature: {
    icon: AutoAwesomeIcon,
    color: colorTokens.primary[600],
    label: 'Feature',
    ariaLabel: 'Feature request ticket',
  },
  Task: {
    icon: BuildIcon,
    color: colorTokens.neutral[600],
    label: 'Task',
    ariaLabel: 'Task ticket',
  },
  Support: {
    icon: HelpOutlineIcon,
    color: colorTokens.info[600],
    label: 'Support',
    ariaLabel: 'Support ticket',
  },
} as const;

const sizeMap = {
  xs: 12,
  sm: 14,
  md: 16,
} as const;

/**
 * TicketTypeBadge Component
 *
 * Displays ticket type with appropriate icon.
 * Provides visual distinction between bugs, features, tasks, and support tickets.
 */
export const TicketTypeBadge: React.FC<TicketTypeBadgeProps> = ({
  type,
  size = 'sm',
  showTooltip = true,
}) => {
  const config = typeConfig[type];
  const IconComponent = config.icon;
  const iconSize = sizeMap[size];

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: config.color,
        verticalAlign: 'middle',
      }}
      title={showTooltip ? config.label : undefined}
      aria-label={config.ariaLabel}
      role="img"
    >
      <IconComponent
        sx={{
          fontSize: iconSize,
          color: config.color,
        }}
      />
    </Box>
  );
};