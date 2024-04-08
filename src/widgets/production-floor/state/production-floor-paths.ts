import {atom} from "recoil";
import {IProductionFloorPath} from "@/widgets/production-floor/interfaces/production-floor-path";

export const productionFloorPathsState = atom<IProductionFloorPath[]>({
    default: [],
    key: 'productionFloorPathsState'
})