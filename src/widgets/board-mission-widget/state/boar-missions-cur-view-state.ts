import {atom} from "recoil";
import {EBoardMissionsViews} from "@/widgets/board-mission-widget/enums";

export const boarMissionsCurViewState = atom<EBoardMissionsViews>({
    key: 'boarMissionsViewsState',
    default: EBoardMissionsViews.STATIONS
})