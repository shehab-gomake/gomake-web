import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens, shadowTokens, semanticSpacing } from '../../tokens';

export interface PanelProps {
  /** Panel content */
  children: React.ReactNode;
  /** Elevation level (adds shadow) */
  elevation?: 0 | 1 | 2 | 3 | 4;
  /** Border variant */
  border?: 'none' | 'default' | 'strong' | 'subtle';
  /** Background variant */
  background?: 'primary' | 'secondary' | 'tertiary' | 'transparent';
  /** Padding size (uses 8px rhythm) */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Use card styling (14px radius, soft shadow) */
  variant?: 'default' | 'card' | 'elevated';
  /** Custom sx styles */
  sx?: SxProps<Theme>;
  /** Additional className */
  className?: string;
}

// Shadow mapping with softer shadows
const elevationMap = {
  0: shadowTokens.none,
  1: shadowTokens.xs,
  2: shadowTokens.card,      // Soft card shadow
  3: shadowTokens.md,
  4: shadowTokens.lg,
};

// Border mapping with subtle option
const borderMap = {
  none: 'none',
  subtle: `1px solid ${colorTokens.semantic.border.light}`,
  default: `1px solid ${colorTokens.semantic.border.default}`,
  strong: `1px solid ${colorTokens.semantic.border.medium}`,
};

// Background mapping with transparent option
const backgroundMap = {
  primary: colorTokens.semantic.background.primary,
  secondary: colorTokens.semantic.background.secondary,
  tertiary: colorTokens.semantic.background.tertiary,
  transparent: 'transparent',
};

// Padding mapping based on 8px rhythm (20-24px for cards)
const paddingMap = {
  none: 0,
  xs: 1,       // 8px
  sm: 1.5,     // 12px
  md: 2,       // 16px
  lg: 2.5,     // 20px (card padding)
  xl: 3,       // 24px (card padding)
};

// Variant presets for common use cases
const variantPresets = {
  default: {
    borderRadius: radiusTokens.lg,     // 12px
    boxShadow: shadowTokens.none,
  },
  card: {
    borderRadius: radiusTokens.xl,     // 14px - design spec
    boxShadow: shadowTokens.card,      // Soft shadow
  },
  elevated: {
    borderRadius: radiusTokens.xl,     // 14px
    boxShadow: shadowTokens.md,        // More prominent shadow
  },
};

/**
 * Panel Component
 *
 * Modern container component for content sections with consistent styling.
 * Features:
 * - 14px border radius for cards (design spec)
 * - Soft shadows (rgba(0,0,0,0.04))
 * - 8px rhythm spacing
 * - Card variant for premium look
 */
export const Panel: React.FC<PanelProps> = ({
  children,
  elevation = 0,
  border = 'default',
  background = 'primary',
  padding = 'none',
  variant = 'default',
  sx = {},
  className,
}) => {
  const variantStyles = variantPresets[variant];
  
  // Use elevation shadow if specified, otherwise use variant shadow
  const shadow = elevation > 0 ? elevationMap[elevation] : variantStyles.boxShadow;

  return (
    <Box
      className={className}
      sx={{
        backgroundColor: backgroundMap[background],
        border: borderMap[border],
        borderRadius: `${variantStyles.borderRadius}px`,
        boxShadow: shadow,
        padding: paddingMap[padding],
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};