import { atom } from "recoil";

export const allColumnKeys = [
  "checkbox",
  "job_order",
  "creationDate",
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
  "changeMachineEmployee",
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
  job_order: "12%",
  creationDate: "7%",
  deliveryDate: "7%",
  totalTime: "7%",
  customer: "9%",
  agent: "9%",
  productName: "8%",
  description: "15%",
  notes: "18%",
  status: "11%",
  currentStation: "15%",
  nextStation: "12%",
  changeMachineEmployee: "12%",
  more: "2%",
};

// Mobile-specific column widths in pixels
export const mobileColumnWidthsMap: Record<string, string> = {
  checkbox: "48px",
  job_order: "120px",
  creationDate: "100px",
  deliveryDate: "100px",
  totalTime: "80px",
  customer: "100px",
  agent: "100px",
  productName: "120px",
  description: "200px",
  notes: "200px",
  status: "100px",
  currentStation: "150px",
  nextStation: "120px",
  changeMachineEmployee: "120px",
  more: "40px",
};

export const getCustomWidth = (
  key: string,
  isMobile: boolean = false
): string => {
  if (isMobile) {
    return mobileColumnWidthsMap[key] ?? "auto";
  }
  return columnWidthsMap[key] ?? "auto";
};
