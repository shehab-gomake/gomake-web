/**
 * NavigationSidebar Styled Components
 * 
 * Uses the centralized design system tokens for consistent styling.
 * All components follow the modern SaaS aesthetic defined in navigation.tokens.ts
 */

import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import {
  navigationColors,
  navigationSpacing,
  navigationTypography,
  navigationRadius,
  navigationTransitions,
  colorTokens,
} from '@/widgets/frontdesk/design-system/tokens';

/**
 * Main sidebar container
 */
export const SidebarContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: navigationColors.sidebar.background,
  borderRight: `1px solid ${navigationColors.sidebar.border}`,
  userSelect: 'none',
  overflow: 'hidden',
}));

/**
 * Logo section at the top
 */
export const LogoSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 56,
  borderBottom: `1px solid ${navigationColors.sidebar.divider}`,
  backgroundColor: navigationColors.sidebar.backgroundAlt,
  flexShrink: 0,
}));

/**
 * Navigation section container
 */
export const NavSection = styled(Box)(() => ({
  padding: `${navigationSpacing.sidebar.paddingY}px 0`,
  '& + &': {
    borderTop: `1px solid ${navigationColors.sidebar.divider}`,
  },
}));

/**
 * Navigation button (icon button in collapsed mode)
 */
export const NavButton = styled(IconButton)<{ isSelected?: boolean }>(({ isSelected }) => ({
  width: '100%',
  height: navigationSpacing.menuItem.height,
  borderRadius: navigationRadius.menuItem,
  position: 'relative',
  color: isSelected ? colorTokens.primary[600] : colorTokens.neutral[500],
  backgroundColor: isSelected ? navigationColors.menuItem.backgroundActive : 'transparent',
  transition: navigationTransitions.colors,

  '&:hover': {
    backgroundColor: isSelected
      ? navigationColors.menuItem.backgroundActive
      : navigationColors.menuItem.backgroundHover,
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: navigationSpacing.menuItem.accentBarWidth,
    height: navigationSpacing.menuItem.accentBarHeight,
    backgroundColor: navigationColors.menuItem.accentBar,
    opacity: isSelected ? 1 : 0,
    transition: `opacity ${navigationTransitions.normal}`,
    borderRadius: '0 2px 2px 0',
  },
}));

/**
 * Section label (uppercase header)
 */
export const SectionLabel = styled(Typography)(() => ({
  padding: `${navigationSpacing.sectionHeader.paddingY}px ${navigationSpacing.sectionHeader.paddingX}px`,
  marginTop: navigationSpacing.sectionHeader.marginTop,
  marginBottom: navigationSpacing.sectionHeader.marginBottom,
  color: navigationColors.sectionHeader.text,
  fontWeight: navigationTypography.sectionHeader.fontWeight,
  fontSize: navigationTypography.sectionHeader.fontSize,
  textTransform: navigationTypography.sectionHeader.textTransform,
  letterSpacing: navigationTypography.sectionHeader.letterSpacing,
  lineHeight: navigationTypography.sectionHeader.lineHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  transition: navigationTransitions.colors,

  '&:hover': {
    color: navigationColors.sectionHeader.textHover,
  },
}));

/**
 * Footer section (settings, etc.)
 */
export const FooterSection = styled(Box)(() => ({
  padding: navigationSpacing.sidebar.paddingY,
  borderTop: `1px solid ${navigationColors.sidebar.divider}`,
  marginTop: 'auto',
}));

/**
 * Scrollable content area
 */
export const ScrollableArea = styled(Box)(() => ({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: `${navigationSpacing.sidebar.paddingY}px 0`,

  // Custom scrollbar styling
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: colorTokens.neutral[300],
    borderRadius: 3,
    '&:hover': {
      backgroundColor: colorTokens.neutral[400],
    },
  },
}));

/**
 * Menu item container
 */
export const MenuItemContainer = styled(Box)<{ isActive?: boolean }>(({ isActive }) => ({
  height: navigationSpacing.menuItem.height,
  padding: `${navigationSpacing.menuItem.paddingY}px ${navigationSpacing.menuItem.paddingX}px`,
  margin: `0 ${navigationSpacing.sidebar.paddingX}px`,
  borderRadius: navigationRadius.menuItem,
  display: 'flex',
  alignItems: 'center',
  gap: navigationSpacing.menuItem.iconGap,
  color: isActive ? navigationColors.menuItem.textActive : navigationColors.menuItem.text,
  backgroundColor: isActive ? navigationColors.menuItem.backgroundActive : 'transparent',
  cursor: 'pointer',
  position: 'relative',
  transition: navigationTransitions.colors,

  '&:hover': {
    backgroundColor: isActive
      ? navigationColors.menuItem.backgroundActive
      : navigationColors.menuItem.backgroundHover,
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: navigationSpacing.menuItem.accentBarWidth,
    height: navigationSpacing.menuItem.accentBarHeight,
    backgroundColor: navigationColors.menuItem.accentBar,
    opacity: isActive ? 1 : 0,
    transition: `opacity ${navigationTransitions.normal}`,
    borderRadius: '0 2px 2px 0',
  },
}));

/**
 * Menu item text
 */
export const MenuItemText = styled(Typography)<{ isActive?: boolean }>(({ isActive }) => ({
  fontSize: navigationTypography.menuItem.fontSize,
  fontWeight: isActive ? navigationTypography.menuItemActive.fontWeight : navigationTypography.menuItem.fontWeight,
  lineHeight: navigationTypography.menuItem.lineHeight,
  letterSpacing: navigationTypography.menuItem.letterSpacing,
  color: isActive ? navigationColors.menuItem.textActive : navigationColors.menuItem.text,
}));

/**
 * Menu item icon container
 */
export const MenuItemIcon = styled(Box)<{ isActive?: boolean }>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: navigationSpacing.menuItem.iconSize,
  height: navigationSpacing.menuItem.iconSize,
  color: isActive ? navigationColors.menuItem.iconActive : navigationColors.menuItem.icon,
  flexShrink: 0,

  '& svg': {
    fontSize: navigationSpacing.menuItem.iconSize,
  },
}));

/**
 * Channel item container
 */
export const ChannelItemContainer = styled(Box)<{ isActive?: boolean }>(({ isActive }) => ({
  padding: `${navigationSpacing.channel.paddingY}px ${navigationSpacing.channel.paddingX}px`,
  margin: `0 ${navigationSpacing.sidebar.paddingX}px`,
  borderRadius: navigationRadius.channel,
  display: 'flex',
  alignItems: 'center',
  gap: navigationSpacing.channel.iconGap,
  backgroundColor: isActive ? navigationColors.channel.backgroundActive : 'transparent',
  cursor: 'pointer',
  transition: navigationTransitions.colors,

  '&:hover': {
    backgroundColor: isActive
      ? navigationColors.channel.backgroundActive
      : navigationColors.channel.backgroundHover,
  },
}));

/**
 * Channel name text
 */
export const ChannelName = styled(Typography)<{ isActive?: boolean }>(({ isActive }) => ({
  fontSize: navigationTypography.channelName.fontSize,
  fontWeight: isActive ? 600 : navigationTypography.channelName.fontWeight,
  lineHeight: navigationTypography.channelName.lineHeight,
  letterSpacing: navigationTypography.channelName.letterSpacing,
  color: navigationColors.channel.text,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

/**
 * Channel metadata text (email, phone, etc.)
 */
export const ChannelMeta = styled(Typography)(() => ({
  fontSize: navigationTypography.channelMeta.fontSize,
  fontWeight: navigationTypography.channelMeta.fontWeight,
  lineHeight: navigationTypography.channelMeta.lineHeight,
  letterSpacing: navigationTypography.channelMeta.letterSpacing,
  color: navigationColors.channel.textMuted,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

/**
 * Primary action button (New Ticket)
 */
export const PrimaryActionButton = styled(Box)(() => ({
  height: navigationSpacing.primaryAction.height,
  padding: `${navigationSpacing.primaryAction.paddingY}px ${navigationSpacing.primaryAction.paddingX}px`,
  margin: `${navigationSpacing.primaryAction.marginY}px ${navigationSpacing.primaryAction.marginX}px`,
  borderRadius: navigationRadius.primaryAction,
  backgroundColor: navigationColors.primaryAction.background,
  color: navigationColors.primaryAction.text,
  boxShadow: navigationColors.primaryAction.shadow,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: navigationSpacing.primaryAction.iconGap,
  cursor: 'pointer',
  transition: navigationTransitions.all,
  fontSize: navigationTypography.primaryAction.fontSize,
  fontWeight: navigationTypography.primaryAction.fontWeight,

  '&:hover': {
    backgroundColor: navigationColors.primaryAction.backgroundHover,
    boxShadow: navigationColors.primaryAction.shadowHover,
    transform: 'translateY(-1px)',
  },

  '&:active': {
    transform: 'translateY(0)',
  },
}));

/**
 * Divider line
 */
export const Divider = styled(Box)(() => ({
  height: 1,
  backgroundColor: navigationColors.sidebar.divider,
  margin: '8px 0',
}));
