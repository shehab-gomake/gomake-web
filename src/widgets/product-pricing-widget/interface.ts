import {EWorkSource, HtmlElementType, RuleType, UnitType} from "@/widgets/product-pricing-widget/enums";

export interface IPricingWidgetProps {
    jobDetails?: string;
    actions: IPricingAction[];
    workFlows: ICalculatedWorkFlow[];
    onSelectNewWorkFlow?: (id: string) => void
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
    totalCost: number;
    generalInformation: IOutput[];
    totalProductionTime: number;
    totalRealProductionTime: number;
    totalPrice: number;
    selected: boolean;
    actions: IWorkFlowAction[];
    printActionTypeDTOs?: IPrintActionType[];
    totalCostO: IOutput;
    profitO: IOutput;
    totalPriceO: IOutput;
    totalRealProductionTimeO: IOutput;
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
    profit: number;
    profitO: IOutput;
    totalPrice: number;
    totalPriceO: IOutput;
    totalCost: number;
    totalCostO: IOutput;
    totalProductionTime: number;
    totalRealProductionTime: number;
    totalRealProductionTimeO: IOutput;
    outputs: IOutput[];
    source?: EWorkSource;

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
    outSourceValues?: string[];
    supplierId?: string;

}