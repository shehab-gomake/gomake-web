import {atom} from "recoil";
import {IBoardMissionsStation} from "@/widgets/production-floor/views/board-missions-view/stations/interface";

export const boardMissionsStationsState = atom<IBoardMissionsStation[]>({
    default: [],
    key: 'boardMissionsStationsState'
});

export const stationGeneralInformationState = atom<{name: string; values: string[]; defaultUnit: string; unitType: number}[]>({
    default: [],
    key: 'stationGeneralInformationState'
});

export const boardMissionsSubWorkFlowsState = atom({
    key: 'boardMissionsSubWorkFlowsState',
    default: []
});

export const isReadyBoardMissionsState = atom<boolean>({
    key: '',
    default: false
})