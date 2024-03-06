import { atom, selector } from "recoil";
import {
  ICalculatedWorkFlow,
  ICalculationProgress,
  IExceptionsLog,
  IOutSourceSupplier,
  IPricingAction,
} from "@/widgets/product-pricing-widget/interface";

export const workFlowsState = atom<ICalculatedWorkFlow[]>({
  key: "workFlowsState",
  default: [],
});
export const calculationProgressState = atom<ICalculationProgress>({
  key: "calculationProgressState",
  default: { totalWorkFlowsCount: 0, currentWorkFlowsCount: 0 },
});
export const selectedWorkFlowState = selector<ICalculatedWorkFlow>({
  key: "selectedWorkFlowState",
  get: ({ get }) => {
    const workFlows = get(workFlowsState);
    return workFlows?.find((flow) => flow.selected);
  },
});
export const jobDetailsState = atom<any[]>({
  key: "jobDetailsState",
  default: [
    { title: "Title1", value: "Value1" },
    { title: "Title2", value: "Value2" },
    { title: "Title3", value: "Value3" },
    { title: "Title4", value: "Value4" },
    { title: "Title5", value: "Value5" },
    { title: "Title6", value: "Value6" },
  ],
});
export const jobActionsState = atom<IPricingAction[]>({
  key: "jobActionsState",
  default: [],
});
export const outsourceSuppliersState = atom<IOutSourceSupplier[]>({
  key: "outsourceSuppliersState",
  default: [],
});

export const itemParametersValuesState = atom<any[]>({
  key: "itemParametersValuesState",
  default: [],
});

export const productUrgentWorkState = atom<boolean>({
  key: "productUrgentWorkState",
  default: false,
});

export const currentProductItemValueState = atom<any>({
  key: "currentProductItemValueState",
  default: null,
});
export const currentProductItemValuePriceState = atom<number>({
  key: "currentProductItemValuePriceState",
  default: null,
});
export const currentProductItemValueTotalWorkFlowsState = atom<number>({
  key: "currentProductItemValueTotalWorkFlowsState",
  default: 0,
});
export const currentProductItemValueDraftId = atom<string>({
  key: "currentProductItemValueDraftId",
  default: null,
});
export const calculationExceptionsLogsState = atom<IExceptionsLog[]>({
  key: "calculationExceptionsLogsState",
  default: [],
});
