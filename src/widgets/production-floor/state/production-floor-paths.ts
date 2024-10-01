import { atom } from "recoil";
import { IProductionFloorPath } from "../interfaces/production-floor-path";

export const productionFloorPathsState = atom<IProductionFloorPath[]>({
  default: [],
  key: "productionFloorPathsState",
});
