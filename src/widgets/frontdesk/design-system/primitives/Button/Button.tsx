import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { colorTokens, radiusTokens, shadowTokens, semanticTypography } from '../../tokens';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color' | 'size'> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: {
    backgroundColor: colorTokens.primary[600],
    color: 'white',
    border: 'none',
    boxShadow: shadowTokens.sm,
    '&:hover': {
      backgroundColor: colorTokens.primary[700],
      boxShadow: shadowTokens.md,
    },
    '&:active': {
      backgroundColor: colorTokens.primary[800],
      boxShadow: shadowTokens.xs,
    },
    '&:disabled': {
      backgroundColor: colorTokens.neutral[200],
      color: colorTokens.neutral[400],
      boxShadow: 'none',
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    color: colorTokens.primary[700],
    border: `1px solid ${colorTokens.primary[600]}`,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colorTokens.primary[50],
      borderColor: colorTokens.primary[700],
    },
    '&:active': {
      backgroundColor: colorTokens.primary[100],
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colorTokens.neutral[400],
      borderColor: colorTokens.neutral[200],
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colorTokens.neutral[700],
    border: 'none',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: colorTokens.neutral[100],
    },
    '&:active': {
      backgroundColor: colorTokens.neutral[200],
    },
    '&:disabled': {
      backgroundColor: 'transparent',
      color: colorTokens.neutral[400],
    },
  },
  danger: {
    backgroundColor: colorTokens.error[600],
    color: 'white',
    border: 'none',
    boxShadow: shadowTokens.sm,
    '&:hover': {
      backgroundColor: colorTokens.error[700],
      boxShadow: shadowTokens.md,
    },
    '&:active': {
      backgroundColor: colorTokens.error[800],
      boxShadow: shadowTokens.xs,
    },
    '&:disabled': {
      backgroundColor: colorTokens.neutral[200],
      color: colorTokens.neutral[400],
      boxShadow: 'none',
    },
  },
};

const sizeStyles = {
  sm: {
    height: 32,
    padding: '0 12px',
    fontSize: semanticTypography.button.small.fontSize,
    fontWeight: semanticTypography.button.small.fontWeight,
  },
  md: {
    height: 36,
    padding: '0 16px',
    fontSize: semanticTypography.button.medium.fontSize,
    fontWeight: semanticTypography.button.medium.fontWeight,
  },
  lg: {
    height: 40,
    padding: '0 20px',
    fontSize: semanticTypography.button.large.fontSize,
    fontWeight: semanticTypography.button.large.fontWeight,
  },
};

/**
 * Button Component
 *
 * Primary interactive element for actions
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  sx = {},
  ...rest
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <MuiButton
      disableElevation
      sx={{
        ...variantStyle,
        ...sizeStyle,
        borderRadius: radiusTokens.md,
        textTransform: 'none',
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
    </MuiButton>
  );
};