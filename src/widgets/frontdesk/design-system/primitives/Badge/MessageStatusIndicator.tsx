import React from 'react';
import { Box, Tooltip, CircularProgress } from '@mui/material';
import { colorTokens } from '../../tokens';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageStatusIndicatorProps {
  /** Message delivery/read status */
  status: MessageStatus;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md';
  /** Show label alongside icon */
  showLabel?: boolean;
}

const statusConfig = {
  pending: {
    icon: ScheduleIcon,
    label: 'Sending',
    color: colorTokens.neutral[500],
    tooltip: 'Message is being sent',
  },
  sent: {
    icon: CheckIcon,
    label: 'Sent',
    color: colorTokens.neutral[600],
    tooltip: 'Message sent',
  },
  delivered: {
    icon: DoneAllIcon,
    label: 'Delivered',
    color: colorTokens.neutral[600],
    tooltip: 'Message delivered',
  },
  read: {
    icon: DoneAllIcon,
    label: 'Read',
    color: colorTokens.primary[600],
    tooltip: 'Message read',
  },
  failed: {
    icon: ErrorOutlineIcon,
    label: 'Failed',
    color: colorTokens.error[600],
    tooltip: 'Failed to send',
  },
} as const;

const sizeMap = {
  xs: 12,
  sm: 14,
  md: 16,
} as const;

/**
 * MessageStatusIndicator Component
 *
 * Displays message delivery and read status with appropriate icons.
 * Supports pending (sending), sent, delivered, read, and failed states.
 */
export const MessageStatusIndicator: React.FC<MessageStatusIndicatorProps> = ({
  status,
  size = 'sm',
  showLabel = false,
}) => {
  const config = statusConfig[status];
  const iconSize = sizeMap[size];

  const renderIcon = () => {
    if (status === 'pending') {
      return (
        <CircularProgress
          size={iconSize}
          sx={{ color: config.color }}
          thickness={5}
        />
      );
    }

    const IconComponent = config.icon;
    return <IconComponent sx={{ fontSize: iconSize, color: config.color }} />;
  };

  const content = (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: showLabel ? 0.5 : 0,
        color: config.color,
        fontSize: iconSize - 2,
        fontWeight: 500,
      }}
    >
      {renderIcon()}
      {showLabel && (
        <span style={{ fontSize: iconSize - 2 }}>{config.label}</span>
      )}
    </Box>
  );

  return (
    <Tooltip title={config.tooltip} arrow placement="top">
      {content}
    </Tooltip>
  );
};