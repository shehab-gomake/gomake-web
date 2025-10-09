/**
 * Quick Actions Configuration
 *
 * Defines all available quick actions with their properties
 */

import { DOCUMENT_TYPE } from '@/pages-components/quotes/enums';
import { QuickActionConfig, QuickActionType } from '../types/quick-actions.types';

// Icon imports - using Material UI icons for now
// TODO: Replace with GoMake custom icons if available
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

/**
 * All available quick actions
 */
export const QUICK_ACTIONS_CONFIG: Record<QuickActionType, QuickActionConfig> = {
  // Sales Documents
  create_quote: {
    type: 'create_quote',
    label: 'Create Quote',
    icon: <DescriptionOutlinedIcon fontSize="small" />,
    route: '/quote',
    documentType: DOCUMENT_TYPE.quote,
    requiresCustomerId: true,
    group: 'sales',
    tooltip: 'Create a new quote for this customer',
    enabled: true,
  },

  create_invoice: {
    type: 'create_invoice',
    label: 'Create Invoice',
    icon: <ReceiptOutlinedIcon fontSize="small" />,
    route: '/invoice',
    documentType: DOCUMENT_TYPE.invoice,
    requiresCustomerId: true,
    group: 'sales',
    tooltip: 'Create a new invoice for this customer',
    enabled: true,
  },

  create_order: {
    type: 'create_order',
    label: 'Create Order',
    icon: <ShoppingCartOutlinedIcon fontSize="small" />,
    route: '/order',
    documentType: DOCUMENT_TYPE.order,
    requiresCustomerId: true,
    group: 'sales',
    tooltip: 'Create a new order for this customer',
    enabled: true,
  },

  create_receipt: {
    type: 'create_receipt',
    label: 'Create Receipt',
    icon: <RequestQuoteOutlinedIcon fontSize="small" />,
    route: '/receipt',
    documentType: DOCUMENT_TYPE.receipt,
    requiresCustomerId: true,
    group: 'sales',
    tooltip: 'Create a new receipt for this customer',
    enabled: true,
  },

  create_delivery_note: {
    type: 'create_delivery_note',
    label: 'Create Delivery Note',
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
    route: '/deliveryNote',
    documentType: DOCUMENT_TYPE.deliveryNote,
    requiresCustomerId: true,
    group: 'sales',
    tooltip: 'Create a new delivery note for this customer',
    enabled: true,
  },

  // Purchase Documents
  create_purchase_order: {
    type: 'create_purchase_order',
    label: 'Create Purchase Order',
    icon: <ShoppingBasketOutlinedIcon fontSize="small" />,
    route: '/purchaseOrder',
    documentType: DOCUMENT_TYPE.purchaseOrder,
    requiresCustomerId: false,
    group: 'purchase',
    tooltip: 'Create a new purchase order',
    enabled: true,
  },

  create_purchase_invoice: {
    type: 'create_purchase_invoice',
    label: 'Create Purchase Invoice',
    icon: <PointOfSaleOutlinedIcon fontSize="small" />,
    route: '/purchaseInvoice',
    documentType: DOCUMENT_TYPE.purchaseInvoice,
    requiresCustomerId: false,
    group: 'purchase',
    tooltip: 'Create a new purchase invoice',
    enabled: true,
  },

  // Ticket Actions
  print_ticket: {
    type: 'print_ticket',
    label: 'Print Ticket',
    icon: <PrintOutlinedIcon fontSize="small" />,
    route: '', // No route, handled in hook
    requiresCustomerId: false,
    group: 'ticket',
    tooltip: 'Print this ticket',
    enabled: true,
  },

  export_ticket: {
    type: 'export_ticket',
    label: 'Export Ticket',
    icon: <SaveAltOutlinedIcon fontSize="small" />,
    route: '', // No route, handled in hook
    requiresCustomerId: false,
    group: 'ticket',
    tooltip: 'Export ticket to PDF',
    enabled: true,
  },

  delete_ticket: {
    type: 'delete_ticket',
    label: 'Delete Ticket',
    icon: <DeleteOutlineIcon fontSize="small" />,
    route: '', // No route, handled in hook
    requiresCustomerId: false,
    group: 'ticket',
    tooltip: 'Delete this ticket',
    enabled: true,
  },

  // Other Actions
  export_conversation: {
    type: 'export_conversation',
    label: 'Export Conversation',
    icon: <DownloadOutlinedIcon fontSize="small" />,
    route: '', // No route, handled separately
    requiresCustomerId: false,
    group: 'other',
    tooltip: 'Export ticket conversation to PDF',
    enabled: false, // TODO: Implement export functionality
  },
};

/**
 * Get actions grouped by category
 */
export const getGroupedActions = (): Record<string, QuickActionConfig[]> => {
  const grouped: Record<string, QuickActionConfig[]> = {
    sales: [],
    purchase: [],
    ticket: [],
    other: [],
  };

  Object.values(QUICK_ACTIONS_CONFIG).forEach((action) => {
    if (action.enabled !== false) {
      grouped[action.group].push(action);
    }
  });

  return grouped;
};

/**
 * Get action by type
 */
export const getActionConfig = (type: QuickActionType): QuickActionConfig | undefined => {
  return QUICK_ACTIONS_CONFIG[type];
};

/**
 * Get enabled actions
 */
export const getEnabledActions = (): QuickActionConfig[] => {
  return Object.values(QUICK_ACTIONS_CONFIG).filter((action) => action.enabled !== false);
};

/**
 * Group labels for menu sections
 */
export const GROUP_LABELS: Record<string, string> = {
  sales: 'Sales Documents',
  purchase: 'Purchase Documents',
  ticket: 'Ticket Actions',
  other: 'Other Actions',
};
