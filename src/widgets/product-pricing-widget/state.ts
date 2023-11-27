import {atom} from "recoil";
import {ICalculatedWorkFlow, IOutSourceSupplier, IPricingAction} from "@/widgets/product-pricing-widget/interface";
import {EOutsourceSupplierStatus} from "@/widgets/product-pricing-widget/enums";

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

export const printHouseSuppliersState = atom<{ label: string, value: string }[]>({
    key: "printHouseSuppliersState",
    default: [],
});
export const outsourceSuppliersState = atom<IOutSourceSupplier[]>({
    key: "outsourceSuppliersState",
    default: [
        {
            supplierId: "462c3301-1358-4ca8-9b16-061cd6177416",
            supplierName: "Top print",
            cost: 100,
            finalPrice: 200,
            profit: 100,
            workHours: 11,
            status: EOutsourceSupplierStatus.NeedApprove
        },
        {
            supplierId: "cb9d28b5-2d6e-4381-b118-319133669fd7",
            supplierName: "Digital Print",
            cost: 120,
            finalPrice: 200,
            profit: 80,
            workHours: 11,
            status: EOutsourceSupplierStatus.Approved
        },
        {
            supplierId: "3dc7754e-e6d5-4833-9ac7-43cf7d30170e",
            supplierName: "Elinir Print",
            cost: 140,
            finalPrice: 200,
            profit: 240,
            workHours: 11,
            status: EOutsourceSupplierStatus.Manually
        }
    ],
});

