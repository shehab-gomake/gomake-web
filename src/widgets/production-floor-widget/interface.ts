import {EStatus} from "@/widgets/production-floor-widget/components/status-btn";

export interface IBoard {
    id: string;
    currentStation: ICurrentStation;
    boardMissionNumber: string;
    orderNumber: string;
    orderId: string;
    jobName: string;
    productName: string;
    productId: string;
    clientName: string;
    clientId: string;
    statusId: EStatus;
    actionDueDate: Date;
    dueDate: Date;
    creationDate: Date;
    stationInDate: Date
    tags: string[];
    checked: boolean;
}

export interface ICurrentStation  {
    name: string;
    id: string;
    actionId: string;
    machineId: string;
    employeeId: string;
}