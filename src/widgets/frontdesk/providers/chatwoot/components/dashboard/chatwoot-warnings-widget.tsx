/**
 * Chatwoot Warnings Card
 *
 * Single stat card showing total warnings count.
 * Displayed alongside other dashboard stat cards.
 * Clicking opens the warnings settings page.
 */

import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Warning as WarningIcon,
} from '@mui/icons-material';
import { colorTokens, shadowTokens } from '@/widgets/frontdesk/design-system/tokens';
import { useChatwootWarnings } from '../../hooks/use-chatwoot-warnings';
import { formatStatValue } from '../../utils';

interface ChatwootWarningsCardProps {
  /** Callback when card is clicked */
  onClick?: () => void;
}

export const ChatwootWarningsCard: React.FC<ChatwootWarningsCardProps> = ({
  onClick,
}) => {
  const theme = useTheme();
  const warnings = useChatwootWarnings();

  // Use warning/amber red accent for warnings (not error red)
  // Warnings are informational, not critical errors
  const accentColor = warnings.length > 0
    ? '#F59E0B' // Amber/warning red - softer than error red
    : colorTokens.neutral[600];

  const iconBgColor = warnings.length > 0
    ? '#FEF3C7' // Light amber background
    : `${colorTokens.neutral[600]}15`;

  const iconColor = warnings.length > 0
    ? '#D97706' // Darker amber for icon
    : colorTokens.neutral[600];

  const description = warnings.length === 0 
    ? 'All systems operational' 
    : 'Requires attention';

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${colorTokens.neutral[200]}`,
        p: 3,
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: shadowTokens.sm,
        position: 'relative',
        overflow: 'hidden',
        '&:hover': onClick ? {
          boxShadow: shadowTokens.md,
          transform: 'translateY(-2px)',
          borderColor: accentColor,
        } : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          backgroundColor: accentColor,
        }
      }}
    >
      {/* Header Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: colorTokens.neutral[600],
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            SYSTEM WARNINGS
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            flexShrink: 0,
          }}
        >
          <WarningIcon sx={{ fontSize: 24 }} />
        </Box>
      </Box>

      {/* Value Display */}
      <Box sx={{ mb: description ? 1 : 0 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: '2rem',
            fontWeight: 700,
            color: colorTokens.neutral[900],
            lineHeight: 1.2,
          }}
        >
          {formatStatValue(warnings.length)}
        </Typography>
      </Box>

      {/* Footer Row - Description */}
      {description && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.813rem',
              color: colorTokens.neutral[500],
            }}
          >
            {description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

