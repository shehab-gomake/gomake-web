import {atom} from "recoil";
import {IBoardMissionsStation} from "@/widgets/production-floor/views/board-missions-view/stations/interface";

export const boardMissionsStationsState = atom<IBoardMissionsStation[]>({
    default: [],
    key: 'boardMissionsStationsState'
});

export const stationGeneralInformationState = atom<{name: string; values: string[]}[]>({
    default: [],
    key: 'stationGeneralInformationState'
});
