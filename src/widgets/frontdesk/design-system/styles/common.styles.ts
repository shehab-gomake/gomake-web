/**
 * FrontDesk Design System - Common Style Patterns
 *
 * Reusable style objects for common UI patterns.
 * Import these to maintain consistency across components.
 */

import { SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens, shadowTokens, semanticTypography } from '../tokens';
import { transitionTokens, zIndexTokens } from '../tokens/layout.tokens';

// ============================================================================
// Text Utilities
// ============================================================================

/** Single line text with ellipsis overflow */
export const ellipsisText: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/** Multi-line text with line clamping */
export const lineClamp = (lines: number): SxProps<Theme> => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

/** Text with word break */
export const breakWord: SxProps<Theme> = {
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
};

// ============================================================================
// Layout Utilities
// ============================================================================

/** Scrollable container */
export const scrollableContainer: SxProps<Theme> = {
  overflow: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: `${colorTokens.neutral[300]} transparent`,
  '&::-webkit-scrollbar': {
    width: 6,
    height: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: colorTokens.neutral[300],
    borderRadius: 3,
    '&:hover': {
      backgroundColor: colorTokens.neutral[400],
    },
  },
};

/** Hidden scrollbar but still scrollable */
export const hiddenScrollbar: SxProps<Theme> = {
  overflow: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

/** Flex center */
export const flexCenter: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/** Flex between */
export const flexBetween: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

/** Full size absolute positioning */
export const absoluteFill: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

// ============================================================================
// Interactive States
// ============================================================================

/** Hover highlight effect */
export const hoverHighlight: SxProps<Theme> = {
  cursor: 'pointer',
  transition: transitionTokens.presets.colors,
  '&:hover': {
    backgroundColor: colorTokens.semantic.interactive.hover,
  },
  '&:active': {
    backgroundColor: colorTokens.semantic.interactive.active,
  },
};

/** Selected state */
export const selectedState: SxProps<Theme> = {
  backgroundColor: colorTokens.semantic.interactive.selected,
  '&:hover': {
    backgroundColor: colorTokens.semantic.interactive.selectedHover,
  },
};

/** Focus ring for keyboard navigation */
export const focusRing: SxProps<Theme> = {
  '&:focus-visible': {
    outline: `2px solid ${colorTokens.primary[500]}`,
    outlineOffset: 2,
  },
};

/** Disabled state */
export const disabledState: SxProps<Theme> = {
  opacity: 0.5,
  pointerEvents: 'none',
  cursor: 'not-allowed',
};

// ============================================================================
// Transition Utilities
// ============================================================================

/** Base transition for all properties */
export const transitionAll: SxProps<Theme> = {
  transition: transitionTokens.presets.all,
};

/** Transition for color changes only */
export const transitionColors: SxProps<Theme> = {
  transition: transitionTokens.presets.colors,
};

/** Transition for transform */
export const transitionTransform: SxProps<Theme> = {
  transition: transitionTokens.presets.transform,
};

// ============================================================================
// Visual Effects
// ============================================================================

/** Subtle shadow */
export const subtleShadow: SxProps<Theme> = {
  boxShadow: shadowTokens.sm,
};

/** Elevated card shadow */
export const elevatedShadow: SxProps<Theme> = {
  boxShadow: shadowTokens.md,
};

/** Inset shadow for pressed state */
export const insetShadow: SxProps<Theme> = {
  boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

/** Glass effect background */
export const glassEffect: SxProps<Theme> = {
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(8px)',
};

// ============================================================================
// Borders
// ============================================================================

/** Default border */
export const defaultBorder: SxProps<Theme> = {
  border: `1px solid ${colorTokens.semantic.border.default}`,
};

/** Strong border */
export const strongBorder: SxProps<Theme> = {
  border: `1px solid ${colorTokens.semantic.border.medium}`,
};

/** Border bottom only */
export const borderBottom: SxProps<Theme> = {
  borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
};

/** Border top only */
export const borderTop: SxProps<Theme> = {
  borderTop: `1px solid ${colorTokens.semantic.border.default}`,
};

// ============================================================================
// Overlay & Modal Utilities
// ============================================================================

/** Modal overlay background */
export const modalOverlay: SxProps<Theme> = {
  position: 'fixed',
  ...absoluteFill,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: zIndexTokens.overlay,
};

/** Dropdown menu styles */
export const dropdownMenu: SxProps<Theme> = {
  backgroundColor: colorTokens.semantic.background.primary,
  border: `1px solid ${colorTokens.semantic.border.default}`,
  borderRadius: radiusTokens.md,
  boxShadow: shadowTokens.lg,
  zIndex: zIndexTokens.dropdown,
};

// ============================================================================
// Typography Utilities
// ============================================================================

/** Uppercase label */
export const uppercaseLabel: SxProps<Theme> = {
  ...semanticTypography.label.small,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

/** Muted text */
export const mutedText: SxProps<Theme> = {
  color: colorTokens.semantic.text.secondary,
};

/** Link text */
export const linkText: SxProps<Theme> = {
  color: colorTokens.semantic.text.link,
  cursor: 'pointer',
  '&:hover': {
    color: colorTokens.semantic.text.linkHover,
    textDecoration: 'underline',
  },
};

// ============================================================================
// Combined Patterns
// ============================================================================

/** Clickable list item */
export const clickableListItem: SxProps<Theme> = {
  ...hoverHighlight,
  ...focusRing,
  ...borderBottom,
  py: 1.5,
  px: 2,
};

/** Card base */
export const cardBase: SxProps<Theme> = {
  backgroundColor: colorTokens.semantic.background.primary,
  borderRadius: radiusTokens.lg,
  ...defaultBorder,
  ...subtleShadow,
};

/** Panel header */
export const panelHeader: SxProps<Theme> = {
  ...flexBetween,
  ...borderBottom,
  px: 2,
  py: 1.5,
  minHeight: 48,
};

/** Sticky header */
export const stickyHeader: SxProps<Theme> = {
  position: 'sticky',
  top: 0,
  zIndex: zIndexTokens.stickyHeader,
  backgroundColor: colorTokens.semantic.background.primary,
};

