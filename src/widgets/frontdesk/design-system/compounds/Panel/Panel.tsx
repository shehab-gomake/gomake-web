import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens, shadowTokens } from '../../tokens';

export interface PanelProps {
  /** Panel content */
  children: React.ReactNode;
  /** Elevation level (adds shadow) */
  elevation?: 0 | 1 | 2 | 3;
  /** Border variant */
  border?: 'none' | 'default' | 'strong';
  /** Background variant */
  background?: 'primary' | 'secondary' | 'tertiary';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Custom sx styles */
  sx?: SxProps<Theme>;
  /** Additional className */
  className?: string;
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

const backgroundMap = {
  primary: colorTokens.semantic.background.primary,
  secondary: colorTokens.semantic.background.secondary,
  tertiary: colorTokens.semantic.background.tertiary,
};

const paddingMap = {
  none: 0,
  sm: 1.5,
  md: 2,
  lg: 3,
};

/**
 * Panel Component
 *
 * Container component for content sections with consistent styling
 */
export const Panel: React.FC<PanelProps> = ({
  children,
  elevation = 0,
  border = 'default',
  background = 'primary',
  padding = 'none',
  sx = {},
  className,
}) => {
  return (
    <Box
      className={className}
      sx={{
        backgroundColor: backgroundMap[background],
        border: borderMap[border],
        borderRadius: radiusTokens.lg / 4, // Convert to rem
        boxShadow: elevationMap[elevation],
        padding: paddingMap[padding],
        overflow: 'hidden',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};