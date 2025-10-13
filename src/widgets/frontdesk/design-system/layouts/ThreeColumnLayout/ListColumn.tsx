import React from 'react';
import { Box, List, SxProps, Theme } from '@mui/material';
import { PanelHeader } from '../../compounds/Panel';
import { colorTokens } from '../../tokens';

export interface ListColumnProps {
  /** Column title */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Header actions (buttons, filters, etc.) */
  headerActions?: React.ReactNode;
  /** List items */
  children: React.ReactNode;
  /** Show loading state */
  loading?: boolean;
  /** Empty state component */
  emptyState?: React.ReactNode;
  /** Enable virtualization for long lists */
  virtualized?: boolean;
  /** Custom sx styles */
  sx?: SxProps<Theme>;
}

/**
 * ListColumn Component
 *
 * Middle column for displaying lists (conversations, tickets, etc.)
 */
export const ListColumn: React.FC<ListColumnProps> = ({
  title,
  subtitle,
  headerActions,
  children,
  loading = false,
  emptyState,
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
      <PanelHeader
        title={title}
        subtitle={subtitle}
        actions={headerActions}
        divider
      />

      {/* List Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
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
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
            }}
          >
            Loading...
          </Box>
        ) : React.Children.count(children) === 0 && emptyState ? (
          emptyState
        ) : (
          <List disablePadding>{children}</List>
        )}
      </Box>
    </Box>
  );
};