/**
 * PrioritySelect Component
 *
 * Priority selection component with unified pill trigger.
 * Used for changing conversation priority.
 *
 * @module unified-list/selects/PrioritySelect
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FlagIcon from '@mui/icons-material/Flag';
import { UnifiedListDropdown } from '../UnifiedListDropdown';
import { PriorityListItemRenderer } from '../list-items';
import { QuickSelectorTrigger } from '../triggers';
import { priorityColors } from '../styles';
import type { PriorityListItem } from '../types';
import { ConversationPriority } from '@/services/frontdesk/api/chatwoot/types/conversations.types';

// =============================================================================
// TYPES
// =============================================================================

type PriorityValue =
  | typeof ConversationPriority.URGENT
  | typeof ConversationPriority.HIGH
  | typeof ConversationPriority.MEDIUM
  | typeof ConversationPriority.LOW
  | null;

export interface PrioritySelectProps {
  /** Current priority value */
  priority: PriorityValue;
  /** Priority change handler */
  onPriorityChange: (priority: PriorityValue) => void;
  /** Whether update is in progress */
  updating?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const getDefaultPriorities = (t: (key: string) => string): PriorityListItem[] => [
  {
    type: 'priority',
    id: ConversationPriority.URGENT,
    label: t('frontdesk.detailPanel.priorityUrgent'),
    value: ConversationPriority.URGENT,
    level: 'urgent',
    color: priorityColors.urgent,
  },
  {
    type: 'priority',
    id: ConversationPriority.HIGH,
    label: t('frontdesk.detailPanel.priorityHigh'),
    value: ConversationPriority.HIGH,
    level: 'high',
    color: priorityColors.high,
  },
  {
    type: 'priority',
    id: ConversationPriority.MEDIUM,
    label: t('frontdesk.detailPanel.priorityMedium'),
    value: ConversationPriority.MEDIUM,
    level: 'medium',
    color: priorityColors.medium,
  },
  {
    type: 'priority',
    id: ConversationPriority.LOW,
    label: t('frontdesk.detailPanel.priorityLow'),
    value: ConversationPriority.LOW,
    level: 'low',
    color: priorityColors.low,
  },
  {
    type: 'priority',
    id: 'none',
    label: t('frontdesk.detailPanel.priorityNone'),
    value: null,
    level: 'none',
    color: priorityColors.none,
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const PrioritySelect: React.FC<PrioritySelectProps> = ({
  priority,
  onPriorityChange,
  updating = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const defaultPriorities = useMemo(() => getDefaultPriorities(t), [t]);
  
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const currentPriority = useMemo(
    () =>
      defaultPriorities.find((p) => p.value === priority) ||
      defaultPriorities[defaultPriorities.length - 1],
    [priority, defaultPriorities]
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
      const selectedPriority = defaultPriorities.find((p) => p.id === id);
      if (selectedPriority) {
        onPriorityChange(selectedPriority.value as PriorityValue);
      }
      handleClose();
    },
    [defaultPriorities, onPriorityChange, handleClose]
  );

  const renderItem = useCallback(
    (item: PriorityListItem, isSelected: boolean, onClick: () => void) => (
      <PriorityListItemRenderer
        item={item}
        isSelected={isSelected}
        onClick={onClick}
      />
    ),
    []
  );

  // Flag icon with priority color
  const priorityIcon = (
    <FlagIcon sx={{ color: currentPriority.color }} />
  );

  return (
    <>
      <QuickSelectorTrigger
        icon={priorityIcon}
        label={currentPriority.label}
        tooltip={t("frontdesk.detailPanel.changePriorityTooltip", { priority: currentPriority.label })}
        onClick={handleOpen}
        loading={updating}
        disabled={disabled}
      />

      <UnifiedListDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        items={defaultPriorities}
        selectionMode="single"
        selectedValue={priority ?? 'none'}
        onSelect={handleSelect}
        renderItem={renderItem}
        minWidth={160}
        maxWidth={200}
      />
    </>
  );
};

export default PrioritySelect;
