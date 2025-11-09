export interface IReschedulingChanges {
  newEmployeeId?: string;
  newMachineId?: string;
  newStartTime?: string;
  newEndTime?: string;
}

export interface IReschedulingAction {
  boardMissionId: string;
  productType?: string; // Optional product type
  actionId: string;
  machineId?: string;
  employeeId?: string;
  newEmployeeId?: string;
  newMachineId?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}

export interface IReschedulingRequest {
  actions: IReschedulingAction[];
}

export interface ILocalReschedulingChange {
  actionId: string;
  boardMissionId: string;
  originalEmployeeId?: string;
  originalMachineId?: string;
  originalStartTime?: string;
  originalEndTime?: string;
  newEmployeeId?: string;
  newMachineId?: string;
  newStartTime?: string;
  newEndTime?: string;
  type: number;
  reason?: string;
  isModified: boolean;
  productType?: string; // Optional product type
}
