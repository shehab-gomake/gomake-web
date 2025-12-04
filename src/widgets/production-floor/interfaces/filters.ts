import { CurrentStationOrderingEnum } from "@/enums";

export interface IProductionFloorFilter {
  userId?: string;
  stations: IStation[];
  employeeId?: string[];
  fromCreateDate?: string;
  toCreateDate?: string;
  fromDeliveryTime?: string;
  toDeliveryTime?: string;
  fromEstimatedProductionTime?: string;
  toEstimatedProductionTime?: string;
  statusIds?: string[];
  automatedTags?: string[];
  employeeIds: null;
  pageNumber: number;
  customSearchFilters: null;
  groups: IFilterGroup[];
  groupsHistory: IFilterGroup[];
  groupId: string;
  agentIds?: string[];
  isFirstLoading?: boolean;
  currentStationOrdering?: CurrentStationOrderingEnum;
  deliveryTimeOrdering?: CurrentStationOrderingEnum;
  createDateOrdering?: CurrentStationOrderingEnum;
}

export interface IStation {
  actionId: string;
  actionName?: string;
  machineIds: string[];
  machineNames?: string[];
  machineStatuses?: string[];
}

export interface IFilterGroup {
  groupId: string;
  value: string;
  valueId: string;
}
