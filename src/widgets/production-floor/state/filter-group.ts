import { atom } from "recoil";
import { IStationFilterGroup } from "../interfaces/borad-missions-filter-groups";

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
