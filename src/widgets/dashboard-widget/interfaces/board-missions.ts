import {EMissionType} from "@/shared/enums/mission-type";

export interface IBoardMissions {
    id: string;
    code: string;
    isReady?: boolean;
    isUrgent?: boolean;
    status: number;
    machinesStatuses: Record<string, number>;
    missionType: EMissionType;
    currentStation: IBoardMissionsCurrentStation;
    boardId: string;
    orderNumber: string;
    productName:string;
    clientId: string;
    agentId: string;
    clientName: string;
    splittedBoards: IBoardMissions[];
    isLate: boolean;
    creationDate:Date;
    productType: string;
    productTypeName: string;
}


export interface IBoardMissionsCurrentStation {
    machineId?: string;
    rowName: string;
}