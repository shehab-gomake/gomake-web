import {ICurrentStation} from "@/widgets/production-floor/interfaces/current-station";

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