/**
 * QuickSelectorTrigger Component
 *
 * Unified pill-style trigger for quick selectors (Status/Priority).
 * Used in conversation header.
 *
 * @module unified-list/triggers/QuickSelectorTrigger
 */

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { quickSelectorStyles, getQuickSelectorPillSx } from '../styles';
import { colorTokens } from '@/widgets/frontdesk/design-system';

export interface QuickSelectorTriggerProps {
  /** Icon to display */
  icon: React.ReactNode;
  /** Current value label */
  label: string;
  /** Tooltip text */
  tooltip?: string;
  /** Click handler */
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

export const QuickSelectorTrigger: React.FC<QuickSelectorTriggerProps> = ({
  icon,
  label,
  tooltip,
  onClick,
  loading = false,
  disabled = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Box
      onClick={isDisabled ? undefined : onClick}
      sx={getQuickSelectorPillSx(isDisabled)}
      title={tooltip || (loading ? 'Updating...' : `Change ${label.toLowerCase()}`)}
    >
      {loading ? (
        <CircularProgress size={quickSelectorStyles.iconSize} sx={{ color: colorTokens.neutral[600] }} />
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ sx?: object }>, {
                sx: { fontSize: quickSelectorStyles.iconSize, ...(icon.props as { sx?: object }).sx },
              })
            : icon}
        </Box>
      )}
      <Typography sx={quickSelectorStyles.label}>
        {loading ? 'Updating...' : label}
      </Typography>
    </Box>
  );
};

export default QuickSelectorTrigger;

