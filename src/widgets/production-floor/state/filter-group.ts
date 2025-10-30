import { atom } from "recoil";
import {
  IFilterGroupsList,
  IStationFilterGroup,
} from "../interfaces/borad-missions-filter-groups";

export const stationFilterGroupState = atom<IStationFilterGroup>({
  key: "stationFilterGroupState",
  default: {
    name: "",
    color: "#8485C0",
    stations: [],
  },
});

export const selectedGroupIdState = atom<string>({
  key: "selectedGroupIdState",
  default: "",
});

export const filterGroupsState = atom<IFilterGroupsList[]>({
  key: "filterGroupsState",
  default: [],
});

export const allBoardMissionsState = atom<any[]>({
  key: "allBoardMissionsState",
  default: [],
});

export const pageNumberState = atom<number>({
  key: "pageNumberState",
  default: 1,
});

export const pageSizeState = atom<number>({
  key: "pageSizeState",
  default: 10,
});

// Current sort order for Done Jobs table (persists across filters/searches)
export const currentSortOrderState = atom<any>({
  key: "done-jobs-current-sort-order",
  default: [
    {
      column: 2, // ReadyDate
      dir: "desc",
    },
  ],
});

export const pagesCountState = atom<number>({
  key: "pagesCountState",
  default: 0,
});

export const finalPatternSearchState = atom<string>({
  key: "finalPatternSearchState",
  default: "",
});

export const patternSearchState = atom<any>({
  key: "patternSearchState",
  default: null,
});
