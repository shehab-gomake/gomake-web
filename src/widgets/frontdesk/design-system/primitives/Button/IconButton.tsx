import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, Tooltip } from '@mui/material';
import { colorTokens, radiusTokens } from '../../tokens';

export interface IconButtonProps extends Omit<MuiIconButtonProps, 'color'> {
  /** Button variant */
  variant?: 'default' | 'ghost' | 'primary';
  /** Tooltip text */
  tooltip?: string;
  /** Tooltip placement */
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

const variantStyles = {
  default: {
    color: colorTokens.neutral[600],
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: colorTokens.neutral[100],
      color: colorTokens.neutral[700],
    },
    '&:active': {
      backgroundColor: colorTokens.neutral[200],
    },
  },
  ghost: {
    color: colorTokens.neutral[500],
    backgroundColor: 'transparent',
    '&:hover': {
      color: colorTokens.neutral[700],
    },
    '&:active': {
      color: colorTokens.neutral[800],
    },
  },
  primary: {
    color: colorTokens.primary[600],
    backgroundColor: colorTokens.primary[50],
    '&:hover': {
      backgroundColor: colorTokens.primary[100],
      color: colorTokens.primary[700],
    },
    '&:active': {
      backgroundColor: colorTokens.primary[200],
    },
  },
};

/**
 * IconButton Component
 *
 * Button for icon-only actions with optional tooltip
 */
export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'default',
  tooltip,
  tooltipPlacement = 'top',
  size = 'medium',
  children,
  sx = {},
  ...rest
}) => {
  const variantStyle = variantStyles[variant];

  const button = (
    <MuiIconButton
      size={size}
      sx={{
        ...variantStyle,
        borderRadius: radiusTokens.md,
        transition: 'all 0.15s ease',
        '&:focus-visible': {
          outline: `2px solid ${colorTokens.primary[600]}`,
          outlineOffset: 2,
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MuiIconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement={tooltipPlacement}>
        {button}
      </Tooltip>
    );
  }

  return button;
};