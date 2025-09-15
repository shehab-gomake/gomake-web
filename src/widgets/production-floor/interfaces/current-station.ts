export interface ICurrentStation {
  id: string;
  actionId?: string;
  machineId?: string;
  employeeId?: string;
  actionName: string;
  isLastStation: boolean;
  machineName: string;
  productType: string;
  totalProductionTime?: number;
  totalProductionTimeForAllStations?: number;
  supplierId?: string;
  supplierName?: string;
}
