export enum JobsTableColumns {
  CreationDate = 0,
  DueDate = 1,
}

export enum QuotesTableColumns {
  CreationDate = 0,
  ClientName,
  Number,
  TotalPrice,
  OrderNumber,
  TotalPriceWithoutVat,
  Discount,
  Vat,
}

export enum OrdersTableColumns {
  CreationDate,
  Number,
  ClientName,
  PurchaseNumber,
  OrderItemsNumber, // jobs
  WorksNames,
  Cost,
  TotalPrice,
  TotalPriceWithoutVat,
  Discount,
}

// same for invoice
export enum DeliveryNotesTableColumns {
  CreationDate,
  ClientName,
  WorksNames,
  DeliveryNoteItemsNumber,
  Notes,
  TotalPrice,
  DeliveryStatus,
  Status,
  TotalPriceWithoutVat,
  Discount,
}
