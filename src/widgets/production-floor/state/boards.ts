import {atom, selector} from "recoil";
import {
    IStatusesBoardsMissions
} from "@/widgets/production-floor/interfaces/production-floor-data-response";

export const boardsMissionsState = atom<IStatusesBoardsMissions[]>({
    key: 'boardsMissionsState',
    default: []
});

export const productionFloorStatusesState = selector({
    key: 'productionFloorStatusesState',
    get: ({get}) => {
        const data = get(boardsMissionsState);
        return data?.map(status => status.boardMissionStatus.boardMissionStatus);
    }
})

export const selectedBoardsMissionsState = atom<string[]>({
    default: [],
    key: 'selectedBoardsMissionsState'
})