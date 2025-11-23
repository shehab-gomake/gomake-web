/**
 * Conversation SLA Label Component
 *
 * Displays SLA status with clock icon and threshold information.
 * Auto-refreshes every 60 seconds to keep timing accurate.
 *
 * @see CONVERSATION_LIST_ICONS_GUIDE.md
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Tooltip, type SxProps, type Theme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// ============================================================================
// Type Definitions
// ============================================================================

export type SLAType = 'FIRST_RESPONSE_TIME' | 'NEXT_RESPONSE_TIME' | 'RESOLUTION_TIME';

export interface AppliedSLA {
  id?: number | string;
  firstResponseThreshold?: number; // in seconds
  nextResponseThreshold?: number; // in seconds
  resolutionThreshold?: number; // in seconds
  [key: string]: any;
}

export interface ConversationSLALabelProps {
  appliedSla?: AppliedSLA | null;
  conversationTimestamp?: string | number | null;
  lastActivityAt?: string | number | null;
  slaType?: SLAType;
  refreshInterval?: number; // in milliseconds
  sx?: SxProps<Theme>;
}

interface SLAStatus {
  isMissed: boolean;
  threshold: number;
  timeRemaining?: number;
}

// ============================================================================
// Constants
// ============================================================================

const REFRESH_INTERVAL = 60000; // 60 seconds
const ICON_SIZE = 13;
const MISSED_ICON_COLOR = '#EF4444'; // Ruby/red
const ACTIVE_ICON_COLOR = '#6B7280'; // Gray-600
const MISSED_TEXT_COLOR = '#DC2626'; // Ruby-700
const ACTIVE_TEXT_COLOR = '#6B7280'; // Gray-600

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Converts Unix timestamp (seconds) to milliseconds
 */
function toMilliseconds(timestamp: number): number {
  return timestamp * 1000;
}

/**
 * Parses timestamp value (Unix or ISO string) to milliseconds
 */
function parseTimestamp(timestamp: string | number): number {
  if (typeof timestamp === 'number') {
    return toMilliseconds(timestamp);
  }
  return new Date(timestamp).getTime();
}

/**
 * Gets the threshold value for a specific SLA type
 */
function getThresholdForType(sla: AppliedSLA, slaType: SLAType): number {
  switch (slaType) {
    case 'FIRST_RESPONSE_TIME':
      return sla.firstResponseThreshold || 0;
    case 'NEXT_RESPONSE_TIME':
      return sla.nextResponseThreshold || 0;
    case 'RESOLUTION_TIME':
      return sla.resolutionThreshold || 0;
    default:
      return 0;
  }
}

/**
 * Evaluates SLA status based on threshold and timestamps
 */
function evaluateSLAStatus(
  sla: AppliedSLA,
  slaType: SLAType,
  timestamp?: string | number | null,
  _lastActivityAt?: string | number | null
): SLAStatus {
  if (!sla || !timestamp) {
    return { isMissed: false, threshold: 0 };
  }

  const now = Date.now();
  const conversationTime = parseTimestamp(timestamp);
  const thresholdSeconds = getThresholdForType(sla, slaType);
  const thresholdMs = toMilliseconds(thresholdSeconds);

  const elapsed = now - conversationTime;
  const isMissed = elapsed > thresholdMs;

  return {
    isMissed,
    threshold: thresholdSeconds,
    timeRemaining: isMissed ? undefined : (thresholdMs - elapsed) / 1000,
  };
}

/**
 * Formats threshold time for display (e.g., "5m", "2h", "3d")
 */
function formatThreshold(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  }
  if (seconds < 86400) {
    return `${Math.round(seconds / 3600)}h`;
  }
  return `${Math.round(seconds / 86400)}d`;
}

/**
 * Formats SLA type for display (e.g., "First Response Time")
 */
function formatSLAType(slaType: SLAType): string {
  return slaType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generates tooltip message based on SLA status
 */
function getTooltipMessage(slaTypeLabel: string, thresholdText: string, isMissed: boolean): string {
  return isMissed
    ? `SLA missed: ${slaTypeLabel} exceeded ${thresholdText}`
    : `SLA: ${slaTypeLabel} (${thresholdText} remaining)`;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * ConversationSLALabel Component
 *
 * Displays SLA status with:
 * - Clock icon (colored based on SLA status)
 * - SLA type label
 * - Threshold time
 * - Auto-refresh every 60 seconds
 * - Tooltip with detailed information
 */
export const ConversationSLALabel: React.FC<ConversationSLALabelProps> = ({
  appliedSla,
  conversationTimestamp,
  lastActivityAt,
  slaType = 'FIRST_RESPONSE_TIME',
  refreshInterval = REFRESH_INTERVAL,
  sx,
}) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  // ========================================================================
  // Memoized Values
  // ========================================================================

  const slaStatus = useMemo<SLAStatus>(
    () =>
      evaluateSLAStatus(
        appliedSla as AppliedSLA,
        slaType,
        conversationTimestamp,
        lastActivityAt
      ),
    [appliedSla, slaType, conversationTimestamp, lastActivityAt, currentTime] // Include currentTime for refresh
  );

  const displayData = useMemo(() => {
    if (!slaStatus.threshold) {
      return null;
    }

    const slaTypeLabel = formatSLAType(slaType);
    const thresholdText = formatThreshold(slaStatus.threshold);

    return {
      iconColor: slaStatus.isMissed ? MISSED_ICON_COLOR : ACTIVE_ICON_COLOR,
      textColor: slaStatus.isMissed ? MISSED_TEXT_COLOR : ACTIVE_TEXT_COLOR,
      label: `${slaTypeLabel}: ${thresholdText}`,
      tooltip: getTooltipMessage(slaTypeLabel, thresholdText, slaStatus.isMissed),
    };
  }, [slaStatus, slaType]);

  // ========================================================================
  // Effects
  // ========================================================================

  useEffect(() => {
    if (!appliedSla?.id || !conversationTimestamp) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [appliedSla?.id, conversationTimestamp, refreshInterval]);

  // ========================================================================
  // Early Return
  // ========================================================================

  if (!appliedSla?.id || !conversationTimestamp || !displayData) {
    return null;
  }

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <Tooltip title={displayData.tooltip} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          minWidth: 'fit-content',
          height: 24,
          ...sx,
        }}
      >
        <AccessTimeIcon
          sx={{
            fontSize: ICON_SIZE,
            color: displayData.iconColor,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            color: displayData.textColor,
            whiteSpace: 'nowrap',
          }}
        >
          {displayData.label}
        </Typography>
      </Box>
    </Tooltip>
  );
};



