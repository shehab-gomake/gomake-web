export interface CreateIssueModalProps {
  isAdmin: boolean;
  openModal: boolean;
  ticketType: TicketTypeList | undefined;
  ticketTypeList: TicketTypeList[];
  title: string;
  description: string;
  setDescription: (description: string) => void;
  setTitle: (title: string) => void;
  setTicketType: (ticketType: TicketTypeList | undefined) => void;
  onClickClosModal: () => void;
  createIssue: () => void;
  onChangeInputs: (e: any, value: any) => void;
  ticketState: JiraIssueType;
  setTicketState: any;
}
export interface JiraIssueType {
  isAdmin: boolean;
  openModal: boolean;
  ticketType: TicketTypeList | undefined;
  ticketTypeList: TicketTypeList[];
  title: string;
  description: string;
  screenShot: string;
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
