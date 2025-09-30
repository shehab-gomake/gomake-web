import React from 'react';
import { Box, Stack, SxProps, Theme } from '@mui/material';
import { colorTokens } from '../../tokens';

export interface NavigationColumnProps {
  /** Header content (logo, title, etc.) */
  header?: React.ReactNode;
  /** Main navigation items */
  children: React.ReactNode;
  /** Footer content (settings, user menu, etc.) */
  footer?: React.ReactNode;
  /** Custom sx styles */
  sx?: SxProps<Theme>;
}

/**
 * NavigationColumn Component
 *
 * Structured navigation sidebar with header, content, and footer areas
 */
export const NavigationColumn: React.FC<NavigationColumnProps> = ({
  header,
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
      {header && (
        <Box
          sx={{
            py: 2,
            px: 2,
            borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
          }}
        >
          {header}
        </Box>
      )}

      {/* Navigation Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
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
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      {footer && (
        <Box
          sx={{
            py: 2,
            px: 2,
            borderTop: `1px solid ${colorTokens.semantic.border.default}`,
          }}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
};