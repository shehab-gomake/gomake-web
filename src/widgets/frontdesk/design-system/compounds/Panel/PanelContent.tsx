import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

export interface PanelContentProps {
  /** Content to display */
  children: React.ReactNode;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Enable scrolling */
  scrollable?: boolean;
  /** Custom sx styles */
  sx?: SxProps<Theme>;
}

const paddingMap = {
  none: 0,
  sm: 1.5,
  md: 2,
  lg: 3,
};

/**
 * PanelContent Component
 *
 * Content area for panels with optional scrolling
 */
export const PanelContent: React.FC<PanelContentProps> = ({
  children,
  padding = 'md',
  scrollable = false,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        p: paddingMap[padding],
        overflow: scrollable ? 'auto' : 'visible',
        flex: scrollable ? 1 : undefined,
        minHeight: scrollable ? 0 : undefined,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};