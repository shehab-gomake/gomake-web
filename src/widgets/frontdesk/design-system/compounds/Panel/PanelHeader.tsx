import React from 'react';
import { Box, Typography, Stack, SxProps, Theme } from '@mui/material';
import { colorTokens, semanticSpacing, semanticTypography } from '../../tokens';

export interface PanelHeaderProps {
  /** Header title */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Actions to display on the right */
  actions?: React.ReactNode;
  /** Show bottom border */
  divider?: boolean;
  /** Custom sx styles */
  sx?: SxProps<Theme>;
}

/**
 * PanelHeader Component
 *
 * Consistent header for panels, modals, and content sections
 */
export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  subtitle,
  actions,
  divider = true,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        py: 2,
        px: 2,
        borderBottom: divider
          ? `1px solid ${colorTokens.semantic.border.default}`
          : 'none',
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: semanticTypography.heading.h5.fontSize,
              fontWeight: semanticTypography.heading.h5.fontWeight,
              color: colorTokens.semantic.text.primary,
              lineHeight: semanticTypography.heading.h5.lineHeight,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                fontSize: semanticTypography.caption.medium.fontSize,
                color: colorTokens.semantic.text.secondary,
                mt: 0.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Stack direction="row" alignItems="center" spacing={1}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};