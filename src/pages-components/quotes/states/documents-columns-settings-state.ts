import { ColumnSetting } from "@/widgets/production-floor/state/production-floor-coulmns-table-settings";
import { atomFamily } from "recoil";

export const documentColumnKeys: Record<string, string[]> = {
  quotes: [
    "creationDate",
    "client",
    "agent",
    "number",
    "worksName",
    "discount",
    "totalPriceWithoutVat",
    "totalPrice",
    "notes",
    "status",
    "more",
  ],
  orders: [
    "creationDate",
    "deliveryDate",
    "client",
    "agent",
    "orderNumber",
    "quoteNumber",
    "purchaseNumber",
    "productionStatus",
    "jobs",
    "cost",
    "worksName",
    "discount",
    "totalPriceWithoutVat",
    "totalPrice",
    "notes",
    "deliveryStatus",
    "status",
    "more",
  ],
  deliveryNotes: [
    "creationDate",
    "client",
    "agent",
    "number",
    "purchaseNumber",
    "sourceDocument",
    "worksName",
    "discount",
    "totalPriceWithoutVat",
    "totalPrice",
    "notes",
    "deliveryStatus",
    "status",
    "more",
  ],
  proformaInvoices: [
    "creationDate",
    "client",
    "agent",
    "number",
    "purchaseNumber",
    "sourceDocument",
    "worksName",
    "discount",
    "totalPriceWithoutVat",
    "totalPrice",
    "notes",
    "deliveryStatus",
    "status",
    "more",
  ],
  invoices: [
    "creationDate",
    "client",
    "agent",
    "number",
    "purchaseNumber",
    "sourceDocument",
    "worksName",
    "discount",
    "totalPriceWithoutVat",
    "totalPrice",
    "notes",
    "deliveryStatus",
    "status",
    "more",
  ],
  purchaseOrders: [
    "creationDate",
    "purchaseOrderNumber",
    "orderNumber",
    "supplierName",
    "client",
    "itemsNumber",
    "totalPriceWithoutVat",
    "totalPrice",
    "notes",
    "status",
    "more",
  ],
  purchaseInvoices: [
    "creationDate",
    "purchaseInvoiceNumber",
    "invoiceNumber",
    "purchaseOrderNumber",
    "supplierName",
    "itemsNumber",
    "totalPriceWithoutVat",
    "totalPrice",
    "notes",
    "status",
    "more",
  ],
  receipts: [
    "creationDate",
    "client",
    "agent",
    "number",
    "paymentMethod",
    "checkNumber",
    "checkDueDate",
    "totalPrice",
    "notes",
    "status",
    "more",
  ],
  supplierPayments: [
    "creationDate",
    "supplier",
    "agent",
    "number",
    "paymentMethod",
    "checkNumber",
    "checkDueDate",
    "totalPrice",
    "notes",
    "status",
    "more",
  ],
};

export const documentColumnWidthsMap: Record<string, Record<string, string>> = {
  quotes: {
    creationDate: "9%",
    client: "9%",
    agent: "7%",
    number: "7%",
    worksName: "16%",
    discount: "7%",
    totalPriceWithoutVat: "11%",
    totalPrice: "11%",
    notes: "8%",
    status: "10%",
    more: "5%",
  },
  orders: {
    creationDate: "6%",
    deliveryDate: "6%",
    client: "5%",
    agent: "5%",
    orderNumber: "6%",
    quoteNumber: "6%",
    purchaseNumber: "6%",
    productionStatus: "6%",
    jobs: "4%",
    cost: "6%",
    worksName: "6%",
    discount: "5%",
    totalPriceWithoutVat: "7%",
    totalPrice: "7%",
    notes: "6%",
    deliveryStatus: "6%",
    status: "4%",
    more: "3%",
  },
  deliveryNotes: {
    creationDate: "7%",
    client: "7%",
    agent: "7%",
    number: "7%",
    purchaseNumber: "7%",
    sourceDocument: "7%",
    worksName: "14%",
    discount: "7%",
    totalPriceWithoutVat: "8%",
    totalPrice: "8%",
    notes: "7%",
    deliveryStatus: "7%",
    status: "7%",
    more: "4%",
  },
  proformaInvoices: {
    creationDate: "7%",
    client: "7%",
    agent: "7%",
    number: "7%",
    purchaseNumber: "7%",
    sourceDocument: "7%",
    worksName: "14%",
    discount: "7%",
    totalPriceWithoutVat: "8%",
    totalPrice: "8%",
    notes: "7%",
    deliveryStatus: "7%",
    status: "7%",
    more: "4%",
  },
  invoices: {
    creationDate: "7%",
    client: "7%",
    agent: "7%",
    number: "7%",
    purchaseNumber: "7%",
    sourceDocument: "7%",
    worksName: "14%",
    discount: "7%",
    totalPriceWithoutVat: "8%",
    totalPrice: "8%",
    notes: "7%",
    deliveryStatus: "7%",
    status: "7%",
    more: "4%",
  },
  purchaseOrders: {
    creationDate: "10%",
    purchaseOrderNumber: "8%",
    orderNumber: "8%",
    supplierName: "8%",
    client: "10%",
    itemsNumber: "13%",
    totalPriceWithoutVat: "10%",
    totalPrice: "10%",
    notes: "10%",
    status: "10%",
    more: "3%",
  },
  purchaseInvoices: {
    creationDate: "7%",
    purchaseInvoiceNumber: "15%",
    invoiceNumber: "10%",
    purchaseOrderNumber: "13%",
    supplierName: "10%",
    itemsNumber: "10%",
    totalPriceWithoutVat: "10%",
    totalPrice: "10%",
    notes: "10%",
    status: "10%",
    more: "5%",
  },
  receipts: {
    creationDate: "7%",
    client: "12%",
    agent: "8%",
    number: "10%",
    paymentMethod: "8%",
    checkNumber: "10%",
    checkDueDate: "10%",
    worksName: "8%",
    totalPrice: "8%",
    notes: "8%",
    status: "8%",
    more: "5%",
  },
  supplierPayments: {
    creationDate: "7%",
    supplier: "12%",
    agent: "8%",
    number: "10%",
    paymentMethod: "8%",
    checkNumber: "10%",
    checkDueDate: "10%",
    worksName: "8%",
    totalPrice: "8%",
    notes: "8%",
    status: "8%",
    more: "5%",
  },
};

export const getDocumentCustomWidth = (
  tableKey: string,
  columnKey: string
): string => {
  return documentColumnWidthsMap[tableKey]?.[columnKey] ?? "auto";
};

/**
 * Parse saved column settings and handle new columns that weren't previously saved
 * New columns are positioned according to documentColumnKeys order and default to visible: false (unchecked)
 */
export const parseSavedColumnSettings = (
  settings: ColumnSetting[],
  allKeys: string[]
): { visibility: Record<string, boolean>; order: string[] } => {
  const visibility = Object.fromEntries(
    allKeys.map((key) => {
      const found = settings.find((s) => s.key === key);
      return [key, found?.visible ?? false]; // New columns (not in saved settings) default to false (unchecked)
    })
  );

  // Simply use the documentColumnKeys order as defined
  const order = [...allKeys];

  return { visibility, order };
};

// Visibility state per document table
export const columnVisibilityStateFamily = atomFamily<
  Record<string, boolean>,
  string
>({
  key: "documentColumnVisibilityStateFamily",
  default: (tableKey) =>
    Object.fromEntries(documentColumnKeys[tableKey].map((key) => [key, false])), // Default to false (unchecked)
});

// Order state per document table
export const columnOrderStateFamily = atomFamily<string[], string>({
  key: "documentColumnOrderStateFamily",
  default: (tableKey) => documentColumnKeys[tableKey],
});
