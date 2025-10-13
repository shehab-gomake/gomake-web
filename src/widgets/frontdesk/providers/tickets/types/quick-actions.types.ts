/**
 * Quick Actions Type Definitions
 *
 * Defines action types and configurations for ticket quick actions
 * that navigate to GoMake document creation pages
 */

import { ReactNode } from 'react';
import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';

/**
 * Available quick action types
 */
export type QuickActionType =
  // Sales Documents
  | 'create_quote'
  | 'create_invoice'
  | 'create_order'
  | 'create_receipt'
  | 'create_delivery_note'

  // Purchase Documents
  | 'create_purchase_order'
  | 'create_purchase_invoice'

  // Ticket Actions
  | 'edit_ticket'
  | 'print_ticket'
  | 'archive_ticket'

  // Other Actions
  | 'export_conversation';

/**
 * Action groups for menu organization
 */
export type QuickActionGroup = 'sales' | 'purchase' | 'ticket' | 'other';

/**
 * Configuration for a single quick action
 */
export interface QuickActionConfig {
  /** Unique action type identifier */
  type: QuickActionType;

  /** Display label (will be translated) */
  label: string;

  /** Icon component to display */
  icon: ReactNode;

  /** Target route path */
  route: string;

  /** Document type (for GoMake document pages) */
  documentType?: DOCUMENT_TYPE;

  /** Whether this action requires a customer ID */
  requiresCustomerId: boolean;

  /** Action group for menu organization */
  group: QuickActionGroup;

  /** Optional tooltip text */
  tooltip?: string;

  /** Whether this action is enabled (can be used for feature flags) */
  enabled?: boolean;
}

/**
 * Props for QuickActionButton component
 */
export interface QuickActionButtonProps {
  /** Ticket ID for context */
  ticketId: string;

  /** Customer ID (may be null) */
  customerId?: string | null;

  /** Customer name */
  customerName?: string | null;

  /** Customer email */
  customerEmail?: string | null;

  /** Customer phone */
  customerPhone?: string | null;

  /** Whether the button is disabled */
  disabled?: boolean;

  /** Custom actions to show (defaults to all available) */
  availableActions?: QuickActionType[];

  /** Callback when an action is selected */
  onActionSelect?: (action: QuickActionType) => void;

  /** Callback when an action completes */
  onActionComplete?: (action: QuickActionType) => void;
}

/**
 * Props for QuickActionMenu component
 */
export interface QuickActionMenuProps {
  /** Menu anchor element */
  anchorEl: HTMLElement | null;

  /** Whether menu is open */
  open: boolean;

  /** Close handler */
  onClose: () => void;

  /** Available actions to display */
  actions: QuickActionConfig[];

  /** Handler when action is selected */
  onActionClick: (action: QuickActionConfig) => void;

  /** Whether any actions are loading */
  loading?: boolean;
}

/**
 * Return type for useQuickActions hook
 */
export interface UseQuickActionsResult {
  /** Available actions for this ticket */
  availableActions: QuickActionConfig[];

  /** Whether customer is linked */
  hasCustomer: boolean;

  /** Execute a quick action */
  executeAction: (actionType: QuickActionType) => void;

  /** Check if action can be executed */
  canExecuteAction: (actionType: QuickActionType) => boolean;

  /** Get reason why action cannot be executed */
  getActionBlockReason: (actionType: QuickActionType) => string | null;
}
