/**
 * Unified List Styles
 *
 * Shared style presets for consistent appearance across all list components.
 * Organized by use case: filters, assignments, quick selectors, etc.
 *
 * @module unified-list/styles
 */

import { alpha } from '@mui/material';
import { colorTokens } from '@/widgets/frontdesk/design-system';

// =============================================================================
// FILTER STYLES (Toolbar icon buttons - Teams, Labels, Sort, etc.)
// Modern SaaS design with consistent 16-18px icons and refined colors
// =============================================================================

export const filterStyles = {
  /** Icon button trigger for filters */
  iconButton: {
    base: {
      width: 30,
      height: 30,
      padding: 0.5,
      borderRadius: '8px',
      transition: 'all 0.15s ease',
    },
    inactive: {
      color: colorTokens.neutral[500],
      '&:hover': {
        backgroundColor: colorTokens.neutral[100],
        color: colorTokens.neutral[700],
      },
    },
    active: {
      color: colorTokens.primary[500],
      backgroundColor: colorTokens.primary[50],
      '&:hover': {
        backgroundColor: colorTokens.primary[100],
        color: colorTokens.primary[600],
      },
    },
  },
  /** Badge for filter count */
  badge: {
    '& .MuiBadge-badge': {
      fontSize: '0.6rem',
      height: 14,
      minWidth: 14,
      backgroundColor: colorTokens.primary[500],
      fontWeight: 600,
    },
  },
  /** Icon size - consistent 16px for all toolbar icons */
  iconSize: 16,
  /** Menu paper - refined shadow and radius */
  menuPaper: {
    mt: 0.75,
    minWidth: 240,
    maxWidth: 320,
    maxHeight: 400,
    backgroundColor: colorTokens.semantic.background.primary,
    border: `1px solid ${colorTokens.neutral[200]}`,
    boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  /** Section header */
  sectionHeader: {
    fontSize: '0.6875rem',
    fontWeight: 600,
    color: colorTokens.neutral[500],
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    px: 2,
    py: 1,
  },
} as const;

// =============================================================================
// ASSIGNMENT STYLES (Detail panel - Agent/Team assignment)
// =============================================================================

export const assignmentStyles = {
  /** Section container */
  container: {
    mb: 2.5,
  },
  /** Section label */
  label: {
    color: colorTokens.neutral[500],
    mb: 1,
    display: 'block',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    fontSize: 10,
  },
  /** Current value display box */
  valueBox: {
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.5,
      backgroundColor: colorTokens.neutral[50],
      borderRadius: '6px',
      border: `1px solid ${colorTokens.neutral[200]}`,
      transition: 'all 0.2s ease',
    },
    interactive: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: colorTokens.neutral[100],
        borderColor: colorTokens.neutral[300],
      },
    },
    disabled: {
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },
  /** Avatar */
  avatar: {
    width: 32,
    height: 32,
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  /** Icon container (for teams) */
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: '6px',
    backgroundColor: colorTokens.neutral[100],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Name text */
  name: {
    fontWeight: 500,
    fontSize: 13,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  /** Description text */
  description: {
    color: colorTokens.neutral[500],
    fontSize: 11,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    display: 'block',
  },
  /** Empty state button */
  emptyButton: {
    textTransform: 'none' as const,
    justifyContent: 'flex-start',
    color: colorTokens.neutral[700],
    borderColor: colorTokens.neutral[300],
  },
} as const;

// =============================================================================
// QUICK SELECTOR STYLES (Inline pill - Status/Priority)
// =============================================================================

export const quickSelectorStyles = {
  /** Pill container */
  pill: {
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      px: 1.25,
      py: 0.5,
      borderRadius: '6px',
      border: `1px solid ${colorTokens.neutral[300]}`,
      backgroundColor: colorTokens.neutral[0] || '#ffffff',
      transition: 'all 0.2s',
    },
    interactive: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: colorTokens.neutral[50],
        borderColor: colorTokens.neutral[400],
      },
    },
    disabled: {
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  },
  /** Label text */
  label: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: colorTokens.neutral[700],
    lineHeight: 1,
  },
  /** Icon size */
  iconSize: 16,
  /** Menu paper */
  menuPaper: {
    mt: 0.5,
    minWidth: 160,
    maxWidth: 200,
  },
} as const;

// =============================================================================
// LIST ITEM STYLES (Dropdown menu items)
// =============================================================================

export const listItemStyles = {
  /** Base menu item */
  menuItem: {
    base: {
      px: 2,
      py: 1,
      gap: 1.5,
    },
    selected: (color: string = colorTokens.primary[600]) => ({
      backgroundColor: alpha(color, 0.08),
      '&:hover': {
        backgroundColor: alpha(color, 0.12),
      },
    }),
    unselected: {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: colorTokens.neutral[50],
      },
    },
  },
  /** Primary text */
  primaryText: {
    fontSize: 13,
  },
  /** Secondary text */
  secondaryText: {
    fontSize: 11,
    color: colorTokens.neutral[500],
  },
  /** Check icon */
  checkIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  /** Avatar in list */
  avatar: {
    width: 28,
    height: 28,
    fontSize: '0.7rem',
    fontWeight: 600,
  },
  /** Team/label icon container */
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Availability indicator */
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  /** Color dot (for labels) */
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
  },
} as const;

// =============================================================================
// ACTION STYLES (Footer actions like "Add new", "Clear all")
// =============================================================================

export const actionStyles = {
  /** Action menu item */
  menuItem: {
    base: {
      px: 2,
      py: 1.25,
      justifyContent: 'center',
      gap: 1,
      fontWeight: 600,
    },
    primary: {
      color: colorTokens.primary[600],
      '&:hover': {
        backgroundColor: alpha(colorTokens.primary[600], 0.08),
      },
    },
    secondary: {
      color: colorTokens.neutral[700],
      '&:hover': {
        backgroundColor: colorTokens.neutral[50],
      },
    },
    danger: {
      color: colorTokens.error[600],
      '&:hover': {
        backgroundColor: alpha(colorTokens.error[600], 0.08),
      },
    },
  },
  /** Action text */
  text: {
    fontSize: 13,
    fontWeight: 600,
  },
} as const;

// =============================================================================
// AVAILABILITY STATUS COLORS
// =============================================================================

export const availabilityColors = {
  online: '#22c55e',  // green-500
  busy: '#f59e0b',    // amber-500
  away: '#eab308',    // yellow-500
  offline: '#6b7280', // gray-500
} as const;

// =============================================================================
// PRIORITY COLORS
// =============================================================================

export const priorityColors = {
  urgent: '#DC2626', // red-600
  high: '#EF4444',   // red-500
  medium: '#F59E0B', // amber-500
  low: '#22C55E',    // green-500
  none: colorTokens.neutral[400],
} as const;

// =============================================================================
// STATUS COLORS
// =============================================================================

export const statusColors = {
  open: colorTokens.success[500],
  pending: colorTokens.warning[500],
  snoozed: colorTokens.info[500],
  resolved: colorTokens.neutral[500],
  all: colorTokens.neutral[600],
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get icon button styles based on active state
 */
export const getFilterIconButtonSx = (isActive: boolean) => ({
  ...filterStyles.iconButton.base,
  ...(isActive ? filterStyles.iconButton.active : filterStyles.iconButton.inactive),
});

/**
 * Get value box styles based on state
 */
export const getAssignmentValueBoxSx = (disabled: boolean) => ({
  ...assignmentStyles.valueBox.base,
  ...(disabled ? assignmentStyles.valueBox.disabled : assignmentStyles.valueBox.interactive),
});

/**
 * Get pill styles based on state
 */
export const getQuickSelectorPillSx = (disabled: boolean) => ({
  ...quickSelectorStyles.pill.base,
  ...(disabled ? quickSelectorStyles.pill.disabled : quickSelectorStyles.pill.interactive),
});

/**
 * Get list item styles based on selection state
 */
export const getListItemSx = (isSelected: boolean, color?: string) => ({
  ...listItemStyles.menuItem.base,
  ...(isSelected ? listItemStyles.menuItem.selected(color) : listItemStyles.menuItem.unselected),
});

/**
 * Get action item styles based on variant
 */
export const getActionItemSx = (variant: 'primary' | 'secondary' | 'danger' = 'primary') => ({
  ...actionStyles.menuItem.base,
  ...actionStyles.menuItem[variant],
});

