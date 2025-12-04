/**
 * FrontDesk Design System - Navigation Tokens
 *
 * Modern SaaS navigation styling inspired by Linear, Intercom, Slack, Notion.
 * Unified spacing scale (4, 8, 12, 16, 24, 32px) for consistent rhythm.
 */

import { colorTokens } from './colors.tokens';
import { radiusTokens } from './radius.tokens';
import { shadowTokens } from './shadows.tokens';
import { typographyTokens } from './typography.tokens';
import { transitionTokens } from './layout.tokens';

// ============================================================================
// NAVIGATION COLOR PALETTE
// Modern, premium color scheme for navigation elements
// ============================================================================

export const navigationColors = {
  // Icon bar (vertical sidebar) - Modern blue gradient
  iconBar: {
    background: '#1E3A5F', // Deep professional blue
    backgroundHover: 'rgba(255, 255, 255, 0.06)',
    backgroundActive: 'rgba(255, 255, 255, 0.12)',
    icon: 'rgba(255, 255, 255, 0.7)',
    iconHover: 'rgba(255, 255, 255, 0.9)',
    iconActive: '#FFFFFF',
    activeHighlight: 'rgba(255, 255, 255, 0.18)',
    divider: 'rgba(255, 255, 255, 0.08)',
  },

  // Sidebar panel (menu area)
  sidebar: {
    background: '#F9FAFB', // Clean, light background
    backgroundAlt: '#FFFFFF',
    border: '#E5E7EB',
    divider: '#E5E7EB',
  },

  // Menu items
  menuItem: {
    text: colorTokens.neutral[700],
    textMuted: colorTokens.neutral[500],
    textActive: colorTokens.primary[700],
    icon: colorTokens.neutral[500],
    iconActive: colorTokens.primary[600],
    backgroundHover: '#F5F7FA',
    backgroundActive: '#EEF2FF',
    accentBar: colorTokens.primary[600],
  },

  // Section headers
  sectionHeader: {
    text: colorTokens.neutral[400],
    textHover: colorTokens.neutral[500],
  },

  // Channel items
  channel: {
    text: colorTokens.neutral[700],
    textMuted: '#6B7280',
    backgroundHover: '#F5F7FA',
    backgroundActive: '#EEF2FF',
    separator: '#F3F4F6',
  },

  // Primary action button (New Ticket)
  primaryAction: {
    background: colorTokens.primary[600],
    backgroundHover: colorTokens.primary[700],
    text: '#FFFFFF',
    shadow: `0 2px 8px rgba(59, 130, 246, 0.25), 0 1px 3px rgba(59, 130, 246, 0.15)`,
    shadowHover: `0 4px 12px rgba(59, 130, 246, 0.35), 0 2px 6px rgba(59, 130, 246, 0.2)`,
  },
} as const;

// ============================================================================
// NAVIGATION SPACING
// Unified spacing scale: 4, 8, 12, 16, 24, 32px
// ============================================================================

export const navigationSpacing = {
  // Icon bar
  iconBar: {
    width: 56,
    iconSize: 18,
    iconContainerSize: 40,
    iconGap: 8,
    padding: 8,
    verticalGap: 8,
  },

  // Sidebar panel
  sidebar: {
    width: 220,
    widthExpanded: 260,
    widthCollapsed: 56,
    paddingX: 12,
    paddingY: 8,
    sectionGap: 24,
    headerPaddingX: 16,
    headerPaddingY: 8,
  },

  // Menu items
  menuItem: {
    height: 36,
    paddingX: 12,
    paddingY: 8,
    iconSize: 18,
    iconGap: 10,
    indentLevel: 28,
    accentBarWidth: 3,
    accentBarHeight: 20,
  },

  // Section headers
  sectionHeader: {
    paddingX: 16,
    paddingY: 8,
    marginTop: 16,
    marginBottom: 4,
  },

  // Channel items
  channel: {
    paddingX: 16,
    paddingY: 10,
    iconSize: 16,
    iconGap: 10,
    metadataGap: 4,
  },

  // Primary action button
  primaryAction: {
    height: 40,
    paddingX: 16,
    paddingY: 10,
    marginX: 12,
    marginY: 12,
    iconSize: 18,
    iconGap: 8,
  },
} as const;

// ============================================================================
// NAVIGATION TYPOGRAPHY
// Clean, readable text styles
// ============================================================================

export const navigationTypography = {
  // Menu item text
  menuItem: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },

  // Active menu item
  menuItemActive: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },

  // Section headers
  sectionHeader: {
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },

  // Channel name
  channelName: {
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em',
  },

  // Channel metadata (email, phone)
  channelMeta: {
    fontSize: 11,
    fontWeight: 400,
    lineHeight: 1.3,
    letterSpacing: '0.01em',
  },

  // Primary action button
  primaryAction: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0.01em',
  },

  // Badge text
  badge: {
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0.02em',
  },
} as const;

// ============================================================================
// NAVIGATION RADIUS
// Consistent rounded corners
// ============================================================================

export const navigationRadius = {
  iconHighlight: 10,
  menuItem: 8,
  sectionContainer: 8,
  primaryAction: 10,
  channel: 8,
  badge: 10,
  avatar: 999,
} as const;

// ============================================================================
// NAVIGATION SHADOWS
// Subtle, modern shadows
// ============================================================================

export const navigationShadows = {
  iconBar: 'none',
  sidebar: '1px 0 0 0 rgba(0, 0, 0, 0.04)',
  primaryAction: navigationColors.primaryAction.shadow,
  primaryActionHover: navigationColors.primaryAction.shadowHover,
  dropdown: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
} as const;

// ============================================================================
// NAVIGATION TRANSITIONS
// Smooth, modern animations
// ============================================================================

export const navigationTransitions = {
  fast: '100ms ease-out',
  normal: '150ms ease-out',
  slow: '200ms ease-out',
  colors: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
  transform: 'transform 150ms ease-out',
  all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  expand: 'height 200ms ease-out, opacity 150ms ease-out',
} as const;

// ============================================================================
// NAVIGATION STYLES (Composite Styles)
// Pre-built style objects for common navigation patterns
// ============================================================================

export const navigationStyles = {
  // Icon bar container
  iconBarContainer: {
    width: navigationSpacing.iconBar.width,
    backgroundColor: navigationColors.iconBar.background,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: `${navigationSpacing.iconBar.padding}px`,
    gap: `${navigationSpacing.iconBar.verticalGap}px`,
  },

  // Icon button (in icon bar)
  iconButton: {
    width: navigationSpacing.iconBar.iconContainerSize,
    height: navigationSpacing.iconBar.iconContainerSize,
    borderRadius: navigationRadius.iconHighlight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: navigationColors.iconBar.icon,
    backgroundColor: 'transparent',
    transition: navigationTransitions.colors,
    cursor: 'pointer',
    border: 'none',
    '&:hover': {
      backgroundColor: navigationColors.iconBar.backgroundHover,
      color: navigationColors.iconBar.iconHover,
    },
  },

  // Active icon button
  iconButtonActive: {
    backgroundColor: navigationColors.iconBar.activeHighlight,
    color: navigationColors.iconBar.iconActive,
    '&:hover': {
      backgroundColor: navigationColors.iconBar.backgroundActive,
    },
  },

  // Sidebar container
  sidebarContainer: {
    width: navigationSpacing.sidebar.width,
    backgroundColor: navigationColors.sidebar.background,
    borderRight: `1px solid ${navigationColors.sidebar.border}`,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden',
  },

  // Menu item
  menuItem: {
    height: navigationSpacing.menuItem.height,
    padding: `${navigationSpacing.menuItem.paddingY}px ${navigationSpacing.menuItem.paddingX}px`,
    borderRadius: navigationRadius.menuItem,
    display: 'flex',
    alignItems: 'center',
    gap: `${navigationSpacing.menuItem.iconGap}px`,
    color: navigationColors.menuItem.text,
    backgroundColor: 'transparent',
    transition: navigationTransitions.colors,
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    position: 'relative' as const,
    ...navigationTypography.menuItem,
    '&:hover': {
      backgroundColor: navigationColors.menuItem.backgroundHover,
    },
  },

  // Active menu item
  menuItemActive: {
    backgroundColor: navigationColors.menuItem.backgroundActive,
    color: navigationColors.menuItem.textActive,
    ...navigationTypography.menuItemActive,
    '&::before': {
      content: '""',
      position: 'absolute' as const,
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: navigationSpacing.menuItem.accentBarWidth,
      height: navigationSpacing.menuItem.accentBarHeight,
      backgroundColor: navigationColors.menuItem.accentBar,
      borderRadius: '0 2px 2px 0',
    },
    '&:hover': {
      backgroundColor: navigationColors.menuItem.backgroundActive,
    },
  },

  // Menu item icon
  menuItemIcon: {
    width: navigationSpacing.menuItem.iconSize,
    height: navigationSpacing.menuItem.iconSize,
    color: navigationColors.menuItem.icon,
    flexShrink: 0,
  },

  // Active menu item icon
  menuItemIconActive: {
    color: navigationColors.menuItem.iconActive,
  },

  // Section header
  sectionHeader: {
    padding: `${navigationSpacing.sectionHeader.paddingY}px ${navigationSpacing.sectionHeader.paddingX}px`,
    marginTop: navigationSpacing.sectionHeader.marginTop,
    marginBottom: navigationSpacing.sectionHeader.marginBottom,
    color: navigationColors.sectionHeader.text,
    ...navigationTypography.sectionHeader,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Primary action button (New Ticket)
  primaryActionButton: {
    height: navigationSpacing.primaryAction.height,
    padding: `${navigationSpacing.primaryAction.paddingY}px ${navigationSpacing.primaryAction.paddingX}px`,
    margin: `${navigationSpacing.primaryAction.marginY}px ${navigationSpacing.primaryAction.marginX}px`,
    borderRadius: navigationRadius.primaryAction,
    backgroundColor: navigationColors.primaryAction.background,
    color: navigationColors.primaryAction.text,
    boxShadow: navigationShadows.primaryAction,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${navigationSpacing.primaryAction.iconGap}px`,
    transition: navigationTransitions.all,
    ...navigationTypography.primaryAction,
    '&:hover': {
      backgroundColor: navigationColors.primaryAction.backgroundHover,
      boxShadow: navigationShadows.primaryActionHover,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },

  // Channel item
  channelItem: {
    padding: `${navigationSpacing.channel.paddingY}px ${navigationSpacing.channel.paddingX}px`,
    borderRadius: navigationRadius.channel,
    display: 'flex',
    alignItems: 'center',
    gap: `${navigationSpacing.channel.iconGap}px`,
    color: navigationColors.channel.text,
    backgroundColor: 'transparent',
    transition: navigationTransitions.colors,
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    '&:hover': {
      backgroundColor: navigationColors.channel.backgroundHover,
    },
  },

  // Active channel item
  channelItemActive: {
    backgroundColor: navigationColors.channel.backgroundActive,
    '&:hover': {
      backgroundColor: navigationColors.channel.backgroundActive,
    },
  },

  // Channel name
  channelName: {
    ...navigationTypography.channelName,
    color: navigationColors.channel.text,
  },

  // Channel metadata
  channelMeta: {
    ...navigationTypography.channelMeta,
    color: navigationColors.channel.textMuted,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: navigationColors.sidebar.divider,
    margin: '8px 0',
  },

  // Scrollable area
  scrollArea: {
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    padding: `${navigationSpacing.sidebar.paddingY}px 0`,
  },
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export const navigationTokens = {
  colors: navigationColors,
  spacing: navigationSpacing,
  typography: navigationTypography,
  radius: navigationRadius,
  shadows: navigationShadows,
  transitions: navigationTransitions,
  styles: navigationStyles,
} as const;

export type NavigationColorKey = keyof typeof navigationColors;
export type NavigationSpacingKey = keyof typeof navigationSpacing;

