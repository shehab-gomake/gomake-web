/**
 * Conversation Priority Icon Component
 *
 * Displays priority indicator with vertical bars following the design guide.
 * Visual representation uses color-coded bars to indicate urgency levels.
 *
 * @see CONVERSATION_LIST_ICONS_GUIDE.md
 */

import React, { useMemo } from 'react';
import { Box, type SxProps, type Theme } from '@mui/material';

// ============================================================================
// Type Definitions
// ============================================================================

export type ConversationPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface ConversationPriorityIconProps {
  priority: ConversationPriority | null | undefined;
  size?: number;
  sx?: SxProps<Theme>;
}

// ============================================================================
// Constants
// ============================================================================

const PRIORITY_CONFIG = {
  urgent: { bars: 3, color: '#EF4444' }, // Ruby/red
  high: { bars: 3, color: '#F59E0B' },   // Amber
  medium: { bars: 2, color: '#F59E0B' }, // Amber
  low: { bars: 1, color: '#F59E0B' },    // Amber
} as const;

const DEFAULT_SIZE = 12;
const BAR_WIDTH = 2;
const BAR_GAP = 1.5;
const TOTAL_BARS = 3;
const INACTIVE_BORDER_COLOR = '#D1D5DB'; // Gray-300

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets priority configuration (bar count and color) for a given priority level
 */
function getPriorityConfig(priority: ConversationPriority) {
  return PRIORITY_CONFIG[priority];
}

/**
 * Determines if a bar should be highlighted based on its index and priority
 */
function shouldHighlightBar(barIndex: number, barCount: number): boolean {
  return barIndex < barCount;
}

// ============================================================================
// Sub-Components
// ============================================================================

interface PriorityBarProps {
  isHighlighted: boolean;
  color: string;
  size: number;
}

const PriorityBar: React.FC<PriorityBarProps> = ({ isHighlighted, color, size }) => (
  <Box
    sx={{
      width: BAR_WIDTH,
      height: size,
      backgroundColor: isHighlighted ? color : 'transparent',
      border: `1px solid ${isHighlighted ? color : INACTIVE_BORDER_COLOR}`,
      borderRadius: '1px',
    }}
  />
);

// ============================================================================
// Main Component
// ============================================================================

/**
 * ConversationPriorityIcon Component
 *
 * Shows vertical bars indicating priority level:
 * - Low: 1 bar (amber)
 * - Medium: 2 bars (amber)
 * - High: 3 bars (amber)
 * - Urgent: 3 bars (ruby/red)
 *
 * Unhighlighted bars are shown with transparent background and gray border
 * to maintain consistent spacing and visual structure.
 */
export const ConversationPriorityIcon: React.FC<ConversationPriorityIconProps> = ({
  priority,
  size = DEFAULT_SIZE,
  sx,
}) => {
  // ========================================================================
  // Memoized Values
  // ========================================================================

  const config = useMemo(
    () => (priority ? getPriorityConfig(priority) : null),
    [priority]
  );

  const bars = useMemo(
    () =>
      Array.from({ length: TOTAL_BARS }, (_, index) => ({
        key: index,
        isHighlighted: config ? shouldHighlightBar(index, config.bars) : false,
      })),
    [config]
  );

  // ========================================================================
  // Early Return
  // ========================================================================

  if (!priority || !config) {
    return null;
  }

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${BAR_GAP}px`,
        ...sx,
      }}
      aria-label={`Priority: ${priority}`}
      role="img"
    >
      {bars.map(({ key, isHighlighted }) => (
        <PriorityBar
          key={key}
          isHighlighted={isHighlighted}
          color={config.color}
          size={size}
        />
      ))}
    </Box>
  );
};
