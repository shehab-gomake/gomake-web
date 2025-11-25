/**
 * LabelSelect Component
 *
 * Multi-select label component with unified filter trigger.
 * Supports both filter and management use cases.
 *
 * @module unified-list/selects/LabelSelect
 */

import React, { useState, useCallback, useMemo } from 'react';
import LabelIcon from '@mui/icons-material/Label';
import AddIcon from '@mui/icons-material/Add';
import { UnifiedListDropdown } from '../UnifiedListDropdown';
import { LabelListItemRenderer } from '../list-items';
import { FilterIconButton } from '../triggers';
import type { LabelListItem, ActionItem } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface Label {
  id: number;
  title: string;
  color: string;
  description?: string;
  show_on_sidebar?: boolean;
}

export interface LabelSelectProps {
  /** Currently selected label titles */
  selectedLabels: string[];
  /** Available labels */
  labels: Label[];
  /** Selection handler */
  onSelect: (labelTitles: string[], labels: Label[]) => void;
  /** Whether labels are loading */
  loading?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Empty state text */
  emptyText?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Only show sidebar labels */
  sidebarOnly?: boolean;
  /** Can create new label */
  canCreate?: boolean;
  /** Create label handler */
  onCreateClick?: () => void;
  /** Header text */
  headerText?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

const labelToListItem = (label: Label): LabelListItem => ({
  type: 'label',
  id: label.id,
  label: label.title,
  description: label.description,
  color: label.color,
  showOnSidebar: label.show_on_sidebar,
});

// =============================================================================
// COMPONENT
// =============================================================================

export const LabelSelect: React.FC<LabelSelectProps> = ({
  selectedLabels,
  labels,
  onSelect,
  loading = false,
  placeholder = 'Filter by Labels',
  emptyText = 'No labels available',
  disabled = false,
  sidebarOnly = true,
  canCreate = false,
  onCreateClick,
  headerText = 'Filter by Labels (AND)',
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // Filter labels (sidebar only if specified)
  const filteredLabels = useMemo(() => {
    if (sidebarOnly) {
      return labels.filter((label) => label.show_on_sidebar === true);
    }
    return labels;
  }, [labels, sidebarOnly]);

  // Convert labels to list items
  const labelItems = useMemo(
    () => filteredLabels.map(labelToListItem),
    [filteredLabels]
  );

  // Footer actions
  const footerActions = useMemo<ActionItem[]>(() => {
    const actions: ActionItem[] = [];

    // Clear all action
    if (selectedLabels.length > 0) {
      actions.push({
        type: 'action',
        id: 'clear-all',
        label: 'Clear All Labels',
        variant: 'secondary',
        onClick: () => onSelect([], []),
      });
    }

    // Create new label
    if (canCreate && onCreateClick) {
      actions.push({
        type: 'action',
        id: 'create-label',
        label: 'Add New Label',
        icon: <AddIcon sx={{ fontSize: 18 }} />,
        variant: 'primary',
        onClick: onCreateClick,
      });
    }

    return actions;
  }, [selectedLabels.length, canCreate, onCreateClick, onSelect]);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMultiSelect = useCallback(
    (values: Array<string | number>) => {
      const selectedTitles = values
        .map((id) => {
          const label = labels.find((l) => l.id === id);
          return label?.title;
        })
        .filter((title): title is string => !!title);

      const selectedLabelObjects = labels.filter((l) =>
        selectedTitles.includes(l.title)
      );

      onSelect(selectedTitles, selectedLabelObjects);
    },
    [labels, onSelect]
  );

  // Convert selected titles to IDs
  const selectedIds = useMemo(
    () =>
      selectedLabels
        .map((title) => {
          const label = labels.find((l) => l.title === title);
          return label?.id;
        })
        .filter((id): id is number => id !== undefined),
    [selectedLabels, labels]
  );

  const renderItem = useCallback(
    (item: LabelListItem, isSelected: boolean, onClick: () => void) => (
      <LabelListItemRenderer
        item={item}
        isSelected={isSelected}
        onClick={onClick}
        showCheckbox
      />
    ),
    []
  );

  const hasSelection = selectedLabels.length > 0;

  return (
    <>
      <FilterIconButton
        icon={<LabelIcon />}
        tooltip={hasSelection ? `Labels: ${selectedLabels.join(', ')}` : placeholder}
        isActive={hasSelection}
        badgeCount={selectedLabels.length}
        onClick={handleOpen}
        disabled={disabled || loading}
      />

      <UnifiedListDropdown
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        items={labelItems}
        selectionMode="multiple"
        selectedValues={selectedIds}
        onMultiSelect={handleMultiSelect}
        renderItem={renderItem}
        headerText={headerText}
        footerActions={footerActions}
        loading={loading}
        emptyMessage={
          sidebarOnly && labels.length > 0
            ? 'No labels with sidebar enabled'
            : emptyText
        }
        closeOnSelect={false}
      />
    </>
  );
};

export default LabelSelect;
