import { PStatus } from "./enums";

export interface BoardMissionFilters {
    signalrConnectionId?: string;
    stations?:[];
    createDate?:Date;
    clientId?: string;
    agentId?: string;
    search?: string;
    fromDate?: Date;
    toDate?: Date;
    productsIds?: string[];
    productionStatus?: PStatus;
    pageNumber: number | null; 
    pageSize: number | null;
}

export interface BoardMission {
    id: string;
    userId: string;
    boardMissionNumber: string;
    orderNumber: string;
    orderId: string;
    jobName: string;
    productName: string;
    productId: string;
    currentStation: {
        id: string;
        actionId: string;
        actionName: string;
        machineId: string | null;
        machineName: string | null;
        employeeId: string | null;
        isLastStation: boolean;
    };
    statusId: string;
    clientName: string;
    clientId: string;
    actionDueDate: Date ;
    dueDate: Date ;
    boardMissionCreatedDate: Date ;
    stationInDate: string;
    tags: any; 
    productItemValue: any; 
    automatedTags: any;
}