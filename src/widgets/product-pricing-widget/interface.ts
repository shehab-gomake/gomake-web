import {
    EOutsourceSupplierStatus,
    EWorkSource,
    HtmlElementType,
    RuleType,
    UnitType
} from "@/widgets/product-pricing-widget/enums";

export interface IPricingWidgetProps {
    jobDetails?: string;
    actions: IPricingAction[];
    workFlows: ICalculatedWorkFlow[];
    onSelectNewWorkFlow?: (id: string) => void;
    getOutSourcingSuppliers: () => void;
}


export interface IPricingAction {
    actionId: string;
    machineCategories: IPricingMachineCategory[]
}

export interface IPricingMachineCategory {
    machineCategoryId: string;
    machines: IPricingMachine[];
}

export interface IPricingMachine {
    machineId: string;
    machineName: string;
}

export interface ICalculatedWorkFlow {
    id: string
    generalInformation: IOutput[];
    selected: boolean;
    actions: IWorkFlowAction[];
    printActionTypeDTOs?: IPrintActionType[];
    totalCost: IOutput;
    profit: IOutput;
    totalPrice: IOutput;
    totalRealProductionTime: IOutput;
    recommendationRang: {
        deliveryTime: number;
        price: number;
        profit: number;
        deliveryTimePercent: number;
        pricePercent: number;
        profitPercent: number;
    }
}

export interface IPrintActionType {
    inSource: IWorkFlowAction;
    outSource: IWorkFlowAction;
}

export interface IWorkFlowAction {
    actionId: string;
    actionName: string;
    mongoDBMachineId: string;
    machineName: string;
    categoryId: string;
    profit: IOutput;
    totalPrice: IOutput;
    totalCost: IOutput;
    totalProductionTime: IOutput;
    outputs: IOutput[];
    source?: EWorkSource;
    supplierId?: string;


}

export interface IOutput {
    name: string;
    values: string[];
    id: string;
    unitType: UnitType;
    defaultUnit: string;
    propertyType: RuleType;
    htmlElementType: HtmlElementType;
    isEditable: boolean;
    outSourceValues: string[];

}

export interface IOutSourceSupplier {
    supplierId: string;
    supplierName: string;
    cost: number;
    finalPrice: number;
    profit: number;
    workHours: number;
    status: EOutsourceSupplierStatus;
}