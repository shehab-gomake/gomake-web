/**
 * FrontDesk Design System - Conversation Style Patterns
 *
 * Reusable style objects for conversation lists and related components.
 */

import { SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens, semanticTypography, semanticSpacing } from '../tokens';
import { conversationStatusColors, priorityColors, ConversationStatus, Priority } from '../tokens/chatwoot.tokens';
import { layoutTokens, transitionTokens } from '../tokens/layout.tokens';

// ============================================================================
// Conversation List Item
// ============================================================================

/** List item base */
export const conversationListItemBase: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1.5,
  py: 1.5,
  px: 2,
  cursor: 'pointer',
  transition: transitionTokens.presets.colors,
  borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
  '&:hover': {
    backgroundColor: colorTokens.semantic.interactive.hover,
  },
};

/** Selected list item */
export const conversationListItemSelected: SxProps<Theme> = {
  ...conversationListItemBase,
  backgroundColor: colorTokens.semantic.interactive.selected,
  borderLeft: `3px solid ${colorTokens.primary[600]}`,
  pl: 1.5 + 3 / 8, // Compensate for border width
  '&:hover': {
    backgroundColor: colorTokens.semantic.interactive.selectedHover,
  },
};

/** Unread list item */
export const conversationListItemUnread: SxProps<Theme> = {
  '& .title': {
    fontWeight: 600,
  },
  '& .snippet': {
    fontWeight: 500,
  },
};

// ============================================================================
// Conversation List Item Content
// ============================================================================

/** List item title */
export const listItemTitle: SxProps<Theme> = {
  ...semanticTypography.body.medium,
  fontWeight: 500,
  color: colorTokens.semantic.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/** List item snippet/preview */
export const listItemSnippet: SxProps<Theme> = {
  ...semanticTypography.body.small,
  color: colorTokens.semantic.text.secondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  opacity: 0.85,
};

/** List item timestamp */
export const listItemTimestamp: SxProps<Theme> = {
  ...semanticTypography.caption.small,
  color: colorTokens.semantic.text.secondary,
  flexShrink: 0,
  opacity: 0.75,
};

/** List item metadata row */
export const listItemMetadata: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  flexWrap: 'wrap',
  mt: 0.5,
};

// ============================================================================
// Status Indicators
// ============================================================================

/** Status badge base */
export const statusBadgeBase: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  px: 1,
  py: 0.25,
  borderRadius: radiusTokens.full,
  ...semanticTypography.caption.small,
  fontWeight: 500,
};

/**
 * Get status badge style based on status
 */
export const getStatusBadgeStyle = (status: ConversationStatus): SxProps<Theme> => {
  const colors = conversationStatusColors[status] || conversationStatusColors.open;
  return {
    ...statusBadgeBase,
    backgroundColor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
  };
};

/** Status dot indicator */
export const statusDot = (status: ConversationStatus): SxProps<Theme> => {
  const colors = conversationStatusColors[status] || conversationStatusColors.open;
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: colors.main,
  };
};

// ============================================================================
// Priority Indicators
// ============================================================================

/** Priority icon container */
export const priorityIconContainer: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 16,
  height: 16,
};

/**
 * Get priority indicator style
 */
export const getPriorityStyle = (priority: Priority): SxProps<Theme> => {
  const colors = priorityColors[priority] || priorityColors.none;
  return {
    color: colors.icon,
    '& svg': {
      fontSize: 14,
    },
  };
};

/**
 * Get priority badge style
 */
export const getPriorityBadgeStyle = (priority: Priority): SxProps<Theme> => {
  const colors = priorityColors[priority] || priorityColors.none;
  return {
    ...statusBadgeBase,
    backgroundColor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
  };
};

// ============================================================================
// Unread Badge
// ============================================================================

/** Unread count badge */
export const unreadBadge: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  px: 0.5,
  borderRadius: radiusTokens.full,
  backgroundColor: colorTokens.primary[600],
  color: '#FFFFFF',
  ...semanticTypography.caption.small,
  fontWeight: 600,
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
};

// ============================================================================
// Conversation List Container
// ============================================================================

/** List container */
export const conversationListContainer: SxProps<Theme> = {
  flex: 1,
  overflow: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: `${colorTokens.neutral[300]} transparent`,
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: colorTokens.neutral[300],
    borderRadius: 3,
  },
};

/** List header (sticky) */
export const conversationListHeader: SxProps<Theme> = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: colorTokens.semantic.background.primary,
  borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
  px: 2,
  py: 1.5,
};

/** List header title */
export const conversationListHeaderTitle: SxProps<Theme> = {
  ...semanticTypography.heading.h5,
  color: colorTokens.semantic.text.primary,
};

// ============================================================================
// Filters & Tabs
// ============================================================================

/** Filter tabs container */
export const filterTabsContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  px: 2,
  py: 1,
  borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

/** Filter tab */
export const filterTab: SxProps<Theme> = {
  ...semanticTypography.label.medium,
  px: 1.5,
  py: 0.75,
  borderRadius: radiusTokens.md,
  cursor: 'pointer',
  transition: transitionTokens.presets.colors,
  color: colorTokens.semantic.text.secondary,
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: colorTokens.semantic.interactive.hover,
    color: colorTokens.semantic.text.primary,
  },
};

/** Active filter tab */
export const filterTabActive: SxProps<Theme> = {
  ...filterTab,
  backgroundColor: colorTokens.primary[50],
  color: colorTokens.primary[700],
  fontWeight: 600,
  '&:hover': {
    backgroundColor: colorTokens.primary[100],
    color: colorTokens.primary[800],
  },
};

// ============================================================================
// Labels
// ============================================================================

/** Label chip */
export const labelChip: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  px: 0.75,
  py: 0.25,
  borderRadius: radiusTokens.sm,
  ...semanticTypography.caption.small,
  fontWeight: 500,
};

/**
 * Get label chip style with custom color
 */
export const getLabelChipStyle = (color: string): SxProps<Theme> => ({
  ...labelChip,
  backgroundColor: `${color}20`, // 12% opacity
  color: color,
  border: `1px solid ${color}40`, // 25% opacity
});

// ============================================================================
// Empty States
// ============================================================================

/** Empty conversation list */
export const emptyListContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  p: 4,
  textAlign: 'center',
};

/** Empty list icon */
export const emptyListIcon: SxProps<Theme> = {
  fontSize: 64,
  color: colorTokens.neutral[300],
  mb: 2,
};

/** Empty list title */
export const emptyListTitle: SxProps<Theme> = {
  ...semanticTypography.heading.h5,
  color: colorTokens.semantic.text.primary,
  mb: 0.5,
};

/** Empty list description */
export const emptyListDescription: SxProps<Theme> = {
  ...semanticTypography.body.medium,
  color: colorTokens.semantic.text.secondary,
  maxWidth: 280,
};

