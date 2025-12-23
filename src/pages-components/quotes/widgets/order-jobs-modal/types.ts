export interface OrderJob {
  jobNumber: string;
  station: {
    id: string;
    actionId: string;
    actionName: string;
    machineId: string | null;
    productType: string;
    machineName: string;
    employeeName: string;
    employeeId: string;
    supplierId: string | null;
    supplierName: string;
    workFlowActionId: string;
    isLastStation: boolean;
    totalProductionTime: number;
    totalProductionTimeForAllStations: number | null;
  };
  boardMissionStatus: {
    name: string;
  } | null;
  isReady: boolean;
  orderStatus: number;
  storage?: string;
}
