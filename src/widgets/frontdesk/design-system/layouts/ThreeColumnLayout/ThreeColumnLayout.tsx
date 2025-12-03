import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { colorTokens, semanticSpacing, layoutTokens, radiusTokens, shadowTokens } from '../../tokens';

export interface ThreeColumnLayoutProps {
  /** Navigation sidebar content (Column 1) */
  navigationContent: React.ReactNode;
  /** List panel content (Column 2) */
  listContent?: React.ReactNode;
  /** Main content area (Column 3) */
  mainContent: React.ReactNode;
  /** Detail sidebar content (Column 4 - optional) */
  detailContent?: React.ReactNode;
  /** Navigation column width in pixels */
  navigationWidth?: number;
  /** List column width in pixels */
  listWidth?: number;
  /** Detail sidebar width in pixels */
  detailWidth?: number;
  /** Hide the middle list column */
  hideListColumn?: boolean;
  /** Hide the detail sidebar */
  hideDetailColumn?: boolean;
  /** Custom sx styles */
  sx?: SxProps<Theme>;
}

// Layout constants based on 12-column grid with 24px gutter
const LAYOUT = {
  gutter: layoutTokens.columnGap.default,     // 24px breathing room between columns
  containerPadding: 16,                        // Outer container padding
  columnRadius: radiusTokens.xl,               // 14px card radius
  columnShadow: shadowTokens.card,             // Soft shadow
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * ThreeColumnLayout Component
 *
 * Modern 12-column responsive grid layout for FrontDesk feature.
 * Features:
 * - 24px gutter spacing between columns
 * - 14px border radius on panels
 * - Soft shadows for depth
 * - Clean visual hierarchy
 *
 * Layout: Navigation | List | Content | Detail (optional)
 */
export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  navigationContent,
  listContent,
  mainContent,
  detailContent,
  navigationWidth = layoutTokens.panel.navigation.default,
  listWidth = layoutTokens.panel.conversationList.default,
  detailWidth = layoutTokens.panel.detailSidebar.default,
  hideListColumn = false,
  hideDetailColumn = true,
  sx = {},
}) => {
  const showListColumn = !hideListColumn && listContent;
  const showDetailColumn = !hideDetailColumn && detailContent;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: colorTokens.neutral[100], // Subtle background for contrast
        gap: `${LAYOUT.gutter}px`,                  // 24px gutter between columns
        padding: `${LAYOUT.containerPadding}px`,   // Container padding
        ...sx,
      }}
    >
      {/* Column 1: Navigation Sidebar */}
      <Box
        sx={{
          width: navigationWidth,
          minWidth: navigationWidth,
          height: '100%',
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${LAYOUT.columnRadius}px`,
          boxShadow: LAYOUT.columnShadow,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: LAYOUT.transition,
        }}
      >
        {navigationContent}
      </Box>

      {/* Column 2: List Panel (conditionally rendered) */}
      {showListColumn && (
        <Box
          sx={{
            width: listWidth,
            minWidth: listWidth,
            height: '100%',
            backgroundColor: colorTokens.semantic.background.primary,
            borderRadius: `${LAYOUT.columnRadius}px`,
            boxShadow: LAYOUT.columnShadow,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: LAYOUT.transition,
          }}
        >
          {listContent}
        </Box>
      )}

      {/* Column 3: Main Content Area */}
      <Box
        sx={{
          flex: 1,
          height: '100%',
          backgroundColor: colorTokens.semantic.background.primary,
          borderRadius: `${LAYOUT.columnRadius}px`,
          boxShadow: LAYOUT.columnShadow,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Allow content to shrink
          transition: LAYOUT.transition,
        }}
      >
        {mainContent}
      </Box>

      {/* Column 4: Detail Sidebar (conditionally rendered) */}
      {showDetailColumn && (
        <Box
          sx={{
            width: detailWidth,
            minWidth: detailWidth,
            height: '100%',
            backgroundColor: colorTokens.semantic.background.primary,
            borderRadius: `${LAYOUT.columnRadius}px`,
            boxShadow: LAYOUT.columnShadow,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: LAYOUT.transition,
          }}
        >
          {detailContent}
        </Box>
      )}
    </Box>
  );
};