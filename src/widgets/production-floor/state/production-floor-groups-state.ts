import {atom} from "recoil";
import {
    IProductionFloorGroupData,
    IUserProductionFloorGroup
} from "@/widgets/production-floor/interfaces/production-floor-group";

export const productionFloorGroupsState = atom<IProductionFloorGroupData[]>({
    default: [],
    key: 'productionFloorGroupsState'
})
export const userProductionFloorGroupsState = atom<IUserProductionFloorGroup[]>({
    default: [],
    key: 'userProductionFloorGroupsState'
})