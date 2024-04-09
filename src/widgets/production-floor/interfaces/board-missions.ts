import {ICurrentStation} from "@/widgets/production-floor/interfaces/current-station";
import {IProductionStatus} from "@/widgets/production-floor/interfaces/production-floor-status";

export interface IBoardMissions {
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
    automatedTags: string[]
}

export interface IBoardMissionsDetails {
    boardMissionId: string;
    boardMissionNumber: string;
    orderId: string;
    orderNumber: string;
    clientName: string;
    clientId: string;
    productName: string;
    productId: string;
    agentId?: string
    agentName: string
    boardMissionImage: string;
    dueDate?: string
    createdDate?: Date
    boardMissionStatus: IProductionStatus;
    currentBoardMissionActionId: string;
    currentActionName: string;
    currentMachineName: string;
}