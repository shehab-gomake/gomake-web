import { atom, selector } from "recoil";
import { IStatusesBoardsMissions } from "@/widgets/production-floor/interfaces/production-floor-data-response";
import {
  IBoardMissions,
  IBoardMissionsDetails,
} from "@/widgets/production-floor/interfaces/board-missions";
import {IProductionStatus} from "@/widgets/production-floor/interfaces/production-floor-status";

export const boardsMissionsState = atom<IStatusesBoardsMissions[]>({
  key: "boardsMissionsState",
  default: [],
});
export const jobsStatusesState = atom<IProductionStatus[]>({
  key: "jobsStatusesState",
  default: [],
});

export const statusesListState = atom<IProductionStatus[]>({
  key: "statusesListState",
  default: [],
});

export const productionFloorStatusesState = selector({
  key: "productionFloorStatusesState",
  get: ({ get }) => {
    const statues = get(jobsStatusesState);
    if(statues && statues.length > 0) {
      return statues;
    }
    const data = get(boardsMissionsState);
    return data?.map((status) => status.boardMissionStatus.boardMissionStatus);
  },
});

export const selectedBoardsMissionsState = atom<IBoardMissions[]>({
  default: [],
  key: "selectedBoardsMissionsState",
});

export const boardMissionsDetailsState = atom<IBoardMissionsDetails>({
  default: {} as IBoardMissionsDetails,
  key: "boardMissionsDetailsState",
});

export const getDataAbortController = atom<AbortController>({
  default: null,
  key: "getDataAbortControllerState",
});

export const storageListState = atom<any[]>({
  default: null,
  key: "storageListState",
});

export const selectedMissionsState = atom<any>({
  key: "selectedMissionsState",
  default: null,
});