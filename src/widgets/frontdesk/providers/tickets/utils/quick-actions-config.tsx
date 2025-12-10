/**
 * Quick Actions Configuration
 *
 * Defines all available quick actions with their properties
 */

import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import {
  QuickActionConfig,
  QuickActionType,
} from "../types/quick-actions.types";

// Icon imports - using Material UI icons for now
// TODO: Replace with GoMake custom icons if available
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

/**
 * All available quick actions
 */
export const QUICK_ACTIONS_CONFIG: Record<QuickActionType, QuickActionConfig> =
  {
    // Sales Documents
    create_quote: {
      type: "create_quote",
      label: "Assign to Quote",
      icon: <DescriptionOutlinedIcon fontSize="small" />,
      route: "/quote",
      documentType: DOCUMENT_TYPE.quote,
      requiresCustomerId: true,
      group: "sales",
      tooltip: "Assign conversation to an existing quote or create a new one",
      enabled: true,
    },

    create_quote_with_ai: {
      type: "create_quote_with_ai",
      label: "Create Quote with AI",
      icon: <AutoAwesomeOutlinedIcon fontSize="small" />,
      route: "/quote",
      requiresCustomerId: true,
      group: "sales",
      tooltip: "Generate a quote using AI based on the last message",
      enabled: true,
    },

    create_invoice: {
      type: "create_invoice",
      label: "Assign to Invoice",
      icon: <ReceiptOutlinedIcon fontSize="small" />,
      route: "/invoice",
      documentType: DOCUMENT_TYPE.invoice,
      requiresCustomerId: true,
      group: "sales",
      tooltip: "Assign conversation to an existing invoice or create a new one",
      enabled: true,
    },

    create_order: {
      type: "create_order",
      label: "Assign to Order",
      icon: <ShoppingCartOutlinedIcon fontSize="small" />,
      route: "/order",
      documentType: DOCUMENT_TYPE.order,
      requiresCustomerId: true,
      group: "sales",
      tooltip: "Assign conversation to an existing order or create a new one",
      enabled: true,
    },

    create_receipt: {
      type: "create_receipt",
      label: "Assign to Receipt",
      icon: <RequestQuoteOutlinedIcon fontSize="small" />,
      route: "/receipt",
      documentType: DOCUMENT_TYPE.receipt,
      requiresCustomerId: true,
      group: "sales",
      tooltip: "Assign conversation to an existing receipt or create a new one",
      enabled: true,
    },

    create_delivery_note: {
      type: "create_delivery_note",
      label: "Assign to Delivery Note",
      icon: <LocalShippingOutlinedIcon fontSize="small" />,
      route: "/deliveryNote",
      documentType: DOCUMENT_TYPE.deliveryNote,
      requiresCustomerId: true,
      group: "sales",
      tooltip:
        "Assign conversation to an existing delivery note or create a new one",
      enabled: true,
    },

    // Purchase Documents
    create_purchase_order: {
      type: "create_purchase_order",
      label: "Assign to Purchase Order",
      icon: <ShoppingBasketOutlinedIcon fontSize="small" />,
      route: "/purchaseOrder",
      documentType: DOCUMENT_TYPE.purchaseOrder,
      requiresCustomerId: false,
      group: "purchase",
      tooltip:
        "Assign conversation to an existing purchase order or create a new one",
      enabled: true,
    },

    create_purchase_invoice: {
      type: "create_purchase_invoice",
      label: "Assign to Purchase Invoice",
      icon: <PointOfSaleOutlinedIcon fontSize="small" />,
      route: "/purchaseInvoice",
      documentType: DOCUMENT_TYPE.purchaseInvoice,
      requiresCustomerId: false,
      group: "purchase",
      tooltip:
        "Assign conversation to an existing purchase invoice or create a new one",
      enabled: true,
    },

    // Ticket Actions
    print_ticket: {
      type: "print_ticket",
      label: "Print Ticket",
      icon: <PrintOutlinedIcon fontSize="small" />,
      route: "", // No route, handled in hook
      requiresCustomerId: false,
      group: "ticket",
      tooltip: "Print this ticket",
      enabled: true,
    },

    edit_ticket: {
      type: "edit_ticket",
      label: "Edit Ticket",
      icon: <EditOutlinedIcon fontSize="small" />,
      route: "", // No route, handled in hook
      requiresCustomerId: false,
      group: "ticket",
      tooltip: "Edit ticket details",
      enabled: true,
    },

    archive_ticket: {
      type: "archive_ticket",
      label: "Archive Ticket",
      icon: <ArchiveOutlinedIcon fontSize="small" />,
      route: "", // No route, handled in hook
      requiresCustomerId: false,
      group: "ticket",
      tooltip: "Archive this ticket",
      enabled: true,
    },

    // Other Actions
    export_conversation: {
      type: "export_conversation",
      label: "Export Conversation",
      icon: <DownloadOutlinedIcon fontSize="small" />,
      route: "", // No route, handled separately
      requiresCustomerId: false,
      group: "other",
      tooltip: "Export ticket conversation to PDF",
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
export const getActionConfig = (
  type: QuickActionType
): QuickActionConfig | undefined => {
  return QUICK_ACTIONS_CONFIG[type];
};

/**
 * Get enabled actions
 */
export const getEnabledActions = (): QuickActionConfig[] => {
  return Object.values(QUICK_ACTIONS_CONFIG).filter(
    (action) => action.enabled !== false
  );
};

/**
 * Group labels for menu sections
 */
export const GROUP_LABELS: Record<string, string> = {
  sales: "Sales Documents",
  purchase: "Purchase Documents",
  ticket: "Ticket Actions",
  other: "Other Actions",
};

/**
 * Get translated group labels
 * @param t Translation function from react-i18next
 */
export const getTranslatedGroupLabels = (
  t: (key: string) => string
): Record<string, string> => {
  return {
    sales: t("frontdesk.detailPanel.salesDocuments"),
    purchase: t("frontdesk.detailPanel.purchaseDocuments"),
    ticket: t("frontdesk.detailPanel.ticketActions"),
    other: t("frontdesk.detailPanel.otherActions"),
  };
};

/**
 * Get actions excluding ticket group (for main Actions button)
 */
export const getActionsExcludingTickets = (): QuickActionConfig[] => {
  return Object.values(QUICK_ACTIONS_CONFIG).filter(
    (action) => action.enabled !== false && action.group !== "ticket"
  );
};

/**
 * Get only ticket actions (for 3-dot menu)
 */
export const getTicketActions = (): QuickActionConfig[] => {
  return Object.values(QUICK_ACTIONS_CONFIG).filter(
    (action) => action.enabled !== false && action.group === "ticket"
  );
};
