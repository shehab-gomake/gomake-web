export enum EDocumentTypeEnum {
  Quote = 0,
  Order = 1,
  DeliveryNote = 2,
  Invoice = 3,
  Receipts = 4,
}

export enum EOutSoucrceUpdateKey {
  TotalCost = 0,
  TotalRealProductionTime = 1,
  Profit = 2,
  TotalPrice = 3,
  Outputs = 4,
}

export enum DocumentsTypeReportList {
  Invoice = 13,
  InvoiceRefund = 14,
  PurchaseInvoice = 18,
  PurchaseInvoiceRefund = 19,
  Payments = 24,
  Deposits = 25,
  JournalEntry = 30,
  OutGoingPayments = 46,
  SalesDocuments = 47,
}

export enum ReportsType {
  allInvoices = 0,
  openedInvoices = 1,
}

export enum DuplicateType {
  SameOrder,
  NewBoardMissionNumber,
  SameBoardMissionNumber,
  SameOrderAndSameBoardMissionNumber,
}

export enum GraphicsTypesParam {
  PriceHour = 1,
  PriceRegularHour,
}
export enum SampleTypeParm {
  Full = 1,
  PrintOnly,
}

export enum SortByTypes {
  Defualt = 1,
  Date = 2,
  ProductABC = 3,
  WorkNameABC = 4,
}
export enum DiscountType {
  NONE = 1,
  Product,
  ProductSKU,
}

export enum DocumentTypeEnums {
  Quote,
  Order,
  DeliveryNote,
  Invoice,
  Receipt,
  DeliveryNoteRefund,
  InvoiceRefund,
  GeneralLedgerReport,
  PurchaseOrder,
  PurchaseInvoice,
  PurchaseInvoiceRefund,
  BoardMission,
}

export enum ERPDocumentsTypesEnum {
  order = 1,
  invoice,
  deliveryNote,
  purchase,
  invoiceRefund,
  receipt,
  journalEntry,
  purchaseInvoice,
  purchaseInvoiceRefund,
  foreignJournalEntry,
  deliveryNoteRefund,
  quote,
  externalInvoice,
  all,
  externalPayment,
  boardMission,
  agingReport,
  ledgerReport,
  salesReport,
  supplierPayment,
}

export enum ORDER_STATUSES {
  Open = 0,
  Canceled,
  WaitingForPayment,
  Paused,
  Ready,
}

export enum EAdditionType {
  Percentage,
  ValuePerJob,
  ValuePerUnit,
}

export enum ECalculationStatus {
  Calculating,
  Done,
  Failed,
}

export enum EMessageStatus {
  processed,
  dropped,
  delivered,
  deferred,
  bounce,
  blocked,
  open,
  clicked,
  spamreport,
  unsubscribe,
  group_unsubscribe,
  group_resubscribe,
}

export enum DocumentCalculationType {
  Discount,
  DiscountAmount,
  TotalPayment,
  VAT,
}

export enum DocumentPreferencesEnum {
  ShowPrice,
  ShowDetails,
  ShowGraphicsItems,
  ShowDeliveryItems,
}
