import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { presenceColors, Presence } from '../../tokens/chatwoot.tokens';
import { transitionTokens } from '../../tokens/layout.tokens';

export interface StatusIndicatorProps {
  /** Status type */
  status: Presence;
  /** Size of the indicator */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Whether to show pulse animation */
  pulse?: boolean;
  /** Custom styles */
  sx?: SxProps<Theme>;
}

const sizeMap = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
};

/**
 * StatusIndicator Component
 *
 * Visual indicator for online/offline/busy/away states
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'sm',
  pulse = false,
  sx = {},
}) => {
  const colors = presenceColors[status] || presenceColors.offline;
  const indicatorSize = sizeMap[size];

  return (
    <Box
      sx={{
        position: 'relative',
        width: indicatorSize,
        height: indicatorSize,
        ...sx,
      }}
    >
      {/* Pulse animation ring */}
      {pulse && status !== 'offline' && (
        <Box
          sx={{
            position: 'absolute',
            inset: -2,
            borderRadius: '50%',
            backgroundColor: colors.pulse,
            opacity: 0.4,
            animation: 'statusPulse 2s ease-in-out infinite',
            '@keyframes statusPulse': {
              '0%, 100%': {
                transform: 'scale(1)',
                opacity: 0.4,
              },
              '50%': {
                transform: 'scale(1.3)',
                opacity: 0,
              },
            },
          }}
        />
      )}
      
      {/* Main indicator dot */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: colors.main,
          border: '2px solid white',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          transition: transitionTokens.presets.colors,
        }}
      />
    </Box>
  );
};

