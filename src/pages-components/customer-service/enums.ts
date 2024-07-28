import { SectionPages, TicketTypeList } from "./interface";

export const ticketTypeList: TicketTypeList[] = [
  { label: "Bug", value: "10005" },
  { label: "New Feature", value: "10004" },
  { label: "Support", value: "10083" },
];

export const sections: SectionPages = {
  General: [
    "Home Page",
    "Production Floor",
    "Calculation Page",
    "Pricing",
    "Board Missions",
    "Quick Setup",
    "Chat and Approvals",
  ],
  Sales: [
    "Create/Edit Quote",
    "Create Delivery Notes",
    "Create Invoice",
    "Edit Order",
    "Edit Delivery Note",
    "Edit Invoice",
    "Quotes List",
    "Orders List",
    "Delivery Notes List",
    "Delivery Notes Refund List",
    "Invoices List",
    "Invoices Refund List",
  ],
  Purchase: [
    "Create Purchase Documents",
    "Edit Purchase Documents",
    "Purchase Jobs",
    "Purchase Orders",
    "Purchase Invoices List",
    "Purchase Invoices Refund List",
  ],
  Banks: [
    "Receipts",
    "Receipt Create + Payment Modal",
    "Receipt Details Page",
    "Deposits",
    "Deposit Create",
    "Deposit Details Page",
  ],
  Contacts: ["Suppliers", "Customers"],
  Reports: ["Aging Report", "Ledger Report", "Transaction Journal Report", "Daily Payments Report", "Credit Card Transactions"],
  "Materials, Machines, Actions": ["Materials", "Machines", "Actions"],
  Settings: ["Profile", "Products", "Mailing", "Documenting", "Users", "Finance"],
};
