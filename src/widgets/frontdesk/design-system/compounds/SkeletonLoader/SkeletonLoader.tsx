import React from 'react';
import { Box, Skeleton, Stack, SxProps, Theme } from '@mui/material';
import { colorTokens, radiusTokens } from '../../tokens';

export interface SkeletonLoaderProps {
  /** Skeleton variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Animation type */
  animation?: 'pulse' | 'wave' | false;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

/**
 * Base Skeleton with consistent styling
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rounded',
  width,
  height,
  animation = 'wave',
  sx = {},
}) => (
  <Skeleton
    variant={variant}
    width={width}
    height={height}
    animation={animation}
    sx={{
      backgroundColor: colorTokens.neutral[100],
      '&::after': {
        background: `linear-gradient(90deg, transparent, ${colorTokens.neutral[200]}, transparent)`,
      },
      ...sx,
    }}
  />
);

/**
 * Conversation List Item Skeleton
 */
export const ConversationListItemSkeleton: React.FC<{ sx?: SxProps<Theme> }> = ({ sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1.5,
      p: 1.5,
      borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
      ...sx,
    }}
  >
    <Skeleton variant="circular" width={32} height={32} animation="wave" />
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Skeleton variant="text" width="60%" height={16} animation="wave" />
        <Skeleton variant="text" width={40} height={12} animation="wave" />
      </Stack>
      <Skeleton variant="text" width="80%" height={14} animation="wave" />
      <Skeleton variant="text" width="40%" height={12} animation="wave" sx={{ mt: 0.5 }} />
    </Box>
  </Box>
);

/**
 * Message Item Skeleton
 */
export const MessageItemSkeleton: React.FC<{
  isOutgoing?: boolean;
  sx?: SxProps<Theme>;
}> = ({ isOutgoing = false, sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isOutgoing ? 'flex-end' : 'flex-start',
      mb: 2,
      ...sx,
    }}
  >
    {!isOutgoing && (
      <Skeleton variant="text" width={80} height={12} animation="wave" sx={{ mb: 0.5, ml: 1 }} />
    )}
    <Skeleton
      variant="rounded"
      width={isOutgoing ? '50%' : '60%'}
      height={60}
      animation="wave"
      sx={{ borderRadius: radiusTokens.lg }}
    />
  </Box>
);

/**
 * Card Skeleton
 */
export const CardSkeleton: React.FC<{
  hasHeader?: boolean;
  lines?: number;
  sx?: SxProps<Theme>;
}> = ({ hasHeader = true, lines = 3, sx = {} }) => (
  <Box
    sx={{
      border: `1px solid ${colorTokens.semantic.border.default}`,
      borderRadius: radiusTokens.lg,
      overflow: 'hidden',
      ...sx,
    }}
  >
    {hasHeader && (
      <Box sx={{ p: 2, borderBottom: `1px solid ${colorTokens.semantic.border.light}` }}>
        <Skeleton variant="text" width="40%" height={20} animation="wave" />
        <Skeleton variant="text" width="60%" height={14} animation="wave" sx={{ mt: 0.5 }} />
      </Box>
    )}
    <Box sx={{ p: 2 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '70%' : '100%'}
          height={16}
          animation="wave"
          sx={{ mb: i < lines - 1 ? 1 : 0 }}
        />
      ))}
    </Box>
  </Box>
);

/**
 * Stats Card Skeleton
 */
export const StatsCardSkeleton: React.FC<{ sx?: SxProps<Theme> }> = ({ sx = {} }) => (
  <Box
    sx={{
      p: 2,
      border: `1px solid ${colorTokens.semantic.border.default}`,
      borderRadius: radiusTokens.lg,
      minWidth: 160,
      ...sx,
    }}
  >
    <Skeleton variant="text" width="50%" height={14} animation="wave" />
    <Skeleton variant="text" width="70%" height={32} animation="wave" sx={{ mt: 1 }} />
    <Skeleton variant="text" width="40%" height={12} animation="wave" sx={{ mt: 0.5 }} />
  </Box>
);

/**
 * Detail Panel Skeleton
 */
export const DetailPanelSkeleton: React.FC<{ sx?: SxProps<Theme> }> = ({ sx = {} }) => (
  <Box sx={{ p: 2, ...sx }}>
    {/* Header */}
    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
      <Skeleton variant="circular" width={48} height={48} animation="wave" />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={20} animation="wave" />
        <Skeleton variant="text" width="40%" height={14} animation="wave" />
      </Box>
    </Stack>

    {/* Sections */}
    {[1, 2, 3].map((section) => (
      <Box key={section} sx={{ mb: 3 }}>
        <Skeleton variant="text" width={100} height={12} animation="wave" sx={{ mb: 1 }} />
        <Skeleton variant="rounded" width="100%" height={60} animation="wave" />
      </Box>
    ))}
  </Box>
);

/**
 * Table Row Skeleton
 */
export const TableRowSkeleton: React.FC<{
  columns?: number;
  sx?: SxProps<Theme>;
}> = ({ columns = 4, sx = {} }) => (
  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
    sx={{
      py: 1.5,
      px: 2,
      borderBottom: `1px solid ${colorTokens.semantic.border.default}`,
      ...sx,
    }}
  >
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === 0 ? '30%' : '20%'}
        height={16}
        animation="wave"
        sx={{ flex: i === 0 ? 2 : 1 }}
      />
    ))}
  </Stack>
);

