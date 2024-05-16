import {atom, selector} from "recoil";
import {
    IStatusesBoardsMissions
} from "@/widgets/production-floor/interfaces/production-floor-data-response";
import {IBoardMissionsDetails} from "@/widgets/production-floor/interfaces/board-missions";

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

export const selectedBoardsMissionsState = atom<{boardMissionId: string, productType: string}[]>({
    default: [],
    key: 'selectedBoardsMissionsState'
});

export const boardMissionsDetailsState = atom<IBoardMissionsDetails>({
    default: {} as IBoardMissionsDetails,
    key: 'boardMissionsDetailsState'
})