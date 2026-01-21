import { ICurrentStation } from "@/widgets/production-floor/interfaces/current-station";
import { IProductionStatus } from "@/widgets/production-floor/interfaces/production-floor-status";
import { INextStation } from "./next-station";

export interface IBoardMissions {
  id: string;
  userId: string;
  boardMissionNumber: string;
  orderNumber: string;
  jobName: string;
  agentName: string;
  productName: string;
  productId: string;
  jobDeliveryTimeAlertColor?: string;
  currentStation: ICurrentStation;
  nextStation: INextStation | null;
  statusId: string;
  clientName: string;
  clientId: string;
  actionDueDate: string;
  dueDate: string;
  boardMissionCreatedDate?: string;
  stationInDate: string;
  tags: string[];
  productItemValue: any;
  orderId?: string;
  workOrder?: string;
  startDate?: string;
  checked?: boolean;
  automatedTags: string[];
  productType: string;
  nextBoardMission?: IBoardMissionStep;
  previousBoardMission?: IBoardMissionStep;
  priority: number;
  showGraphicsApprovalAlert: 0 | 1 | 2;
  isUrgentWork: boolean;
  productionFloorJobColor?: string;
  currentStationColor?: string;
  numberOfJobsInOrder?: number | string;
  description?: string;
  sectionName?: string;
  isNeedExample?: boolean;
  noteColumn?: string;
  quantity?: number;
  storage?: string;
}

export interface IBoardMissionsDetails {
  boardMissionId: string;
  boardMissionNumber: string;
  orderId: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientId: string;
  productName: string;
  productId: string;
  agentId?: string;
  agentName: string;
  boardMissionImage: string;
  isNeedExample: boolean;
  isUrgentWork?: boolean;
  isRepetitiveWork?: boolean;
  dueDate?: string;
  createdDate?: Date;
  boardMissionStatus: IProductionStatus;
  currentBoardMissionActionId: string;
  currentActionName: string;
  currentMachineName: string;
  orderItemId: string;
  notes: string[];
  noteValues: { noteType: number; name: string | null; value: string }[];
  filesPath: string;
  graphicsFilePath?: string;
  productType: string;
  sectionName: string;
  clientTypeId: string;
  quantity?: number;
  isReady: boolean;
  productionFloorJobColor?: string;
  showGraphicsApprovalAlert?: 0 | 1 | 2;
  currentStation?: any;
  contactName?: string;
  isHaveDelivery?: boolean;
  qualityIssueReason?: string;
  exampleType?: number;
}

export interface IBoardMissionStep {
  boardMissionId: string;
  productType: string;
  clientName: string;
  productName: string;
  boardMissionNumber: string;
  orderNumber: string;
}
