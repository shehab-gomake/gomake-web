import React from 'react';
import { Box, Typography, Stack, IconButton, SxProps, Theme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { colorTokens, semanticTypography, semanticSpacing } from '../../tokens';
import { layoutTokens, transitionTokens } from '../../tokens/layout.tokens';

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Whether to show back button */
  showBack?: boolean;
  /** Back button click handler */
  onBack?: () => void;
  /** Right side actions */
  actions?: React.ReactNode;
  /** Left side content (before title) */
  leftContent?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether header is sticky */
  sticky?: boolean;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

const sizeStyles = {
  sm: {
    height: layoutTokens.header.compact,
    titleStyle: semanticTypography.heading.h5,
    subtitleStyle: semanticTypography.caption.medium,
    px: semanticSpacing.container.sm,
  },
  md: {
    height: layoutTokens.header.section,
    titleStyle: semanticTypography.heading.h4,
    subtitleStyle: semanticTypography.body.small,
    px: semanticSpacing.container.md,
  },
  lg: {
    height: layoutTokens.header.page,
    titleStyle: semanticTypography.heading.h3,
    subtitleStyle: semanticTypography.body.medium,
    px: semanticSpacing.container.lg,
  },
};

/**
 * PageHeader Component
 *
 * Consistent header for pages and sections with title, actions, and navigation
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  actions,
  leftContent,
  size = 'md',
  sticky = false,
  sx = {},
}) => {
  const styles = sizeStyles[size];

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: styles.height,
        px: styles.px / 8,
        py: 1,
        backgroundColor: colorTokens.semantic.background.primary,
        borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
        transition: transitionTokens.presets.colors,
        ...(sticky && {
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }),
        ...sx,
      }}
    >
      {/* Left section */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
        {showBack && (
          <IconButton
            onClick={onBack}
            size="small"
            sx={{
              color: colorTokens.semantic.text.secondary,
              '&:hover': {
                backgroundColor: colorTokens.semantic.interactive.hover,
                color: colorTokens.semantic.text.primary,
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {leftContent}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h1"
            sx={{
              ...styles.titleStyle,
              color: colorTokens.semantic.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                ...styles.subtitleStyle,
                color: colorTokens.semantic.text.secondary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>

      {/* Right section - Actions */}
      {actions && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0, ml: 2 }}>
          {actions}
        </Stack>
      )}
    </Box>
  );
};

