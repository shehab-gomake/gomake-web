import {IBoardMissions} from "@/widgets/dashboard-widget/interfaces";
import {IMachine} from "@/shared/interfaces";

export interface IBoardMissionsTable {
    boardsMissions: IBoardMissions[];
    usedMachines: IMachine[];
}