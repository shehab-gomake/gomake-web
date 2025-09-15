export interface IReschedulingChanges {
  newEmployeeId?: string;
  newMachineId?: string;
  newStartTime?: string;
  newEndTime?: string;
}

export interface IReschedulingAction {
  actionId: string;
  machineId?: string;
  employeeId?: string;
  boardMissionId: string;
  type: number; // ReschedulingType enum value
  changes: IReschedulingChanges;
  reason: string;
  productType?: string; // Optional product type
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
