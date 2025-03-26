import { atom } from "recoil";

export const loadingGanttItemId = atom<string>({
  key: "loadingGanttItemId",
  default: "",
});

export enum TimeFrameTabs {
  HOUR = 0,
  DAY = 1,
  WEEK = 2,
  MONTH = 3,
  YEAR = 4,
}
