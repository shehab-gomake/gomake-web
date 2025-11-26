/**
 * DocumentInfoDisplay Component
 *
 * Shared component for displaying document information.
 * Replaces duplicate info stack implementations.
 */

import React from 'react';
import { Typography, Stack } from '@mui/material';

interface DocumentInfoDisplayProps {
  /** Document number */
  number: string;
  /** Formatted amount string */
  amount?: string;
  /** Formatted date string */
  date?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
  /** Custom color function for neutral shades */
  neutralColor?: (shade: number) => string;
  /** Status element to render */
  statusElement?: React.ReactNode;
  /** Children to render below main info */
  children?: React.ReactNode;
}

export const DocumentInfoDisplay: React.FC<DocumentInfoDisplayProps> = ({
  number,
  amount,
  date,
  compact = false,
  neutralColor,
  statusElement,
  children,
}) => {
  // Default color function
  const getColor = neutralColor || ((shade: number) => {
    const colors: Record<number, string> = {
      600: '#4B5563',
      700: '#374151',
      900: '#111827',
    };
    return colors[shade] || '#4B5563';
  });

  if (compact) {
    return (
      <Stack spacing={0.25}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: 13,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {number}
        </Typography>
        {children}
      </Stack>
    );
  }

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: getColor(900),
            fontSize: '0.875rem',
            minWidth: '80px',
          }}
        >
          {number}
        </Typography>
        {amount && (
          <Typography
            variant="caption"
            sx={{
              color: getColor(700),
              fontSize: '0.8125rem',
              fontWeight: 500,
              minWidth: '100px',
            }}
          >
            {amount}
          </Typography>
        )}
        {date && (
          <Typography
            variant="caption"
            sx={{
              color: getColor(600),
              fontSize: '0.75rem',
            }}
          >
            {date}
          </Typography>
        )}
      </Stack>
      {children}
      {statusElement && (
        <Stack direction="row" alignItems="center">
          {statusElement}
        </Stack>
      )}
    </Stack>
  );
};
