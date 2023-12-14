export interface Parameter {
    name: string;
    values: string[] | null;
}

export interface MissionAction {
    actionId: string;
    boardMissionActionId: string;
    actionName: string;
    machineId: string | null;
    machineName: string;
    employeeId: string | null;
    employeeName: string | null;
    deliveryTime: string;
    inDate: string | null;
    actionStatus: number;
    parameters: Parameter[] | null;
}

export interface IBoardMissions {
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
    tags: any;
    generalDetails: any;
    missionActions: MissionAction[];
    activities: any;
}