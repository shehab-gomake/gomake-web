export interface IDocument {
  id?: string;
  docType: number;
  documentName: string;
  prefix: string;
  value: number;
  nextValue: number;
  templateId?: string;
  recordID?: number;
  tabKey?: number;
}

export enum DocumentsTypeEnum {
  Quote = 0,
  Order,
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
  Supplier,
}

export enum DocumentTypesListEnum {
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
  Supplier,
}
