import { ColumnSetting } from "@/widgets/production-floor/state/production-floor-coulmns-table-settings";
import { atomFamily } from "recoil";

export const documentColumnKeys: Record<string, string[]> = {
  quotes: [
    "creationDate",
    "client",
    "agent",
    "number",
    "worksName",
    "totalPrice",
    "notes",
    "status",
    "more",
  ],
  orders: [
    "creationDate",
    "client",
    "agent",
    "orderNumber",
    "quoteNumber",
    "purchaseNumber",
    "productionStatus",
    "jobs",
    "cost",
    "worksName",
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
    "sourceDocument",
    "worksName",
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
    "sourceDocument",
    "worksName",
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
    "totalPrice",
    "notes",
    "status",
    "more",
  ],
};

export const documentColumnWidthsMap: Record<string, Record<string, string>> = {
  quotes: {
    creationDate: "11%",
    client: "11%",
    agent: "7%",
    number: "7%",
    worksName: "20%",
    totalPrice: "11%",
    notes: "10%",
    status: "16%",
    more: "6%",
  },
  orders: {
    creationDate: "6%",
    client: "5%",
    agent: "5%",
    orderNumber: "7%",
    quoteNumber: "7%",
    purchaseNumber: "8%",
    productionStatus: "8%",
    jobs: "3%",
    cost: "10%",
    worksName: "7%",
    totalPrice: "7%",
    notes: "7%",
    deliveryStatus: "10%",
    status: "5%",
    more: "5%",
  },
  deliveryNotes: {
    creationDate: "10%",
    client: "8%",
    agent: "8%",
    number: "8%",
    sourceDocument: "10%",
    worksName: "23%",
    totalPrice: "10%",
    deliveryStatus: "10%",
    notes: "10%",
    more: "3%",
  },
  invoices: {
    creationDate: "10%",
    client: "8%",
    agent: "8%",
    number: "8%",
    sourceDocument: "10%",
    worksName: "23%",
    totalPrice: "10%",
    deliveryStatus: "10%",
    notes: "10%",
    more: "3%",
  },
  purchaseOrders: {
    creationDate: "10%",
    purchaseOrderNumber: "8%",
    orderNumber: "8%",
    supplierName: "8%",
    client: "10%",
    itemsNumber: "23%",
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
    totalPrice: "10%",
    notes: "10%",
    status: "10%",
    more: "5%",
  },
  receipts: {
    creationDate: "7%",
    client: "15%",
    agent: "10%",
    number: "13%",
    paymentMethod: "10%",
    worksName: "10%",
    totalPrice: "10%",
    notes: "10%",
    status: "10%",
    more: "5%",
  },
  supplierPayments: {
    creationDate: "7%",
    supplier: "15%",
    agent: "10%",
    number: "13%",
    paymentMethod: "10%",
    worksName: "10%",
    totalPrice: "10%",
    notes: "10%",
    status: "10%",
    more: "5%",
  },
};

export const getDocumentCustomWidth = (
  tableKey: string,
  columnKey: string
): string => {
  return documentColumnWidthsMap[tableKey]?.[columnKey] ?? "auto";
};

export const parseSavedColumnSettings = (
  settings: ColumnSetting[],
  allKeys: string[]
): { visibility: Record<string, boolean>; order: string[] } => {
  const visibility = Object.fromEntries(
    allKeys.map((key) => {
      const found = settings.find((s) => s.key === key);
      return [key, found?.visible ?? true];
    })
  );
  const order = settings.map((s) => s.key);
  return { visibility, order };
};

// Visibility state per document table
export const columnVisibilityStateFamily = atomFamily<
  Record<string, boolean>,
  string
>({
  key: "documentColumnVisibilityStateFamily",
  default: (tableKey) =>
    Object.fromEntries(documentColumnKeys[tableKey].map((key) => [key, true])),
});

// Order state per document table
export const columnOrderStateFamily = atomFamily<string[], string>({
  key: "documentColumnOrderStateFamily",
  default: (tableKey) => documentColumnKeys[tableKey],
});
