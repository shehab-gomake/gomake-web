import {EMissionType} from "@/shared/enums/mission-type";

export interface IBoardMissions {
    id: string;
    code: number;
    isReady?: boolean;
    isUrgent?: boolean;
    status: number;
    machinesStatuses: Record<string, number>;
    missionType: EMissionType;
    currentStation: IBoardMissionsCurrentStation;
}


export interface IBoardMissionsCurrentStation {
    machineId?: string;
    rowName: string;
}