import {IProductionStatus} from "@/widgets/production-floor/interfaces/production-floor-status";
import {IBoardMissions} from "@/widgets/production-floor/interfaces/board-missions";
import {IProductionFloorFilter} from "@/widgets/production-floor/interfaces/filters";

export interface IProductionFloorData {
    filter: IProductionFloorFilter,
    boardMissionsCollections: IStatusesBoardsMissions[];
}

export interface IStatusesBoardsMissions {
    boardMissionStatus: {
        boardMissionStatus: IProductionStatus;
        count: number;
    };
    boardMissions: IBoardMissions[];
}