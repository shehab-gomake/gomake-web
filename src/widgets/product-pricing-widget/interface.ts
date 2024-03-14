import {
  ECalculationLogType,
  EOutsourceSupplierStatus,
  EWorkSource,
  HtmlElementType,
  RuleType,
  UnitType,
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
  machineCategories: IPricingMachineCategory[];
  productType: string | null;
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
  id: string;
  monials: number;
  generalInformation: IOutput[];
  selected: boolean;
  actions: IWorkFlowAction[];
  printActionTypeDTOs?: IPrintActionType[];
  totalCost: IOutput;
  profit: IOutput;
  totalPrice: IOutput;
  totalRealProductionTime: IOutput;
  subWorkFlows: ICalculatedWorkFlow[];
  sectionName?: string;
  recommendationRang: IRecommendationRang;
  productType: string | null;
  isCalculated: boolean;
  exceptions: any[];
}

export interface IPrintActionType {
  inSource: IWorkFlowAction;
  outSource: IWorkFlowAction;
}

export interface IWorkFlowAction {
  id:string;
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
  actionIndex: number;
  index: number;
  isCalculated: boolean;
  actionException: any;
  totalPriceValue: number;
  profitValue: number;
  totalCostValue: number;
  totalUIQuantity: number;
  materialQuantity: number;
  beatesQuantity: any;
  printArea: number;
  materialVolume: number;
  pagesQuantity?: number;
  totalBookletDelay?: number;
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
  materialWidth: number;
  materialLength: number;
  rectangles: IRectangle[];
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

export interface IRectangle {
  x: number;
  y: number;
  width: number;
  length: number;
  color?: string;
}
export interface ICalculationProgress {
  totalWorkFlowsCount: number;
  currentWorkFlowsCount: number;
}

export interface IRecommendationRang {
  deliveryTime: number;
  price: number;
  profit: number;
  deliveryTimePercent: number;
  pricePercent: number;
  profitPercent: number;
}

export interface IExceptionsLog{
    exceptionKey:string;
    title?:string;
    exceptionType?:ECalculationLogType
}