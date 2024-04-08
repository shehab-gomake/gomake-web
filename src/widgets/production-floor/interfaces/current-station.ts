export interface ICurrentStation {
    id: string;
    actionId?: string;
    machineId?: string;
    employeeId?: string;
    actionName: string;
    isLastStation: boolean;
    machineName: string;
}
