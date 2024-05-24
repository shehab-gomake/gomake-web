export interface IDocument {
    id?: string;
    docType: string;
    documentName: string;
    prefix: string;
    value: number;
    nextValue: number;
}

export enum DocumentsTypeEnum
{
    Order = 1,
    Invoice,
    DeliveryNotes,
    Purchase,
    InvoiceRefund,
    Receipt,
    JournalEntry,
    Deposits,
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
    SalesReport,
    Client,
    Supplier
}