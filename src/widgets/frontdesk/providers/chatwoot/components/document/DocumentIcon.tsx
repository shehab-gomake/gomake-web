/**
 * DocumentIcon Component
 *
 * Shared document icon box with consistent styling.
 * Replaces 4 duplicate implementations across components.
 */

import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

interface DocumentIconProps {
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Loading state shows spinner */
  loading?: boolean;
  /** Color variant */
  variant?: 'neutral' | 'primary';
  /** Custom color function for neutral variant */
  neutralColor?: (shade: number) => string;
  /** Custom color function for primary variant */
  primaryColor?: (shade: number) => string;
  /** Override background color */
  backgroundColor?: string;
  /** Override icon color */
  iconColor?: string;
}

const SIZE_MAP = {
  small: { box: 24, icon: 14 },
  medium: { box: 32, icon: 16 },
  large: { box: 40, icon: 20 },
};

export const DocumentIcon: React.FC<DocumentIconProps> = ({
  size = 'medium',
  loading = false,
  variant = 'neutral',
  neutralColor,
  primaryColor,
  backgroundColor,
  iconColor,
}) => {
  const dimensions = SIZE_MAP[size];

  // Default colors if no custom functions provided
  const defaultBgColor =
    variant === 'primary'
      ? primaryColor?.(50) || '#EFF6FF'
      : neutralColor?.(100) || '#F3F4F6';

  const defaultIconColor =
    variant === 'primary'
      ? primaryColor?.(600) || '#2563EB'
      : neutralColor?.(600) || '#4B5563';

  const finalBgColor = backgroundColor || defaultBgColor;
  const finalIconColor = iconColor || defaultIconColor;

  return (
    <Box
      sx={{
        width: dimensions.box,
        height: dimensions.box,
        borderRadius: '6px',
        backgroundColor: finalBgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {loading ? (
        <CircularProgress
          size={dimensions.icon}
          sx={{ color: finalIconColor }}
        />
      ) : (
        <DescriptionOutlinedIcon
          sx={{
            fontSize: dimensions.icon,
            color: finalIconColor,
          }}
        />
      )}
    </Box>
  );
};
