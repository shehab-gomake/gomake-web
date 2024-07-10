export interface CreateIssueModalProps {
  openModal: boolean;
  ticketTypeList: TicketTypeList[];
  onClickClosModal: () => void;
  createIssue: () => void;
  ticketState: JiraIssueType;
  setTicketState: any;
  setFileBase64: any;
}
export interface JiraIssueType {
  isAdmin: boolean;
  openModal: boolean;
  ticketType: TicketTypeList | undefined;
  ticketTypeList: TicketTypeList[];
  title: string;
  description: string;
  screenShot: string;
  gomakeRouteUri: string;
}
export interface JiraPrintHouse {
  id: string;
  name: string;
  domain: string;
}

export interface IissuesHeaderSectionProps {
  isAdmin: boolean;
  printHouses: JiraPrintHouse[];
  onChangePrintHouse?: (e: any, value: string) => void;
  selectedPrintHouseName?: string;
  handleClean?: () => void;
  statuses: any;
  onChangeStatus: any;
  selectedStatus: any;
  statusKey: string;
}
export interface TicketTypeList {
  label: string;
  value: string;
}
