
export enum DOCUMENT_TYPE {
    quote = 0,
    order,
    deliveryNote,
    invoice,
    receipt,
    deliveryNoteRefund,
    invoiceRefund,
    generalLedgerReport,
    purchaseOrder,
    purchaseInvoice,
    purchaseInvoiceRefund
}

export enum QUOTE_STATUSES {
    Create = 1,
    Open = 2,
    Closed = 3,
    Canceled = 4,
    Waiting = 5,
    Approved = 6,
    CanceledIrrelvant = 7,
    CanceledPrice = 8,
    CanceledDeliveryTime = 9,
    CanceledOther = 10,
    ApprovedByManager = 11,
    RejectedByManager = 12,
    PartialClosed = 13,
    WaitForPrintHouseConfirm = 14,
}

export enum DELIVERY_NOTE_STATUSES {
    Open = 0,
    Canceled,
    Created,
    Refunded,
    Confirmed,
    Rejected,
    PartialRefunded,
    ClosedAsInvoice,
    ClosedByMultiDocuments,
    ManualClose,
}

export enum EStatisticsLabels {
    SUCCESS_RATE = "successRate",
    MONTHLY_PERFORMANCE = "monthlyPerformance",
    APPROVED = "approved",
    WAITING = "waiting",
    PENDING = "pending",
    ORDERS = "orders",
    CANCELED = "canceled"
}

export enum LogActionType {
    ITEM_ADD = 1,
    ITEM_UPADTED,
    ITEM_DELETED,
    ITEM_PRICE_UPDATE,
    DOCUMENT_PRICE_UPDATE,
    DOCUMENT_DISCUOUNT_UPDATE,
    ADDRESS_UPDATED,
    CONTACTS_UPDATED,
    CLIENT_UPDATED,
    AGENT_UPDATED,
    PURCHASE_NUMBER_UPDATE,
    COMMENTS_UPDATE,
    DOCUMENT_DUPLICATED,
    DOCUMENT_DUPLICATED_FROM_ORDER
}