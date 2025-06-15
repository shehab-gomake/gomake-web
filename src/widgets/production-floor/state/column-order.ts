import { atom } from "recoil";

export const allColumnKeys = [
  "checkbox",
  "job_order",
  "deliveryDate",
  "customer",
  "agent",
  "productName",
  "description",
  "notes",
  "status",
  "currentStation",
  "nextStation",
  "more",
];

// Controls visibility (default = all visible)
export const columnVisibilityState = atom<Record<string, boolean>>({
  key: "columnVisibilityState",
  default: Object.fromEntries(allColumnKeys.map((k) => [k, true])),
});

// Controls ordering
export const columnOrderState = atom<string[]>({
  key: "columnOrderState",
  default: allColumnKeys,
});
