import { atom } from "recoil";

export const allColumnKeys = [
  "checkbox",
  "job_order",
  "deliveryDate",
  "totalTime",
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

export interface ColumnSetting {
  key: string;
  visible: boolean;
}

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

  // Simply use the allColumnKeys order as defined
  const order = [...allKeys];

  return { visibility, order };
};

export const columnWidthsMap: Record<string, string> = {
  checkbox: "3%",
  job_order: "13%",
  deliveryDate: "7%",
  totalTime: "7%",
  customer: "9%",
  agent: "9%",
  productName: "8%",
  description: "15%",
  notes: "13%",
  status: "11%",
  currentStation: "15%",
  nextStation: "12%",
  more: "2%",
};

export const getCustomWidth = (key: string): string => {
  return columnWidthsMap[key] ?? "auto";
};
