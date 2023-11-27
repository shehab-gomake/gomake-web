export interface IBordMission {
    id: string;
    boardMissionId: string;
    boardMissionNumber: string;
    orderId: string;
    orderNumber: string;
    clientName: string;
    clientId: string;
    productName: string;
    productId: string;
    agentName: string;
    currentBoardMissionActionId: string;
    currentActionName: string;
    statusId: string;
    imageUrl: string;
    tags: IPrintHouseTag[];
    generalDetails: IGeneralDetail[];
    missionActions: IMissionAction[];
    activities: IBoardMissionActivity[];
}
export interface IPrintHouseTag {
    id: string;
    text: string;
}
export interface IGeneralDetail {
    name: string;
    value: string;
}
interface IMissionAction {
    actionId: string;
    boardMissionActionId: string;
    actionName: string;
    machineId: string;
    employeeId: string | null;
    employeeName: string;
    deliveryTime: Date;
    inDate: Date;
    actionStatus: EActionStatusEnum;
    parameters: IBoardMissionActionParams[];
}

interface IBoardMissionActionParams {
    name: string;
    value: string;
}

interface IBoardMissionActivity {
    text: string;
    userName: string;
    activityType: EActivityTypeEnum;
    date: Date;
}

enum EActionStatusEnum {
    NOTYET = 1,
    PROCESS = 2,
    DONE = 3,}

enum EActivityTypeEnum {
    COMMENT  = 1,
    LOG,
    CUSTOMER
}