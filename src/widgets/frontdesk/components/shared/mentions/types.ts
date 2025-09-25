export type MentionCategory =
  | "clients"
  | "suppliers"
  | "invoices"
  | "receipts"
  | "all";

export interface MentionItem {
  id: string;
  label: string;
  sublabel?: string;
  category: MentionCategory;
  raw?: any;
}

export interface MentionGroup {
  title: string;
  items: MentionItem[];
}

export const MentionCategoryTitles: Record<Exclude<MentionCategory, "all">, string> = {
  clients: "Clients",
  suppliers: "Suppliers",
  invoices: "Invoices",
  receipts: "Receipts",
};
