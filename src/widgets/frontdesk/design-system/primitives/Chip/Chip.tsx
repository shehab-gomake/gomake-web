import React from 'react';
import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';
import { colorTokens, radiusTokens, semanticTypography } from '../../tokens';

export interface ChipProps extends Omit<MuiChipProps, 'variant' | 'color'> {
  /** Chip variant */
  variant?: 'filled' | 'outlined' | 'soft';
  /** Color scheme */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

const colorSchemes = {
  filled: {
    primary: {
      bg: colorTokens.primary[600],
      text: 'white',
      border: colorTokens.primary[600],
    },
    success: {
      bg: colorTokens.success[600],
      text: 'white',
      border: colorTokens.success[600],
    },
    warning: {
      bg: colorTokens.warning[600],
      text: 'white',
      border: colorTokens.warning[600],
    },
    error: {
      bg: colorTokens.error[600],
      text: 'white',
      border: colorTokens.error[600],
    },
    neutral: {
      bg: colorTokens.neutral[600],
      text: 'white',
      border: colorTokens.neutral[600],
    },
  },
  outlined: {
    primary: {
      bg: 'transparent',
      text: colorTokens.primary[700],
      border: colorTokens.primary[600],
    },
    success: {
      bg: 'transparent',
      text: colorTokens.success[700],
      border: colorTokens.success[600],
    },
    warning: {
      bg: 'transparent',
      text: colorTokens.warning[700],
      border: colorTokens.warning[600],
    },
    error: {
      bg: 'transparent',
      text: colorTokens.error[700],
      border: colorTokens.error[600],
    },
    neutral: {
      bg: 'transparent',
      text: colorTokens.neutral[700],
      border: colorTokens.neutral[600],
    },
  },
  soft: {
    primary: {
      bg: colorTokens.primary[100],
      text: colorTokens.primary[800],
      border: colorTokens.primary[300],
    },
    success: {
      bg: colorTokens.success[100],
      text: colorTokens.success[800],
      border: colorTokens.success[300],
    },
    warning: {
      bg: colorTokens.warning[100],
      text: colorTokens.warning[800],
      border: colorTokens.warning[300],
    },
    error: {
      bg: colorTokens.error[100],
      text: colorTokens.error[800],
      border: colorTokens.error[300],
    },
    neutral: {
      bg: colorTokens.neutral[100],
      text: colorTokens.neutral[800],
      border: colorTokens.neutral[300],
    },
  },
};

/**
 * Chip Component
 *
 * Used for tags, filters, status indicators, and removable items
 */
export const Chip: React.FC<ChipProps> = ({
  variant = 'soft',
  color = 'neutral',
  size = 'small',
  sx = {},
  ...rest
}) => {
  const scheme = colorSchemes[variant][color];

  return (
    <MuiChip
      size={size}
      sx={{
        backgroundColor: scheme.bg,
        color: scheme.text,
        border: `1px solid ${scheme.border}`,
        borderRadius: radiusTokens.full,
        fontWeight: semanticTypography.label.small.fontWeight,
        fontSize: size === 'small' ? 11 : 13,
        height: size === 'small' ? 20 : 24,
        '& .MuiChip-label': {
          padding: size === 'small' ? '0 8px' : '0 12px',
        },
        '& .MuiChip-deleteIcon': {
          color: scheme.text,
          opacity: 0.7,
          '&:hover': {
            opacity: 1,
          },
        },
        ...sx,
      }}
      {...rest}
    />
  );
};