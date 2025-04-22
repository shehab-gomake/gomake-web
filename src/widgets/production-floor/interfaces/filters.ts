export interface IProductionFloorFilter {
  userId?: string;
  stations: IStation[];
  employeeId?: string[];
  fromCreateDate?: Date;
  toCreateDate?: Date;
  fromDeliveryTime?: Date;
  toDeliveryTime?: Date;
  statusIds?: string[];
  automatedTags?: string[];
  employeeIds: null;
  pageNumber: number;
  customSearchFilters: null;
  groups: IFilterGroup[];
  groupsHistory: IFilterGroup[];
  groupId: string;
  agentIds?: string[];
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
