import { atom } from "recoil";
import { IBoardMissionsStation } from "@/widgets/production-floor/views/board-missions-view/stations/interface";

export const boardMissionsStationsState = atom<IBoardMissionsStation[]>({
  default: [],
  key: "boardMissionsStationsState",
});

export const stationGeneralInformationState = atom<
  { name: string; values: string[]; defaultUnit: string; unitType: number }[]
>({
  default: [],
  key: "stationGeneralInformationState",
});

export const stationGeneralInformationProductionFloorState = atom({
  default: {},
  key: "stationGeneralInformationProductionFloorState",
});

export const relatedOrderItemsComponentState = atom({
  default: [],
  key: "relatedOrderItemsComponentState",
});

export const boardMissionsSubWorkFlowsState = atom({
  key: "boardMissionsSubWorkFlowsState",
  default: [],
});

export const isReadyBoardMissionsState = atom<boolean>({
  key: "",
  default: false,
});

export const isOrderCompletedState = atom<boolean>({
  key: "boardMissionsIsOrderCompletedState",
  default: false,
});

export const productionFloorSectionsState = atom({
  key: "productionFloorSectionsState",
  default: [],
});

export const productWorksTypesState = atom({
  key: "productWorksTypesState",
  default: [],
});

export const abortControllerStationState = atom({
  key: "abortControllerStationState",
  default: null,
});

export const abortControllerFilesState = atom({
  key: "abortControllerFilesState",
  default: null,
});

export const abortControllerActivitiesState = atom({
  key: "abortControllerActivitiesState",
  default: null,
});

export const getBoardMissionsByIdState = atom({
  key: "getBoardMissionsByIdState",
  default: null,
});

export const isPrintNodeModalOpenState = atom({
  key: "isPrintNodeModalOpenState",
  default: false,
});







