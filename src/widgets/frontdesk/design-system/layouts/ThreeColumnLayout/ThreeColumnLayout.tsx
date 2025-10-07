import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { colorTokens, semanticSpacing } from '../../tokens';

export interface ThreeColumnLayoutProps {
  /** Navigation sidebar content (Column 1) */
  navigationContent: React.ReactNode;
  /** List panel content (Column 2) */
  listContent?: React.ReactNode;
  /** Main content area (Column 3) */
  mainContent: React.ReactNode;
  /** Navigation column width in pixels */
  navigationWidth?: number;
  /** List column width in pixels */
  listWidth?: number;
  /** Hide the middle list column */
  hideListColumn?: boolean;
  /** Custom sx styles */
  sx?: SxProps<Theme>;
}

/**
 * ThreeColumnLayout Component
 *
 * Standardized three-column layout for FrontDesk feature
 * Left: Navigation | Middle: List | Right: Content
 */
export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  navigationContent,
  listContent,
  mainContent,
  navigationWidth = semanticSpacing.column.navigation,
  listWidth = semanticSpacing.column.list,
  hideListColumn = false,
  sx = {},
}) => {
  const showListColumn = !hideListColumn && listContent;

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: colorTokens.semantic.background.secondary,
        ...sx,
      }}
    >
      {/* Column 1: Navigation Sidebar */}
      <Box
        sx={{
          width: navigationWidth,
          minWidth: navigationWidth,
          height: '100%',
          borderRight: `1px solid ${colorTokens.semantic.border.default}`,
          backgroundColor: colorTokens.semantic.background.primary,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
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
            borderRight: `1px solid ${colorTokens.semantic.border.default}`,
            backgroundColor: colorTokens.semantic.background.primary,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.2s ease',
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
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Allow content to shrink
        }}
      >
        {mainContent}
      </Box>
    </Box>
  );
};