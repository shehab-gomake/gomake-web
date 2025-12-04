import React from 'react';
import { Box, Typography, Stack, SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens, shadowTokens, semanticTypography, semanticSpacing } from '../../tokens';
import { transitionTokens } from '../../tokens/layout.tokens';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card title */
  title?: string;
  /** Card subtitle */
  subtitle?: string;
  /** Header actions */
  actions?: React.ReactNode;
  /** Elevation level */
  elevation?: 0 | 1 | 2 | 3;
  /** Border variant */
  border?: 'none' | 'default' | 'strong';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether card is interactive (hover effects) */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether card is selected */
  selected?: boolean;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

const elevationMap = {
  0: shadowTokens.none,
  1: shadowTokens.xs,
  2: shadowTokens.sm,
  3: shadowTokens.md,
};

const borderMap = {
  none: 'none',
  default: `1px solid ${colorTokens.semantic.border.default}`,
  strong: `1px solid ${colorTokens.semantic.border.medium}`,
};

const paddingMap = {
  none: 0,
  sm: semanticSpacing.container.sm,
  md: semanticSpacing.container.md,
  lg: semanticSpacing.container.lg,
};

/**
 * Card Component
 *
 * Flexible card container with header, content, and action areas
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  elevation = 1,
  border = 'default',
  padding = 'md',
  interactive = false,
  onClick,
  selected = false,
  sx = {},
}) => {
  const hasHeader = title || subtitle || actions;
  const isClickable = interactive || onClick;

  return (
    <Box
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      sx={{
        backgroundColor: colorTokens.semantic.background.primary,
        border: selected ? `2px solid ${colorTokens.primary[500]}` : borderMap[border],
        borderRadius: radiusTokens.lg,
        boxShadow: elevationMap[elevation],
        overflow: 'hidden',
        transition: transitionTokens.presets.all,
        cursor: isClickable ? 'pointer' : 'default',
        ...(isClickable && {
          '&:hover': {
            boxShadow: shadowTokens.md,
            borderColor: selected ? colorTokens.primary[600] : colorTokens.semantic.border.medium,
          },
          '&:active': {
            transform: 'scale(0.99)',
          },
          '&:focus-visible': {
            outline: `2px solid ${colorTokens.primary[500]}`,
            outlineOffset: 2,
          },
        }),
        ...(selected && {
          backgroundColor: colorTokens.primary[50],
        }),
        ...sx,
      }}
    >
      {/* Header */}
      {hasHeader && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            px: paddingMap[padding] / 8,
            pt: paddingMap[padding] / 8,
            pb: padding === 'none' ? 0 : 1,
            borderBottom: children ? `1px solid ${colorTokens.semantic.border.light}` : 'none',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {title && (
              <Typography
                sx={{
                  ...semanticTypography.heading.h5,
                  color: colorTokens.semantic.text.primary,
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                sx={{
                  ...semanticTypography.body.small,
                  color: colorTokens.semantic.text.secondary,
                  mt: 0.25,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions && (
            <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, ml: 2 }}>
              {actions}
            </Stack>
          )}
        </Box>
      )}

      {/* Content */}
      <Box
        sx={{
          px: paddingMap[padding] / 8,
          py: paddingMap[padding] / 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

/**
 * CardHeader - Standalone header component for custom card layouts
 */
export const CardHeader: React.FC<{
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ title, subtitle, actions, sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      p: 2,
      borderBottom: `1px solid ${colorTokens.semantic.border.light}`,
      ...sx,
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {title && (
        <Typography sx={{ ...semanticTypography.heading.h5, color: colorTokens.semantic.text.primary }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography sx={{ ...semanticTypography.body.small, color: colorTokens.semantic.text.secondary, mt: 0.25 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {actions && <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, ml: 2 }}>{actions}</Stack>}
  </Box>
);

/**
 * CardContent - Standalone content wrapper for custom card layouts
 */
export const CardContent: React.FC<{
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  sx?: SxProps<Theme>;
}> = ({ children, padding = 'md', sx = {} }) => (
  <Box sx={{ p: paddingMap[padding] / 8, ...sx }}>{children}</Box>
);

/**
 * CardFooter - Footer area for card actions
 */
export const CardFooter: React.FC<{
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ children, sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 1,
      p: 2,
      borderTop: `1px solid ${colorTokens.semantic.border.light}`,
      backgroundColor: colorTokens.semantic.background.secondary,
      ...sx,
    }}
  >
    {children}
  </Box>
);

