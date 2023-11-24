import { atom } from "recoil";
import {ICalculatedWorkFlow, IPricingAction} from "@/widgets/product-pricing-widget/interface";

export const workFlowsState = atom<ICalculatedWorkFlow[]>({
    key: "workFlowsState",
    default: [],
});

export const jobDetailsState = atom<any[]>({
    key: "jobDetailsState",
    default: [
        {title: "Title1", value: "Value1"},
        {title: "Title2", value: "Value2"},
        {title: "Title3", value: "Value3"},
        {title: "Title4", value: "Value4"},
        {title: "Title5", value: "Value5"},
        {title: "Title6", value: "Value6"},
    ],
});
export const jobActionsState = atom<IPricingAction[]>({
    key: "jobActionsState",
    default: [],
});
