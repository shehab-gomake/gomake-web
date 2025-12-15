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
  Quote = 0,
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
  CustomerChat,
  SupplierPayments,
  ProformaInvoice = 14,
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
  proformaInvoice = 21,
}

export const mapERPTypeToDocumentType = (
  erpType: ERPDocumentsTypesEnum
): DocumentTypeEnums | undefined => {
  const mapping: Partial<Record<ERPDocumentsTypesEnum, DocumentTypeEnums>> = {
    [ERPDocumentsTypesEnum.quote]: DocumentTypeEnums.Quote,
    [ERPDocumentsTypesEnum.order]: DocumentTypeEnums.Order,
    [ERPDocumentsTypesEnum.deliveryNote]: DocumentTypeEnums.DeliveryNote,
    [ERPDocumentsTypesEnum.invoice]: DocumentTypeEnums.Invoice,
    [ERPDocumentsTypesEnum.receipt]: DocumentTypeEnums.Receipt,
    [ERPDocumentsTypesEnum.deliveryNoteRefund]:
      DocumentTypeEnums.DeliveryNoteRefund,
    [ERPDocumentsTypesEnum.invoiceRefund]: DocumentTypeEnums.InvoiceRefund,
    [ERPDocumentsTypesEnum.journalEntry]: DocumentTypeEnums.GeneralLedgerReport,
    [ERPDocumentsTypesEnum.purchase]: DocumentTypeEnums.PurchaseOrder,
    [ERPDocumentsTypesEnum.purchaseInvoice]: DocumentTypeEnums.PurchaseInvoice,
    [ERPDocumentsTypesEnum.purchaseInvoiceRefund]:
      DocumentTypeEnums.PurchaseInvoiceRefund,
    [ERPDocumentsTypesEnum.boardMission]: DocumentTypeEnums.BoardMission,
    [ERPDocumentsTypesEnum.proformaInvoice]: DocumentTypeEnums.ProformaInvoice,
  };

  return mapping[erpType];
};

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
  ApplyAutomaticDiscount,
  ShowDiscountItems,
  HideItemDiscountColumn,
}

export enum QrCodeAction {
  START = 1,
  FINISH,
  DELIVERY,
  OrderToReady,
}

export enum ShowDocumentDetailsEnum {
  All = 0,
  ShowJobNameOnly = 1,
  HideDetails = 2,
}

export enum ShowPricesEnum {
  All = 0,
  HideTotalPriceOnly = 1,
  HidePrices = 2,
}


export enum PurchaseOrderType
{
    Products,
    Materials
}

export enum ItemCalculationType {
  Amount = 0,
  UnitPrice = 1,
  Discount = 2,
  finalPrice = 3,
  Currency = 4,
  PackagesQuantity = 5,
  QuantityInPackage = 6,
}


export enum PurchaseOrderStatuses
{
    UnderCreation = 0,
    SentToSupplier= 10,
    SupplierRequestingApproval =12,
    Received =11,
    // Closed =8,
}