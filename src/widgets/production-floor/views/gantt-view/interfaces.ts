import moment from "moment";

export interface IGanttGroup {
  id: string;
  isRoot: boolean;
  parent: string;
  title: string;
}

export interface IGanttJob {
  id: string;
  boardMissionId: string;
  group: string;
  title: string;
  start_time: moment.Moment;
  end_time: moment.Moment;
  bgColor: string;
  statusColor: string;
  isEditable: boolean;
  selected?: boolean;
  isHasSelected?: boolean;
  orderNumber: string;
  productName: string;
  // boardMissionNumber: string;
  jobNumber: string;
  clientName: string;
  productType: string;
  numberOfJobsInOrder?: number | string;
}
