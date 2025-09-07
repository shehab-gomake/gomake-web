export interface IReschedulingChanges {
  NewEmployeeId?: string;
  NewMachineId?: string;
  NewStartTime?: string;
  NewEndTime?: string;
}

export interface IReschedulingAction {
  actionId: string;
  machineId?: string;
  employeeId?: string;
  boardMissionId: string;
  type: number; // ReschedulingType enum value
  changes: IReschedulingChanges;
  reason: string;
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
}
