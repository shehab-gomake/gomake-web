import {IOutput} from "@/widgets/product-pricing-widget/interface";
import {EWorkSource} from "@/widgets/product-pricing-widget/enums";

export interface IBoardMissionsStation {
    actionId: string;
    actionIndex: number;
    actionName: string;
    boardMissionActionId: string;
    boardMissionActionTimer: IBoardMissionsStationTimer;
    dueDate: string;
    employeeId: string;
    employeeName: string;
    isDone: boolean;
    machineId: string;
    machineName: string;
    outputs: IOutput[];
    source: EWorkSource;
    index: number;
}

export interface IBoardMissionsStationTimer {
    isTimerRunning: boolean,
    totalRunningTime: number
}