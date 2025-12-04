import React from 'react';
import { Box, Stack, SxProps, Theme } from '@mui/material';
import { colorTokens, semanticSpacing } from '../../tokens';
import { layoutTokens, zIndexTokens } from '../../tokens/layout.tokens';

export interface ActionBarProps {
  /** Action bar content (buttons, inputs, etc.) */
  children: React.ReactNode;
  /** Position */
  position?: 'top' | 'bottom';
  /** Alignment of children */
  align?: 'left' | 'center' | 'right' | 'space-between';
  /** Whether bar is sticky */
  sticky?: boolean;
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg';
  /** Show border */
  bordered?: boolean;
  /** Background variant */
  background?: 'primary' | 'secondary' | 'transparent';
  /** Custom styles */
  sx?: SxProps<Theme>;
}

const alignMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  'space-between': 'space-between',
};

const paddingMap = {
  sm: semanticSpacing.container.sm,
  md: semanticSpacing.container.md,
  lg: semanticSpacing.container.lg,
};

const backgroundMap = {
  primary: colorTokens.semantic.background.primary,
  secondary: colorTokens.semantic.background.secondary,
  transparent: 'transparent',
};

/**
 * ActionBar Component
 *
 * Container for action buttons, typically at the bottom of a form or panel
 */
export const ActionBar: React.FC<ActionBarProps> = ({
  children,
  position = 'bottom',
  align = 'right',
  sticky = false,
  padding = 'md',
  bordered = true,
  background = 'primary',
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: alignMap[align],
        gap: 1,
        minHeight: layoutTokens.footer.actionBar,
        px: paddingMap[padding] / 8,
        py: 1,
        backgroundColor: backgroundMap[background],
        borderTop: position === 'bottom' && bordered ? `1px solid ${colorTokens.semantic.border.default}` : 'none',
        borderBottom: position === 'top' && bordered ? `1px solid ${colorTokens.semantic.border.default}` : 'none',
        ...(sticky && {
          position: 'sticky',
          [position]: 0,
          zIndex: zIndexTokens.stickyHeader,
        }),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

/**
 * ActionBarGroup - Group related actions together
 */
export const ActionBarGroup: React.FC<{
  children: React.ReactNode;
  align?: 'left' | 'right';
  sx?: SxProps<Theme>;
}> = ({ children, align = 'left', sx = {} }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    sx={{
      marginLeft: align === 'right' ? 'auto' : 0,
      marginRight: align === 'left' ? 'auto' : 0,
      ...sx,
    }}
  >
    {children}
  </Stack>
);

