import {atom} from "recoil";
import {IBoardMissionsActivity} from "@/widgets/production-floor/interfaces/board-missions-activity";

export const boardMissionsActivitiesState = atom<IBoardMissionsActivity[]>({
    key: '',
    default: []
})