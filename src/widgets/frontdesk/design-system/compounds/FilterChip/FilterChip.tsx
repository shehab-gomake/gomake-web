import React from 'react';
import { Box, Typography, IconButton, Stack, SxProps, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { colorTokens, radiusTokens, semanticTypography } from '../../tokens';
import { transitionTokens } from '../../tokens/layout.tokens';

export interface FilterChipProps {
  /** Filter label */
  label: string;
  /** Filter value (displayed after label) */
  value?: string;
  /** Color variant */
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  /** Whether chip is removable */
  onRemove?: () => void;
  /** Click handler */
  onClick?: () => void;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

const colorSchemes = {
  primary: {
    bg: colorTokens.primary[50],
    text: colorTokens.primary[700],
    border: colorTokens.primary[200],
    hoverBg: colorTokens.primary[100],
    iconColor: colorTokens.primary[500],
  },
  success: {
    bg: colorTokens.success[50],
    text: colorTokens.success[700],
    border: colorTokens.success[200],
    hoverBg: colorTokens.success[100],
    iconColor: colorTokens.success[500],
  },
  warning: {
    bg: colorTokens.warning[50],
    text: colorTokens.warning[700],
    border: colorTokens.warning[200],
    hoverBg: colorTokens.warning[100],
    iconColor: colorTokens.warning[500],
  },
  error: {
    bg: colorTokens.error[50],
    text: colorTokens.error[700],
    border: colorTokens.error[200],
    hoverBg: colorTokens.error[100],
    iconColor: colorTokens.error[500],
  },
  neutral: {
    bg: colorTokens.neutral[100],
    text: colorTokens.neutral[700],
    border: colorTokens.neutral[200],
    hoverBg: colorTokens.neutral[200],
    iconColor: colorTokens.neutral[500],
  },
};

/**
 * FilterChip Component
 *
 * Active filter indicator with optional remove button
 */
export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  value,
  color = 'primary',
  onRemove,
  onClick,
  icon,
  sx = {},
}) => {
  const scheme = colorSchemes[color];
  const isClickable = Boolean(onClick);

  return (
    <Box
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        height: 28,
        px: 1,
        backgroundColor: scheme.bg,
        border: `1px solid ${scheme.border}`,
        borderRadius: radiusTokens.full,
        cursor: isClickable ? 'pointer' : 'default',
        transition: transitionTokens.presets.colors,
        '&:hover': isClickable ? {
          backgroundColor: scheme.hoverBg,
        } : {},
        ...sx,
      }}
    >
      {/* Icon */}
      {icon && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: scheme.iconColor,
            '& svg': { fontSize: 14 },
          }}
        >
          {icon}
        </Box>
      )}

      {/* Label */}
      <Typography
        component="span"
        sx={{
          ...semanticTypography.label.small,
          color: scheme.text,
        }}
      >
        {label}
        {value && (
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
              ml: 0.5,
            }}
          >
            {value}
          </Typography>
        )}
      </Typography>

      {/* Remove button */}
      {onRemove && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          sx={{
            p: 0.25,
            ml: 0.25,
            color: scheme.iconColor,
            '&:hover': {
              backgroundColor: scheme.hoverBg,
              color: scheme.text,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
    </Box>
  );
};

/**
 * FilterChipGroup - Container for multiple filter chips
 */
export const FilterChipGroup: React.FC<{
  children: React.ReactNode;
  onClearAll?: () => void;
  clearLabel?: string;
  sx?: SxProps<Theme>;
}> = ({ children, onClearAll, clearLabel = 'Clear all', sx = {} }) => (
  <Stack
    direction="row"
    spacing={0.75}
    alignItems="center"
    flexWrap="wrap"
    sx={{ gap: 0.75, ...sx }}
  >
    {children}
    {onClearAll && (
      <Typography
        component="button"
        onClick={onClearAll}
        sx={{
          ...semanticTypography.label.small,
          color: colorTokens.semantic.text.link,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          '&:hover': {
            color: colorTokens.semantic.text.linkHover,
            textDecoration: 'underline',
          },
        }}
      >
        {clearLabel}
      </Typography>
    )}
  </Stack>
);

