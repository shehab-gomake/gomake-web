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
  Paper,
} from '@mui/material';
import {
  Warning as WarningIcon,
} from '@mui/icons-material';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';
import { useChatwootWarnings, WarningSeverity } from '../../hooks/use-chatwoot-warnings';

interface ChatwootWarningsCardProps {
  /** Callback when card is clicked */
  onClick?: () => void;
}

export const ChatwootWarningsCard: React.FC<ChatwootWarningsCardProps> = ({
  onClick,
}) => {
  const warnings = useChatwootWarnings();

  // Determine border color based on highest severity
  const hasErrors = warnings.some((w) => w.severity === WarningSeverity.ERROR);
  const borderColor = hasErrors
    ? colorTokens.error[500]
    : warnings.length > 0
      ? colorTokens.warning[500]
      : colorTokens.neutral[300];

  const iconBgColor = hasErrors
    ? colorTokens.error[50]
    : warnings.length > 0
      ? colorTokens.warning[50]
      : colorTokens.neutral[50];

  const iconColor = hasErrors
    ? colorTokens.error[600]
    : warnings.length > 0
      ? colorTokens.warning[600]
      : colorTokens.neutral[600];

  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 3,
        cursor: 'pointer',
        borderTop: `4px solid ${borderColor}`,
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: colorTokens.neutral[700],
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          SYSTEM WARNINGS
        </Typography>
        <Box
          sx={{
            backgroundColor: iconBgColor,
            borderRadius: '8px',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningIcon sx={{ fontSize: 32, color: iconColor }} />
        </Box>
      </Box>
      <Typography
        variant="h3"
        sx={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: colorTokens.neutral[900],
          mt: 2,
          mb: 1,
        }}
      >
        {warnings.length}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: colorTokens.neutral[600],
          fontSize: '0.875rem',
        }}
      >
        {warnings.length === 0 
          ? 'All systems operational' 
          : hasErrors 
            ? 'Need immediate attention'
            : 'Requires configuration'}
      </Typography>
    </Paper>
  );
};

