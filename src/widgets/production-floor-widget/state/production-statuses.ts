import {atom} from "recoil";
import {IProductionStatus} from "@/widgets/production-floor-widget/interface";

export const productionStatusesState = atom<IProductionStatus[]>({
    key: "productionStatusesState",
    default: [],
});
