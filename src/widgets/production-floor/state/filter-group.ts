import { atom } from "recoil";
import { IStationFilterGroup } from "../interfaces/borad-missions-filter-groups";

export const stationFilterGroupState = atom<IStationFilterGroup>({
  key: "stationFilterGroupState",
  default: {
    name: "",
    stations: [],
  },
});
