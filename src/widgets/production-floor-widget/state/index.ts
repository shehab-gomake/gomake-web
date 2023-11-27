import {atom} from "recoil";
import {IBoard} from "@/widgets/production-floor-widget/interface";
import {EStatus} from "@/widgets/production-floor-widget/components/status-btn";

export const workJobsState = atom<IBoard[]>({
    key: "workJobsState",
    default: [],
});
export const productionStatusesState = atom<{value: EStatus, text: string, checked: boolean, count: number}[]>({
    key: "statusesState",
    default: [],
});
