
export interface IBoard {
    id: string;
    userId: string;
    boardMissionNumber: string;
    orderNumber: string;
    jobName: string;
    productName: string;
    productId: string;
    currentStation: ICurrentStation;
    statusId: string;
    clientName: string;
    clientId: string;
    actionDueDate: string;
    dueDate: string;
    boardMissionCreatedDate?: string;
    stationInDate: string;
    tags: string[];
    productItemValue: any;
    orderId?: string;
    workOrder?: string;
    startDate?: string;
    checked?: boolean;
}

export interface ICurrentStation {
    id: string;
    actionId?: string;
    machineId?: string;
    employeeId?: string;
    actionName: string;
    isLastStation: boolean;
    machineName: string;
}

export interface IProductionStatus {
    count: number;
    boardMissionStatus: {
        id: string;
        name: string;
        key: string;
        index: number,
        textColor: string;
        backgroundColor: string
        checked?: boolean;
        count?:number;
    }
}

export interface IProductionFloorFilter {
    userId?: string;
    stationId?: string[];
    employeeId?: string[];
    fromCreateDate?: Date;
    toCreateDate?: Date;
    fromDeliveryTime?: Date;
    toDeliveryTime?: Date;
    statusIds?: string[];
}

export interface IActionMachinesList {
    actionId: string;
    actionName: string;
    machines: {
        machineId: string;
        machineName: string;
    }[];
}

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
}

