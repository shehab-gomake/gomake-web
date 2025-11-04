import { BoardMissionStatusForFilter } from "./enums";

export interface BoardMissionsStatusFilterItem {
  boardMissionIds: string[];
  status: number; // 0 = inProcess, 1 = done, 2 = reported
}

export interface BoardMissionFilters {
  signalrConnectionId?: string;
  stations?: [];
  createDate?: Date;
  clientId?: string;
  agentId?: string;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  productsIds?: string[];
  productionStatus?: BoardMissionStatusForFilter;
  pageNumber: number | null;
  pageSize: number | null;
  boardMissionsIds?: string[];
  boardMissionsStatusFilter?: BoardMissionsStatusFilterItem[];
}

export interface BoardMission {
  id: string;
  userId: string;
  boardMissionNumber: string;
  orderNumber: string;
  orderId: string;
  jobName: string;
  productName: string;
  productId: string;
  currentStation: {
    id: string;
    actionId: string;
    actionName: string;
    machineId: string | null;
    machineName: string | null;
    employeeId: string | null;
    isLastStation: boolean;
  };
  statusId: string;
  clientName: string;
  clientId: string;
  actionDueDate: Date;
  dueDate: Date;
  boardMissionCreatedDate: Date;
  stationInDate: string;
  tags: any;
  productItemValue: any;
  automatedTags: any;
}
