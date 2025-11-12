/**
 * Chatwoot Custom Attributes Constants
 *
 * Defines standardized keys for custom attributes used in Chatwoot conversations.
 * These attributes are stored in conversation.custom_attributes.
 */

/**
 * Custom attribute keys for Chatwoot conversations
 */
export const CHATWOOT_CUSTOM_ATTRIBUTES = {
  /** GoMake customer ID */
  CUSTOMER_ID: 'gomake_customer_id',

  /** Linked quote document ID */
  LINKED_QUOTE_ID: 'linked_quote_id',
  LINKED_QUOTE_AT: 'linked_quote_at',

  /** Linked invoice document ID */
  LINKED_INVOICE_ID: 'linked_invoice_id',
  LINKED_INVOICE_AT: 'linked_invoice_at',

  /** Linked order document ID */
  LINKED_ORDER_ID: 'linked_order_id',
  LINKED_ORDER_AT: 'linked_order_at',

  /** Linked receipt document ID */
  LINKED_RECEIPT_ID: 'linked_receipt_id',
  LINKED_RECEIPT_AT: 'linked_receipt_at',

  /** Linked delivery note document ID */
  LINKED_DELIVERY_NOTE_ID: 'linked_delivery_note_id',
  LINKED_DELIVERY_NOTE_AT: 'linked_delivery_note_at',

  /** Linked purchase order document ID */
  LINKED_PURCHASE_ORDER_ID: 'linked_purchase_order_id',
  LINKED_PURCHASE_ORDER_AT: 'linked_purchase_order_at',

  /** Linked purchase invoice document ID */
  LINKED_PURCHASE_INVOICE_ID: 'linked_purchase_invoice_id',
  LINKED_PURCHASE_INVOICE_AT: 'linked_purchase_invoice_at',
} as const;

/**
 * Type for custom attribute keys
 */
export type ChatwootCustomAttributeKey = typeof CHATWOOT_CUSTOM_ATTRIBUTES[keyof typeof CHATWOOT_CUSTOM_ATTRIBUTES];

/**
 * Get the custom attribute key for a document type based on action type
 * @param actionType - The quick action type (e.g., 'create_quote', 'create_invoice')
 * @returns The custom attribute key for the document ID and timestamp
 */
export function getDocumentAttributeKeys(
  actionType: string
): { idKey: string; timestampKey: string } | null {
  const actionMap: Record<string, { idKey: string; timestampKey: string }> = {
    create_quote: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_QUOTE_ID,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_QUOTE_AT,
    },
    create_invoice: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_INVOICE_ID,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_INVOICE_AT,
    },
    create_order: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_ORDER_ID,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_ORDER_AT,
    },
    create_receipt: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_RECEIPT_ID,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_RECEIPT_AT,
    },
    create_delivery_note: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_DELIVERY_NOTE_ID,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_DELIVERY_NOTE_AT,
    },
    create_purchase_order: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_ORDER_ID,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_ORDER_AT,
    },
    create_purchase_invoice: {
      idKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_INVOICE_ID,
      timestampKey: CHATWOOT_CUSTOM_ATTRIBUTES.LINKED_PURCHASE_INVOICE_AT,
    },
  };

  return actionMap[actionType] || null;
}
