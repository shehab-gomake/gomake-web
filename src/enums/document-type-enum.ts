export enum EDocumentTypeEnum {
    Quote = 0,
    Order = 1,
    DeliveryNote = 2,
    Invoice = 3,
    Receipts = 4,
}

export enum EOutSoucrceUpdateKey
{
    TotalCost= 0,
    TotalRealProductionTime= 1,
    Profit= 2,
    TotalPrice= 3,
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
    SalesDocuments = 47
  }
  export enum DuplicateType {
    SameOrder,
    NewBoardMissionNumber,
    SameBoardMissionNumber,
}