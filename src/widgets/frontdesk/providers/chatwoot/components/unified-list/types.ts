/**
 * Unified List System - Type Definitions
 *
 * Production-ready type system for all list/dropdown components in FrontDesk Chatwoot.
 * Provides consistent interfaces across agents, teams, labels, statuses, priorities, etc.
 *
 * @module unified-list/types
 */

import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

// =============================================================================
// BASE ITEM INTERFACES
// =============================================================================

/**
 * Base interface for all list items
 */
export interface BaseListItem {
  /** Unique identifier */
  id: string | number;
  /** Display name/label */
  label: string;
  /** Optional secondary text */
  description?: string;
  /** Whether item is disabled */
  disabled?: boolean;
}

/**
 * Item with availability status (agents)
 */
export interface ListItemWithAvailability extends BaseListItem {
  availability?: 'online' | 'busy' | 'offline' | 'away';
}

/**
 * Item with color (labels, priorities)
 */
export interface ListItemWithColor extends BaseListItem {
  color: string;
}

/**
 * Item with icon
 */
export interface ListItemWithIcon extends BaseListItem {
  icon?: ReactNode;
}

/**
 * Item with avatar (agents, contacts)
 */
export interface ListItemWithAvatar extends BaseListItem {
  avatarUrl?: string;
  avatarFallback?: string;
}

// =============================================================================
// SPECIALIZED ITEM TYPES
// =============================================================================

/**
 * Agent list item
 */
export interface AgentListItem extends ListItemWithAvailability, ListItemWithAvatar {
  type: 'agent';
  email?: string;
  role?: string;
  /** Whether this is the current user */
  isCurrentUser?: boolean;
}

/**
 * Team list item
 */
export interface TeamListItem extends BaseListItem {
  type: 'team';
  memberCount?: number;
  allowAutoAssign?: boolean;
}

/**
 * Label list item
 */
export interface LabelListItem extends ListItemWithColor {
  type: 'label';
  showOnSidebar?: boolean;
}

/**
 * Status list item
 */
export interface StatusListItem extends ListItemWithIcon, ListItemWithColor {
  type: 'status';
  value: string;
}

/**
 * Priority list item
 */
export interface PriorityListItem extends ListItemWithColor {
  type: 'priority';
  value: string | null;
  level: 'urgent' | 'high' | 'medium' | 'low' | 'none';
}

/**
 * Sort option item
 */
export interface SortListItem extends ListItemWithIcon {
  type: 'sort';
  value: string;
  direction?: 'asc' | 'desc';
}

/**
 * Inbox/Channel list item
 */
export interface InboxListItem extends ListItemWithIcon {
  type: 'inbox';
  channelType: string;
  isEnabled?: boolean;
}

/**
 * Generic option item for simple lists
 */
export interface GenericListItem extends BaseListItem, ListItemWithIcon {
  type: 'generic';
  value?: string | number | null;
  /** Optional color (from ListItemWithColor) */
  color?: string;
}

/**
 * Divider item for menu separators
 */
export interface DividerItem {
  type: 'divider';
  id: string;
}

/**
 * Action item (like "Add new", "Clear all")
 */
export interface ActionItem {
  type: 'action';
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

/**
 * Union of all list item types
 */
export type UnifiedListItem =
  | AgentListItem
  | TeamListItem
  | LabelListItem
  | StatusListItem
  | PriorityListItem
  | SortListItem
  | InboxListItem
  | GenericListItem
  | DividerItem
  | ActionItem;

// =============================================================================
// SELECTION TYPES
// =============================================================================

/**
 * Selection mode for list dropdown
 */
export type SelectionMode = 'single' | 'multiple' | 'none';

/**
 * Selected value(s) type
 */
export type SelectedValue<T extends SelectionMode> = T extends 'multiple'
  ? Array<string | number>
  : T extends 'single'
  ? string | number | null
  : never;

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Base props for unified list dropdown
 */
export interface UnifiedListDropdownBaseProps {
  /** Menu anchor position */
  anchorOrigin?: {
    vertical: 'top' | 'bottom' | 'center';
    horizontal: 'left' | 'right' | 'center';
  };
  transformOrigin?: {
    vertical: 'top' | 'bottom' | 'center';
    horizontal: 'left' | 'right' | 'center';
  };
  /** Menu paper styling */
  menuSx?: SxProps<Theme>;
  /** Min/max dimensions */
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Searchable */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Header text */
  headerText?: string;
  /** Footer actions */
  footerActions?: ActionItem[];
  /** Whether to close on select (default: true for single, false for multiple) */
  closeOnSelect?: boolean;
  /** Custom styling */
  sx?: SxProps<Theme>;
}

/**
 * Props for single selection dropdown
 */
export interface SingleSelectDropdownProps<T extends BaseListItem> extends UnifiedListDropdownBaseProps {
  selectionMode: 'single';
  items: T[];
  selectedValue: string | number | null;
  onChange: (value: string | number | null, item: T | null) => void;
  /** Show "None" option for deselection */
  showNoneOption?: boolean;
  noneOptionLabel?: string;
}

/**
 * Props for multiple selection dropdown
 */
export interface MultiSelectDropdownProps<T extends BaseListItem> extends UnifiedListDropdownBaseProps {
  selectionMode: 'multiple';
  items: T[];
  selectedValues: Array<string | number>;
  onChange: (values: Array<string | number>, items: T[]) => void;
  /** Show "Select All" option */
  showSelectAll?: boolean;
  /** Show "Clear All" action */
  showClearAll?: boolean;
}

/**
 * Combined props type
 */
export type UnifiedListDropdownProps<T extends BaseListItem> =
  | SingleSelectDropdownProps<T>
  | MultiSelectDropdownProps<T>;

// =============================================================================
// TRIGGER BUTTON VARIANTS
// =============================================================================

/**
 * Trigger button variants
 */
export type TriggerVariant = 
  | 'icon-button'      // Just an icon button (for toolbars)
  | 'chip'             // Pill-shaped compact trigger
  | 'button'           // Standard button with label
  | 'inline'           // Inline clickable area (for detail panels)
  | 'custom';          // Custom trigger element

/**
 * Props for trigger button
 */
export interface ListTriggerProps {
  variant: TriggerVariant;
  label?: string;
  icon?: ReactNode;
  /** Show badge with count */
  badgeCount?: number;
  /** Whether dropdown is open */
  isOpen?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  /** Tooltip text */
  tooltip?: string;
  sx?: SxProps<Theme>;
}

// =============================================================================
// LIST ITEM RENDER PROPS
// =============================================================================

/**
 * Render props for list items
 */
export interface ListItemRenderProps<T extends BaseListItem> {
  item: T;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

/**
 * Custom render function type
 */
export type CustomItemRenderer<T extends BaseListItem> = (props: ListItemRenderProps<T>) => ReactNode;

// =============================================================================
// AVAILABILITY STATUS
// =============================================================================

export const AVAILABILITY_STATUS_COLORS = {
  online: '#22c55e',  // green-500
  busy: '#f59e0b',    // amber-500
  away: '#eab308',    // yellow-500
  offline: '#6b7280', // gray-500
} as const;

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Extract item type from list item union
 */
export type ExtractItemType<T extends UnifiedListItem> = T extends { type: infer U } ? U : never;

/**
 * Filter list items by type
 */
export type FilterByType<T extends UnifiedListItem, Type extends ExtractItemType<T>> = 
  T extends { type: Type } ? T : never;

