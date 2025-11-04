/**
 * Conversation Labels Component
 *
 * Simple, stable display of conversation labels with colored dots.
 * No dynamic resizing - just shows up to maxLabels with truncation.
 */

import React from 'react';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { colorTokens } from '@/widgets/frontdesk/design-system/tokens';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ConversationLabel {
  id?: number | string;
  title: string;
  color?: string;
}

export interface ConversationLabelsProps {
  labels: string[] | ConversationLabel[];
  accountLabels?: ConversationLabel[];
  maxLabels?: number;
  sx?: SxProps<Theme>;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_LABEL_COLOR = '#6B7280';
const DOT_SIZE = 6;

// ============================================================================
// Component
// ============================================================================

export const ConversationLabels: React.FC<ConversationLabelsProps> = ({
  labels,
  accountLabels,
  maxLabels = 2,
  sx,
}) => {
  if (!labels || labels.length === 0) {
    return null;
  }

  // Convert string labels to objects with colors
  const enrichedLabels: ConversationLabel[] = labels.map((label) => {
    if (typeof label === 'string') {
      const accountLabel = accountLabels?.find((al) => al.title === label);
      return accountLabel || { title: label, color: DEFAULT_LABEL_COLOR };
    }
    return label;
  });

  const visibleLabels = enrichedLabels.slice(0, maxLabels);
  const remainingCount = enrichedLabels.length - visibleLabels.length;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        minWidth: 0,
        ...sx,
      }}
    >
      {visibleLabels.map((label, index) => (
        <Box
          key={label.id || index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            minWidth: 0,
            backgroundColor: colorTokens.semantic.background.secondary,
            borderRadius: '12px',
            padding: '2px 8px',
            border: `1px solid ${colorTokens.semantic.border.light}`,
          }}
        >
          <Box
            sx={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: '50%',
              backgroundColor: label.color || DEFAULT_LABEL_COLOR,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              color: colorTokens.semantic.text.secondary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '70px',
            }}
          >
            {label.title}
          </Typography>
        </Box>
      ))}
      {remainingCount > 0 && (
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            color: colorTokens.semantic.text.tertiary,
            whiteSpace: 'nowrap',
          }}
        >
          +{remainingCount}
        </Typography>
      )}
    </Box>
  );
};
