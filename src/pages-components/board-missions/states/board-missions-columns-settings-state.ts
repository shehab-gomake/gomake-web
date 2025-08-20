import { ColumnSetting } from "@/widgets/production-floor/state/production-floor-coulmns-table-settings";
import { atomFamily } from "recoil";

export const jobsColumnKeys: Record<string, string[]> = {
  boardMissions: [
    "image",
    "creationDate",
    "dueDate",
    "clientName",
    "missionNumber",
    "relatedDocuments",
    "purchaseNumber",
    "outSourceType",
    "quantity",
    "costFromOrderItem",
    "priceFromOrderItem",
    "isPrinted",
    "jobName",
    "numberOfBoardMissionsInOrder",
    "productName",
    "currentBoardMissionStatus",
    "more",
  ],
  purchaseJobs: [
    "creationDate",
    "dueDate",
    "clientName",
    "supplierName",
    "missionNumber",
    "orderNumber",
    "purchaseOrderNumber",
    "outSourceType",
    "quantity",
    "outSourceCost",
    "priceFromOrderItem",
    "jobName",
    "numberOfBoardMissionsInOrder",
    "productName",
    "currentBoardMissionStatus",
    "more",
  ],
};

export const jobsColumnWidthsMap: Record<string, Record<string, string>> = {
  boardMissions: {
    image: "7%", // 1
    creationDate: "7%", // 2
    dueDate: "6%", // 3
    clientName: "6%", // 4
    missionNumber: "7%", // 5
    relatedDocuments: "7%", // 6
    purchaseNumber: "7%", // 6
    outSourceType: "8%", // 7
    quantity: "7%", // 8
    costFromOrderItem: "4%", // 9 (conditional)
    priceFromOrderItem: "6%", // 10 (conditional)
    isPrinted: "5%", // 11 (conditional)
    jobName: "12%", // 12
    numberOfBoardMissionsInOrder: "7%", // 13
    productName: "7%", // 14
    currentBoardMissionStatus: "13%", // 15
    more: "3%", // 16
  },
  purchaseJobs: {
    creationDate: "7%", // 1
    dueDate: "5%", // 2
    clientName: "6%", // 3
    supplierName: "7%", // 4
    missionNumber: "6%", // 5
    orderNumber: "7%", // 6
    purchaseOrderNumber: "11%", // 7
    outSourceType: "8%", // 8
    quantity: "6%", // 9
    outSourceCost: "8%", // 10
    priceFromOrderItem: "5%", // 11
    jobName: "5%", // 12
    numberOfBoardMissionsInOrder: "7%", // 13
    productName: "7%", // 14
    currentBoardMissionStatus: "4%", // 15
    more: "2%", // 16
  },
};

export const getJobsCustomWidth = (
  tableKey: string,
  columnKey: string
): string => {
  return jobsColumnWidthsMap[tableKey]?.[columnKey] ?? "auto";
};

/**
 * Parse saved column settings and handle new columns that weren't previously saved
 * New columns are positioned according to jobsColumnKeys order and default to visible: false (unchecked)
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

  // Simply use the jobsColumnKeys order as defined
  const order = [...allKeys];

  return { visibility, order };
};

export const columnVisibilityStateFamily = atomFamily<
  Record<string, boolean>,
  string
>({
  key: "jobsColumnVisibilityStateFamily",
  default: (tableKey) =>
    Object.fromEntries(jobsColumnKeys[tableKey].map((key) => [key, false])), // Default to false (unchecked)
});

export const columnOrderStateFamily = atomFamily<string[], string>({
  key: "jobsColumnOrderStateFamily",
  default: (tableKey) => jobsColumnKeys[tableKey],
});
