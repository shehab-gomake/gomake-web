/**
 * FilterIconButton Component
 *
 * Unified icon button trigger for filter dropdowns.
 * Used in conversation list toolbar for Teams, Labels, Sort, etc.
 *
 * @module unified-list/triggers/FilterIconButton
 */

import React from 'react';
import { IconButton, Tooltip, Badge } from '@mui/material';
import { filterStyles, getFilterIconButtonSx } from '../styles';

export interface FilterIconButtonProps {
  /** Icon to display */
  icon: React.ReactNode;
  /** Tooltip text */
  tooltip: string;
  /** Whether filter is active (has selection) */
  isActive?: boolean;
  /** Badge count (for multi-select filters) */
  badgeCount?: number;
  /** Click handler */
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom icon size */
  iconSize?: number;
}

export const FilterIconButton: React.FC<FilterIconButtonProps> = ({
  icon,
  tooltip,
  isActive = false,
  badgeCount = 0,
  onClick,
  disabled = false,
  iconSize = filterStyles.iconSize,
}) => {
  const showBadge = badgeCount > 0 || (isActive && badgeCount === 0);

  return (
    <Tooltip title={tooltip}>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={getFilterIconButtonSx(isActive)}
      >
        <Badge
          badgeContent={badgeCount || (isActive ? 1 : 0)}
          color="primary"
          invisible={!showBadge}
          sx={filterStyles.badge}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ sx?: object }>, {
                sx: { fontSize: iconSize, ...(icon.props as { sx?: object }).sx },
              })
            : icon}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default FilterIconButton;

