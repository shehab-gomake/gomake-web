
export interface IBoardMissions {
    id: string;
    code: number;
    isReady?: boolean;
    isUrgent?: boolean;
    status: number;
    machinesStatuses: Record<string, number>,
    currentStation: IBoardMissionsCurrentStation;
}


export interface IBoardMissionsCurrentStation {
    machineId?: string;
    rowName: string;
}