import {atom} from "recoil";
import {
    IStatusesBoardsMissions
} from "@/widgets/production-floor/interfaces/production-floor-data-response";

export const productionFloorDataState = atom<IStatusesBoardsMissions[]>({
    default: [],
    key: 'productionFloorDataState'
})