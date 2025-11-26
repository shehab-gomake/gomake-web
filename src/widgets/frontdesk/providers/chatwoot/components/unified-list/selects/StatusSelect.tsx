/**
 * StatusSelect Component
 *
 * Status selection component with unified pill trigger.
 * Used for changing conversation status.
 *
 * @module unified-list/selects/StatusSelect
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  OpenInNew as OpenIcon,
  Pending as PendingIcon,
  Snooze as SnoozeIcon,
  CheckCircle as ResolvedIcon,
} from '@mui/icons-material';
import { UnifiedListDropdown } from '../UnifiedListDropdown';
import { StatusListItemRenderer } from '../list-items';
import { QuickSelectorTrigger } from '../triggers';
import { statusColors } from '../styles';
import type { StatusListItem } from '../types';
import { ConversationStatus } from '@/services/frontdesk/api/chatwoot/types/conversations.types';

// =============================================================================
// TYPES
// =============================================================================

export interface StatusSelectProps {
  /** Current status value */
  status: string;
  /** Status change handler */
  onStatusChange: (status: string) => void;
  /** Whether update is in progress */
  updating?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Available statuses (defaults to standard set) */
  statuses?: StatusListItem[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_ICONS: Record<string, React.ReactNode> = {
  [ConversationStatus.OPEN]: <OpenIcon sx={{ fontSize: 16 }} />,
  [ConversationStatus.PENDING]: <PendingIcon sx={{ fontSize: 16 }} />,
  [ConversationStatus.SNOOZED]: <SnoozeIcon sx={{ fontSize: 16 }} />,
  [ConversationStatus.RESOLVED]: <ResolvedIcon sx={{ fontSize: 16 }} />,
};

const DEFAULT_STATUSES: StatusListItem[] = [
  {
    type: 'status',
    id: ConversationStatus.OPEN,
    label: 'Open',
    value: ConversationStatus.OPEN,
    icon: STATUS_ICONS[ConversationStatus.OPEN],
    color: statusColors.open,
  },
  {
    type: 'status',
    id: ConversationStatus.PENDING,
    label: 'Pending',
    value: ConversationStatus.PENDING,
    icon: STATUS_ICONS[ConversationStatus.PENDING],
    color: statusColors.pending,
  },
  {
    type: 'status',
    id: ConversationStatus.RESOLVED,
    label: 'Resolved',
    value: ConversationStatus.RESOLVED,
    icon: STATUS_ICONS[ConversationStatus.RESOLVED],
    color: statusColors.resolved,
  },
  {
    type: 'status',
    id: ConversationStatus.SNOOZED,
    label: 'Snoozed',
    value: ConversationStatus.SNOOZED,
    icon: STATUS_ICONS[ConversationStatus.SNOOZED],
    color: statusColors.snoozed,
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const StatusSelect: React.FC<StatusSelectProps> = ({
  status,
  onStatusChange,
  updating = false,
  disabled = false,
  statuses = DEFAULT_STATUSES,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const currentStatus = useMemo(
    () => statuses.find((s) => s.value === status) || statuses[0],
    [status, statuses]
  );

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !updating) {
      setAnchorEl(event.currentTarget);
    }
  }, [disabled, updating]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelect = useCallback(
    (id: string | number | null) => {
      if (id !== null) {
        const selectedStatus = statuses.find((s) => s.id === id);
        if (selectedStatus) {
          onStatusChange(selectedStatus.value);
        }
      }
      handleClose();
    },
    [statuses, onStatusChange, handleClose]
  );

  const renderItem = useCallback(
    (item: StatusListItem, isSelected: boolean, onClick: () => void) => (
      <StatusListItemRenderer
        item={item}
        isSelected={isSelected}
        onClick={onClick}
      />
    ),
    []
  );

  // Get icon with color
  const statusIcon = React.cloneElement(
    (currentStatus.icon || STATUS_ICONS[status] || <OpenIcon />) as React.ReactElement,
    { sx: { color: currentStatus.color || statusColors.open } }
  );

  return (
    <>
      <QuickSelectorTrigger
        icon={statusIcon}
        label={currentStatus.label}
        tooltip={`Change status (currently: ${currentStatus.label})`}
        onClick={handleOpen}
        loading={updating}
        disabled={disabled}
      />

      <UnifiedListDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        items={statuses}
        selectionMode="single"
        selectedValue={status}
        onSelect={handleSelect}
        renderItem={renderItem}
        minWidth={160}
        maxWidth={200}
      />
    </>
  );
};

export default StatusSelect;
