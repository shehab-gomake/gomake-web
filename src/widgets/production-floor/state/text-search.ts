import { atom } from "recoil";

export const productionFloorTextSearchState = atom<string>({
  key: "textSearchState",
  default: "",
});

export const selectedChipIdsState = atom({
  key: "selectedChipIdsState",
  default: [],
});

export const filteredMissionsStateBySearch = atom({
  key: "filteredMissionsStateBySearch",
  default: [],
});

export const missionsListState = atom<any>({
  key: "missionsListState",
  default: [],
});

export const searchLoadingState = atom<boolean>({
  key: "searchLoadingState",
  default: false,
});
