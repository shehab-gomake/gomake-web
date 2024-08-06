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
            return "SourceDocument.order";
        case ERPDocumentsTypesEnum.Invoice:
            return "SourceDocument.invoice";
        case ERPDocumentsTypesEnum.DeliveryNotes:
            return "SourceDocument.deliveryNotes";
        case ERPDocumentsTypesEnum.Purchase:
            return "SourceDocument.purchase";
        case ERPDocumentsTypesEnum.InvoiceRefund:
            return "SourceDocument.invoiceRefund";
        case ERPDocumentsTypesEnum.Receipt:
            return "SourceDocument.receipt";
        case ERPDocumentsTypesEnum.JournalEntry:
            return "SourceDocument.journalEntry";
        case ERPDocumentsTypesEnum.PurchaseInvoice:
            return "SourceDocument.purchaseInvoice";
        case ERPDocumentsTypesEnum.PurchaseInvoiceRefund:
            return "SourceDocument.purchaseInvoiceRefund";
        case ERPDocumentsTypesEnum.ForeignJournalEntry:
            return "SourceDocument.foreignJournalEntry";
        case ERPDocumentsTypesEnum.DeliveryNoteRefund:
            return "SourceDocument.deliveryNoteRefund";
        case ERPDocumentsTypesEnum.Quote:
            return "SourceDocument.quote";
        case ERPDocumentsTypesEnum.ExternalInvoice:
            return "SourceDocument.externalInvoice";
        case ERPDocumentsTypesEnum.All:
            return "SourceDocument.all";
        case ERPDocumentsTypesEnum.ExternalPayment:
            return "SourceDocument.externalPayment";
        case ERPDocumentsTypesEnum.BoardMission:
            return "SourceDocument.boardMission";
        case ERPDocumentsTypesEnum.AgingReport:
            return "SourceDocument.agingReport";
        case ERPDocumentsTypesEnum.LedgerReport:
            return "SourceDocument.ledgerReport";
        case ERPDocumentsTypesEnum.SalesReport:
            return "SourceDocument.salesReport";
        default:
            return "SourceDocument.unknown";
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