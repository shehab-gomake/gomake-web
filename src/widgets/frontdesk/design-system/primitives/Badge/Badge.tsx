import React from 'react';
import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from '@mui/material';
import { colorTokens, radiusTokens } from '../../tokens';

export interface BadgeProps extends Omit<MuiBadgeProps, 'variant' | 'color'> {
  /** Badge variant */
  variant?: 'count' | 'dot' | 'status';
  /** Color scheme */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  primary: colorTokens.primary[600],
  success: colorTokens.success[600],
  warning: colorTokens.warning[600],
  error: colorTokens.error[600],
  neutral: colorTokens.neutral[600],
};

const sizeMap = {
  sm: { fontSize: 9, height: 16, minWidth: 16, padding: '0 4px' },
  md: { fontSize: 11, height: 20, minWidth: 20, padding: '0 6px' },
  lg: { fontSize: 12, height: 24, minWidth: 24, padding: '0 8px' },
};

/**
 * Badge Component
 *
 * Displays notification badges, unread counts, and status indicators
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'count',
  color = 'primary',
  size = 'md',
  children,
  badgeContent,
  sx = {},
  ...rest
}) => {
  const bgColor = colorMap[color];
  const sizeStyles = sizeMap[size];

  if (variant === 'dot') {
    return (
      <MuiBadge
        variant="dot"
        sx={{
          '& .MuiBadge-dot': {
            backgroundColor: bgColor,
            width: size === 'sm' ? 8 : size === 'md' ? 10 : 12,
            height: size === 'sm' ? 8 : size === 'md' ? 10 : 12,
            borderRadius: radiusTokens.full,
            border: `2px solid ${colorTokens.semantic.background.primary}`,
          },
          ...sx,
        }}
        {...rest}
      >
        {children}
      </MuiBadge>
    );
  }

  if (variant === 'status') {
    return (
      <MuiBadge
        badgeContent={badgeContent}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: bgColor,
            color: 'white',
            fontSize: sizeStyles.fontSize,
            height: 'auto',
            minWidth: 'auto',
            padding: '2px 6px',
            borderRadius: radiusTokens.full,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
          ...sx,
        }}
        {...rest}
      >
        {children}
      </MuiBadge>
    );
  }

  // Default: count variant
  return (
    <MuiBadge
      badgeContent={badgeContent}
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: bgColor,
          color: 'white',
          fontSize: sizeStyles.fontSize,
          height: sizeStyles.height,
          minWidth: sizeStyles.minWidth,
          padding: sizeStyles.padding,
          borderRadius: radiusTokens.full,
          fontWeight: 600,
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MuiBadge>
  );
};