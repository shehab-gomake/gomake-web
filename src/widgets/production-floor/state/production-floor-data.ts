import { atom } from "recoil";
import { IStatusesBoardsMissions } from "../interfaces/production-floor-data-response";

export const productionFloorDataState = atom<IStatusesBoardsMissions[]>({
  default: [],
  key: "productionFloorDataState",
});
