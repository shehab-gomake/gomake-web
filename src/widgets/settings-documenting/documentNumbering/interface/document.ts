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
    Quote=0,
    Order ,
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
    QuoteOld,
    ExternalInvoice,
    All,
    ExternalPayment,
    BoardMission,
    AgingReport,
    SalesReport,
    Client,
    Supplier
}