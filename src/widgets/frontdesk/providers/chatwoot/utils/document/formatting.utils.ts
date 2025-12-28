/**
 * Document Formatting Utilities
 *
 * Centralized formatting functions for dates, prices, titles, and routing.
 * Eliminates duplicate implementations across components.
 */

import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { NormalizedDocument } from "../../types/document.types";

/**
 * Format a date value for display
 * Handles ISO strings, timestamps (seconds), and Date objects
 */
export function formatDocumentDate(
  dateValue: string | number | Date | undefined
): string {
  if (!dateValue) return "";

  try {
    let date: Date;

    if (typeof dateValue === "number") {
      // Handle Unix timestamp in seconds
      date = new Date(dateValue * 1000);
    } else if (typeof dateValue === "string") {
      date = new Date(dateValue);
    } else {
      date = dateValue;
    }

    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

/**
 * Format a date value as locale date string (shorter format)
 */
export function formatDocumentDateShort(
  dateValue: string | number | Date | undefined
): string {
  if (!dateValue) return "";

  try {
    let date: Date;

    if (typeof dateValue === "number") {
      date = new Date(dateValue * 1000);
    } else if (typeof dateValue === "string") {
      date = new Date(dateValue);
    } else {
      date = dateValue;
    }

    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString();
  } catch {
    return "";
  }
}

/**
 * Format currency amount with optional currency symbol
 * Uses the currency units from the global state
 */
export function formatDocumentPrice(
  amount: number | undefined,
  currency: string | undefined,
  currencyUnits?: Array<{ value: string; text: string }>
): string {
  if (amount === undefined || amount === null) return "";

  let currencySymbol = currency || "";

  // Look up currency symbol from units if provided
  if (currencyUnits && currency) {
    const foundCurrency = currencyUnits.find((c) => c.value === currency);
    if (foundCurrency?.text) {
      currencySymbol = foundCurrency.text;
    }
  }

  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currencySymbol
    ? `${currencySymbol} ${formattedAmount}`
    : formattedAmount;
}

/**
 * Format price without decimal places (for compact display)
 */
export function formatDocumentPriceCompact(
  amount: number | undefined,
  currency: string | undefined,
  currencyUnits?: Array<{ value: string; text: string }>
): string {
  if (amount === undefined || amount === null) return "";

  let currencySymbol = currency || "";

  if (currencyUnits && currency) {
    const foundCurrency = currencyUnits.find((c) => c.value === currency);
    if (foundCurrency?.text) {
      currencySymbol = foundCurrency.text;
    }
  }

  const formattedAmount = amount.toLocaleString("en-US");

  return currencySymbol
    ? `${currencySymbol} ${formattedAmount}`
    : formattedAmount;
}

/**
 * Get human-readable document type title
 */
export function getDocumentTypeTitle(documentType: DOCUMENT_TYPE): string {
  const titles: Record<DOCUMENT_TYPE, string> = {
    [DOCUMENT_TYPE.quote]: "Quote",
    [DOCUMENT_TYPE.invoice]: "Invoice",
    [DOCUMENT_TYPE.order]: "Order",
    [DOCUMENT_TYPE.receipt]: "Receipt",
    [DOCUMENT_TYPE.deliveryNote]: "Delivery Note",
    [DOCUMENT_TYPE.proformaInvoice]: "Proforma Invoice",
    [DOCUMENT_TYPE.purchaseOrder]: "Purchase Order",
    [DOCUMENT_TYPE.purchaseInvoice]: "Purchase Invoice",
    [DOCUMENT_TYPE.deliveryNoteRefund]: "Delivery Note Refund",
    [DOCUMENT_TYPE.invoiceRefund]: "Invoice Refund",
    [DOCUMENT_TYPE.generalLedgerReport]: "General Ledger Report",
    [DOCUMENT_TYPE.purchaseInvoiceRefund]: "Purchase Invoice Refund",
    [DOCUMENT_TYPE.boardMission]: "Board Mission",
    [DOCUMENT_TYPE.customerChat]: "Customer Chat",
    [DOCUMENT_TYPE.supplierPayments]: "Supplier Payments",
    [DOCUMENT_TYPE.QuoteApprovalRequest]: "Quote Approval Request",
  };
  return titles[documentType] || "Document";
}

/**
 * Get the route path for a document
 */
export function getDocumentRoute(
  documentType: DOCUMENT_TYPE,
  documentId: string
): string {
  const routes: Partial<Record<DOCUMENT_TYPE, string>> = {
    [DOCUMENT_TYPE.quote]: `/quote?Id=${documentId}`,
    [DOCUMENT_TYPE.invoice]: `/invoice?Id=${documentId}`,
    [DOCUMENT_TYPE.order]: `/orders?Id=${documentId}`,
    [DOCUMENT_TYPE.receipt]: `/receipts?Id=${documentId}`,
    [DOCUMENT_TYPE.deliveryNote]: `/deliveryNote?Id=${documentId}`,
    [DOCUMENT_TYPE.purchaseOrder]: `/purchaseOrders?Id=${documentId}`,
    [DOCUMENT_TYPE.purchaseInvoice]: `/purchaseInvoices?Id=${documentId}`,
  };

  return routes[documentType] || "/quotes";
}

/**
 * Get full URL for a document (for opening in new tab)
 */
export function getDocumentUrl(
  documentType: DOCUMENT_TYPE,
  documentId: string
): string {
  return getDocumentRoute(documentType, documentId);
}

/**
 * Open document in a new browser tab
 */
export function openDocumentInNewTab(
  documentType: DOCUMENT_TYPE,
  documentId: string
): void {
  const route = getDocumentRoute(documentType, documentId);
  window.open(route, "_blank");
}

/**
 * Format normalized document for display
 * Returns a consistent structure for UI components
 */
export function formatDocumentForUI(
  document: NormalizedDocument,
  currencyUnits?: Array<{ value: string; text: string }>
): {
  number: string;
  clientName: string;
  date: string;
  amount: string;
  status: string;
  hasStatus: boolean;
  hasAmount: boolean;
} {
  return {
    number: document.number,
    clientName: document.client.name,
    date: formatDocumentDate(document.createdDate),
    amount: formatDocumentPrice(
      document.totalPrice,
      document.currency,
      currencyUnits
    ),
    status: document.status,
    hasStatus: !!document.status,
    hasAmount: document.totalPrice > 0,
  };
}

/**
 * Create autocomplete label for a document
 */
export function createDocumentLabel(document: NormalizedDocument): string {
  return `${document.number} - ${document.client.name}`;
}
