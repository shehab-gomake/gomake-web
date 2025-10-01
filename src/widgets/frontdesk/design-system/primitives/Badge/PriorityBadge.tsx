import React from 'react';
import { Box, Typography } from '@mui/material';
import { colorTokens, radiusTokens, semanticTypography } from '../../tokens';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export type PriorityLevel = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface PriorityBadgeProps {
  /** Priority level */
  priority: PriorityLevel;
  /** Display mode */
  mode?: 'icon' | 'label' | 'both';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md';
  /** Show background color */
  showBackground?: boolean;
}

const priorityConfig = {
  Urgent: {
    color: colorTokens.error[600],
    bgColor: colorTokens.error[50],
    borderColor: colorTokens.error[200],
    label: 'Urgent',
    icon: '●',
  },
  High: {
    color: colorTokens.error[500],
    bgColor: colorTokens.error[50],
    borderColor: colorTokens.error[200],
    label: 'High',
    icon: '▲',
  },
  Medium: {
    color: colorTokens.warning[600],
    bgColor: colorTokens.warning[50],
    borderColor: colorTokens.warning[200],
    label: 'Medium',
    icon: '━',
  },
  Low: {
    color: colorTokens.success[600],
    bgColor: colorTokens.success[50],
    borderColor: colorTokens.success[200],
    label: 'Low',
    icon: '○',
  },
} as const;

const sizeStyles = {
  xs: {
    fontSize: 10,
    iconSize: 6,
    padding: '2px 6px',
    gap: 3,
  },
  sm: {
    fontSize: 11,
    iconSize: 8,
    padding: '3px 8px',
    gap: 4,
  },
  md: {
    fontSize: 13,
    iconSize: 10,
    padding: '4px 10px',
    gap: 5,
  },
} as const;

/**
 * PriorityBadge Component
 *
 * Displays ticket priority with professional visual indicators.
 * Replaces emoji-based priority icons with standard design patterns.
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  mode = 'both',
  size = 'sm',
  showBackground = false,
}) => {
  const config = priorityConfig[priority];
  const styles = sizeStyles[size];

  if (mode === 'icon') {
    return (
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: config.color,
        }}
      >
        <FiberManualRecordIcon
          sx={{
            fontSize: styles.iconSize,
            color: config.color,
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${styles.gap}px`,
        padding: showBackground ? styles.padding : 0,
        backgroundColor: showBackground ? config.bgColor : 'transparent',
        border: showBackground ? `1px solid ${config.borderColor}` : 'none',
        borderRadius: showBackground ? radiusTokens.sm : 0,
        color: config.color,
        fontWeight: semanticTypography.label.small.fontWeight,
        fontSize: styles.fontSize,
        lineHeight: 1.2,
      }}
    >
      {mode !== 'label' && (
        <FiberManualRecordIcon
          sx={{
            fontSize: styles.iconSize,
            color: config.color,
          }}
        />
      )}
      {(mode === 'label' || mode === 'both') && (
        <Typography
          component="span"
          sx={{
            fontSize: styles.fontSize,
            fontWeight: 600,
            color: config.color,
            lineHeight: 1,
          }}
        >
          {config.label}
        </Typography>
      )}
    </Box>
  );
};