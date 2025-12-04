import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens } from '../../tokens';
import { layoutTokens, transitionTokens } from '../../tokens/layout.tokens';

export interface IconWrapperProps {
  /** Icon content */
  children: React.ReactNode;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Style variant */
  style?: 'filled' | 'soft' | 'outlined' | 'ghost';
  /** Whether to make it circular */
  rounded?: boolean;
  /** Interactive (adds hover state) */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

const sizeMap = layoutTokens.iconContainer;

const colorVariants = {
  default: {
    filled: {
      bg: colorTokens.neutral[600],
      text: '#FFFFFF',
      hoverBg: colorTokens.neutral[700],
    },
    soft: {
      bg: colorTokens.neutral[100],
      text: colorTokens.neutral[600],
      hoverBg: colorTokens.neutral[200],
    },
    outlined: {
      bg: 'transparent',
      text: colorTokens.neutral[600],
      border: colorTokens.neutral[300],
      hoverBg: colorTokens.neutral[50],
    },
    ghost: {
      bg: 'transparent',
      text: colorTokens.neutral[600],
      hoverBg: colorTokens.neutral[100],
    },
  },
  primary: {
    filled: {
      bg: colorTokens.primary[600],
      text: '#FFFFFF',
      hoverBg: colorTokens.primary[700],
    },
    soft: {
      bg: colorTokens.primary[50],
      text: colorTokens.primary[600],
      hoverBg: colorTokens.primary[100],
    },
    outlined: {
      bg: 'transparent',
      text: colorTokens.primary[600],
      border: colorTokens.primary[300],
      hoverBg: colorTokens.primary[50],
    },
    ghost: {
      bg: 'transparent',
      text: colorTokens.primary[600],
      hoverBg: colorTokens.primary[50],
    },
  },
  success: {
    filled: {
      bg: colorTokens.success[600],
      text: '#FFFFFF',
      hoverBg: colorTokens.success[700],
    },
    soft: {
      bg: colorTokens.success[50],
      text: colorTokens.success[600],
      hoverBg: colorTokens.success[100],
    },
    outlined: {
      bg: 'transparent',
      text: colorTokens.success[600],
      border: colorTokens.success[300],
      hoverBg: colorTokens.success[50],
    },
    ghost: {
      bg: 'transparent',
      text: colorTokens.success[600],
      hoverBg: colorTokens.success[50],
    },
  },
  warning: {
    filled: {
      bg: colorTokens.warning[600],
      text: '#FFFFFF',
      hoverBg: colorTokens.warning[700],
    },
    soft: {
      bg: colorTokens.warning[50],
      text: colorTokens.warning[600],
      hoverBg: colorTokens.warning[100],
    },
    outlined: {
      bg: 'transparent',
      text: colorTokens.warning[600],
      border: colorTokens.warning[300],
      hoverBg: colorTokens.warning[50],
    },
    ghost: {
      bg: 'transparent',
      text: colorTokens.warning[600],
      hoverBg: colorTokens.warning[50],
    },
  },
  error: {
    filled: {
      bg: colorTokens.error[600],
      text: '#FFFFFF',
      hoverBg: colorTokens.error[700],
    },
    soft: {
      bg: colorTokens.error[50],
      text: colorTokens.error[600],
      hoverBg: colorTokens.error[100],
    },
    outlined: {
      bg: 'transparent',
      text: colorTokens.error[600],
      border: colorTokens.error[300],
      hoverBg: colorTokens.error[50],
    },
    ghost: {
      bg: 'transparent',
      text: colorTokens.error[600],
      hoverBg: colorTokens.error[50],
    },
  },
  info: {
    filled: {
      bg: colorTokens.info[600],
      text: '#FFFFFF',
      hoverBg: colorTokens.info[700],
    },
    soft: {
      bg: colorTokens.info[50],
      text: colorTokens.info[600],
      hoverBg: colorTokens.info[100],
    },
    outlined: {
      bg: 'transparent',
      text: colorTokens.info[600],
      border: colorTokens.info[300],
      hoverBg: colorTokens.info[50],
    },
    ghost: {
      bg: 'transparent',
      text: colorTokens.info[600],
      hoverBg: colorTokens.info[50],
    },
  },
};

/**
 * IconWrapper Component
 *
 * Consistent container for icons with multiple style variants
 */
export const IconWrapper: React.FC<IconWrapperProps> = ({
  children,
  size = 'md',
  variant = 'default',
  style = 'soft',
  rounded = false,
  interactive = false,
  onClick,
  sx = {},
}) => {
  const sizeValue = sizeMap[size];
  const colors = colorVariants[variant][style];

  return (
    <Box
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizeValue,
        height: sizeValue,
        borderRadius: rounded ? '50%' : radiusTokens.md,
        backgroundColor: colors.bg,
        color: colors.text,
        border: 'border' in colors ? `1px solid ${colors.border}` : 'none',
        transition: transitionTokens.presets.colors,
        cursor: onClick || interactive ? 'pointer' : 'default',
        '&:hover': interactive || onClick ? {
          backgroundColor: colors.hoverBg,
        } : {},
        '& svg': {
          fontSize: sizeValue * 0.6,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

