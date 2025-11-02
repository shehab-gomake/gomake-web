/**
 * Conversation Labels Component
 *
 * Displays conversation labels with colored dots and smart truncation.
 * Implements responsive width calculation to maximize visible labels.
 *
 * @see CONVERSATION_LIST_ICONS_GUIDE.md
 */

import React, { useRef, useEffect, useState, useMemo } from 'react';
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

const DEFAULT_LABEL_COLOR = '#6B7280'; // Gray-600
const AVERAGE_LABEL_WIDTH = 80; // Estimated pixels per label
const DOT_SIZE = 6; // size-1.5 equivalent (6px)
const DEFAULT_MAX_LABELS = 3;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Enriches string labels with color information from account labels
 */
function enrichLabels(
  labelTitles: string[],
  accountLabels?: ConversationLabel[]
): ConversationLabel[] {
  if (!accountLabels || accountLabels.length === 0) {
    return labelTitles.map((title) => ({
      title,
      color: DEFAULT_LABEL_COLOR,
    }));
  }

  return labelTitles.map((title) => {
    const accountLabel = accountLabels.find((al) => al.title === title);
    return accountLabel || { title, color: DEFAULT_LABEL_COLOR };
  });
}

/**
 * Determines if labels are already enriched ConversationLabel objects
 */
function isEnrichedLabels(
  labels: string[] | ConversationLabel[]
): labels is ConversationLabel[] {
  return labels.length > 0 && typeof labels[0] === 'object' && 'title' in labels[0];
}

/**
 * Calculates how many labels can fit within the available width
 */
function calculateVisibleLabels(
  labels: ConversationLabel[],
  containerWidth: number | null,
  maxLabels: number
): ConversationLabel[] {
  if (!containerWidth || labels.length === 0) {
    return labels.slice(0, maxLabels);
  }

  const maxVisible = Math.floor(containerWidth / AVERAGE_LABEL_WIDTH);
  const displayLimit = Math.min(maxLabels, maxVisible, labels.length);

  return labels.slice(0, displayLimit);
}

// ============================================================================
// Sub-Components
// ============================================================================

interface LabelDotProps {
  color: string;
}

const LabelDot: React.FC<LabelDotProps> = ({ color }) => (
  <Box
    sx={{
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

interface LabelTextProps {
  title: string;
  shouldTruncate: boolean;
  truncatedCount?: number;
}

const LabelText: React.FC<LabelTextProps> = ({ title, shouldTruncate, truncatedCount }) => (
  <Typography
    variant="caption"
    sx={{
      fontSize: '0.875rem',
      color: colorTokens.semantic.text.secondary,
      whiteSpace: 'nowrap',
      overflow: shouldTruncate ? 'hidden' : 'visible',
      textOverflow: shouldTruncate ? 'ellipsis' : 'clip',
      flexShrink: shouldTruncate ? 1 : 0,
    }}
  >
    {title}
    {shouldTruncate && truncatedCount && truncatedCount > 0 && ` +${truncatedCount}`}
  </Typography>
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * ConversationLabels Component
 *
 * Displays conversation labels with:
 * - Colored dots matching label colors
 * - Smart truncation based on available width
 * - Responsive resize handling
 * - Overflow indicator (+N)
 */
export const ConversationLabels: React.FC<ConversationLabelsProps> = ({
  labels,
  accountLabels,
  maxLabels = DEFAULT_MAX_LABELS,
  sx,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  // ========================================================================
  // Memoized Values
  // ========================================================================

  const enrichedLabels = useMemo<ConversationLabel[]>(() => {
    if (labels.length === 0) {
      return [];
    }

    return isEnrichedLabels(labels)
      ? labels
      : enrichLabels(labels, accountLabels);
  }, [labels, accountLabels]);

  const visibleLabels = useMemo(
    () => calculateVisibleLabels(enrichedLabels, containerWidth, maxLabels),
    [enrichedLabels, containerWidth, maxLabels]
  );

  const truncatedCount = useMemo(
    () => enrichedLabels.length - visibleLabels.length,
    [enrichedLabels.length, visibleLabels.length]
  );

  // ========================================================================
  // Effects
  // ========================================================================

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // ========================================================================
  // Render
  // ========================================================================

  if (enrichedLabels.length === 0) {
    return null;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        flexWrap: 'nowrap',
        minWidth: 0,
        ...sx,
      }}
    >
      {visibleLabels.map((label, index) => {
        const isLast = index === visibleLabels.length - 1;
        const shouldTruncate = isLast && truncatedCount > 0;

        return (
          <Box
            key={label.id || index}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              minWidth: 0,
              flexShrink: isLast ? 1 : 0,
            }}
          >
            <LabelDot color={label.color || DEFAULT_LABEL_COLOR} />
            <LabelText
              title={label.title}
              shouldTruncate={shouldTruncate}
              truncatedCount={truncatedCount}
            />
          </Box>
        );
      })}
    </Box>
  );
};
