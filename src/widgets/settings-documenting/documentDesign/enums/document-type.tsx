export enum ERPDocumentsTypesEnum {
    Order = 1,
    Invoice,
    DeliveryNotes,
    Purchase,
    InvoiceRefund,
    Receipt,
    JournalEntry,
    PurchaseInvoice,
    PurchaseInvoiceRefund,
    ForeignJournalEntry,
    DeliveryNoteRefund,
    Quote,
    ExternalInvoice,
    All,
    ExternalPayment,
    BoardMission,
    AgingReport,
    LedgerReport,
    SalesReport
}

export function renderDocumentTypeForSourceDocumentNumber(documentType: ERPDocumentsTypesEnum): string {
    switch (documentType) {
        case ERPDocumentsTypesEnum.Order:
            return "Order";
        case ERPDocumentsTypesEnum.Invoice:
            return "Invoice";
        case ERPDocumentsTypesEnum.DeliveryNotes:
            return "Delivery Notes";
        case ERPDocumentsTypesEnum.Purchase:
            return "Purchase";
        case ERPDocumentsTypesEnum.InvoiceRefund:
            return "Invoice Refund";
        case ERPDocumentsTypesEnum.Receipt:
            return "Receipt";
        case ERPDocumentsTypesEnum.JournalEntry:
            return "Journal Entry";
        case ERPDocumentsTypesEnum.PurchaseInvoice:
            return "Purchase Invoice";
        case ERPDocumentsTypesEnum.PurchaseInvoiceRefund:
            return "Purchase Invoice Refund";
        case ERPDocumentsTypesEnum.ForeignJournalEntry:
            return "Foreign Journal Entry";
        case ERPDocumentsTypesEnum.DeliveryNoteRefund:
            return "Delivery Note Refund";
        case ERPDocumentsTypesEnum.Quote:
            return "Quote";
        case ERPDocumentsTypesEnum.ExternalInvoice:
            return "External Invoice";
        case ERPDocumentsTypesEnum.All:
            return "All";
        case ERPDocumentsTypesEnum.ExternalPayment:
            return "External Payment";
        case ERPDocumentsTypesEnum.BoardMission:
            return "Board Mission";
        case ERPDocumentsTypesEnum.AgingReport:
            return "Aging Report";
        case ERPDocumentsTypesEnum.LedgerReport:
            return "Ledger Report";
        case ERPDocumentsTypesEnum.SalesReport:
            return "Sales Report";
        default:
            return "Unknown Document Type";
    }
}

export function renderURLDocumentType(documentType: ERPDocumentsTypesEnum, documentId): string {
    switch (documentType) {
        case ERPDocumentsTypesEnum.Order:
            return `/order?Id=${documentId}`;
        case ERPDocumentsTypesEnum.Invoice:
            return `/invoice?Id=${documentId}`;
        case ERPDocumentsTypesEnum.DeliveryNotes:
            return `/deliveryNote?Id=${documentId}`;
        case ERPDocumentsTypesEnum.Purchase:
            return `/purchaseOrder?Id=${documentId}`;
        case ERPDocumentsTypesEnum.InvoiceRefund:
            return `/invoiceRefund?Id=${documentId}`;
        case ERPDocumentsTypesEnum.PurchaseInvoice:
            return `/purchaseInvoice?Id=${documentId}`;
        case ERPDocumentsTypesEnum.PurchaseInvoiceRefund:
            return `/purchaseInvoiceRefund?Id=${documentId}`;
        case ERPDocumentsTypesEnum.ForeignJournalEntry:
            return "Foreign Journal Entry";
        case ERPDocumentsTypesEnum.DeliveryNoteRefund:
            return `/deliveryNoteRefund?Id=${documentId}`;
        default:
            return "Unknown Document Type";
    }
}