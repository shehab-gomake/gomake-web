export interface IBoardMissionStation {
    id: string;
    boardMissionId: string;
    actionId: string;
    machineId: string | null;
    employeeId: string | null;
    index: number;
    isDone: boolean;
    inDate: string;
    outDate: string;
    inUserId: string;
    dueDate: string;
    outUserId: string;
    statusId: string;
    actionName: string;
    isLastStation: boolean;
}


