import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { PanelHeader } from '../../compounds/Panel';

export interface ContentColumnProps {
  /** Header title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Header actions (buttons, menus, etc.) */
  headerActions?: React.ReactNode;
  /** Show header */
  showHeader?: boolean;
  /** Main content */
  children: React.ReactNode;
  /** Footer content (action bar, etc.) */
  footer?: React.ReactNode;
  /** Custom sx styles */
  sx?: SxProps<Theme>;
}

/**
 * ContentColumn Component
 *
 * Right column for main content (message viewer, ticket details, etc.)
 */
export const ContentColumn: React.FC<ContentColumnProps> = ({
  title,
  subtitle,
  headerActions,
  showHeader = false,
  children,
  footer,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        ...sx,
      }}
    >
      {/* Header */}
      {showHeader && title && (
        <PanelHeader
          title={title}
          subtitle={subtitle}
          actions={headerActions}
          divider
        />
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      {footer && <Box sx={{ flexShrink: 0 }}>{footer}</Box>}
    </Box>
  );
};