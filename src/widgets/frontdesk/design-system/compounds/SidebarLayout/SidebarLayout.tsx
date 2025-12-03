import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { colorTokens } from '../../tokens';
import { layoutTokens, zIndexTokens, transitionTokens } from '../../tokens/layout.tokens';

export interface SidebarLayoutProps {
  /** Sidebar content */
  children: React.ReactNode;
  /** Whether sidebar is collapsed */
  collapsed?: boolean;
  /** Expanded width */
  width?: number;
  /** Collapsed width */
  collapsedWidth?: number;
  /** Position */
  position?: 'left' | 'right';
  /** Whether to show border */
  bordered?: boolean;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

/**
 * SidebarLayout Component
 *
 * Collapsible sidebar container for navigation and secondary content
 */
export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  collapsed = false,
  width = layoutTokens.panel.navigation.default,
  collapsedWidth = layoutTokens.panel.navigation.collapsed,
  position = 'left',
  bordered = true,
  sx = {},
}) => {
  return (
    <Box
      component="aside"
      sx={{
        width: collapsed ? collapsedWidth : width,
        minWidth: collapsed ? collapsedWidth : width,
        height: '100%',
        backgroundColor: colorTokens.semantic.background.primary,
        borderRight: position === 'left' && bordered ? `1px solid ${colorTokens.semantic.border.default}` : 'none',
        borderLeft: position === 'right' && bordered ? `1px solid ${colorTokens.semantic.border.default}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: transitionTokens.presets.expand,
        zIndex: zIndexTokens.sidebar,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

/**
 * SidebarHeader - Header section for sidebar
 */
export const SidebarHeader: React.FC<{
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ children, sx = {} }) => (
  <Box
    sx={{
      flexShrink: 0,
      borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
      ...sx,
    }}
  >
    {children}
  </Box>
);

/**
 * SidebarContent - Scrollable content area
 */
export const SidebarContent: React.FC<{
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ children, sx = {} }) => (
  <Box
    sx={{
      flex: 1,
      overflow: 'auto',
      ...sx,
    }}
  >
    {children}
  </Box>
);

/**
 * SidebarFooter - Footer section for sidebar
 */
export const SidebarFooter: React.FC<{
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ children, sx = {} }) => (
  <Box
    sx={{
      flexShrink: 0,
      borderTop: `1px solid ${colorTokens.semantic.border.default}`,
      ...sx,
    }}
  >
    {children}
  </Box>
);

