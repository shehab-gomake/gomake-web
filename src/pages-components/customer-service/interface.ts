import { Dispatch, SetStateAction } from "react";

export interface CreateIssueModalProps {
  openModal: boolean;
  ticketTypeList: TicketTypeList[];
  onClickClosModal: () => void;
  createIssue: () => void;
  ticketState: JiraIssueType;
  setTicketState: any;
  setFileBase64: any;
  handleSectionChange: any;
  createAnother?: any;
  handleCheckboxChange?: () => void;

  selectedSection: "" | Sections;
  setSelectedSection: Dispatch<SetStateAction<"" | Sections>>;
  selectedSubSection: string;
  setSelectedSubSection: Dispatch<SetStateAction<string>>;
  jiraImageUploadRef: any;

  printHouses: JiraPrintHouse[];
  onChangePrintHouse?: (e: any, value: string) => void;
  selectedPrintHouse?: any;
  isAdmin: boolean;
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
  section: string;
  subSection: string;
}

export interface JiraPrintHouse {
  // id: string;
  // name: string;
  // domain: string;

  value: string;
  label: string;
  domain: string;
}

export interface IIssuesHeaderSectionProps {
  isAdmin: boolean;
  printHouses: JiraPrintHouse[];
  onChangePrintHouse?: (e: any, value: string) => void;
  selectedPrintHouse?: any;
  handleClean?: () => void;
  statuses: any;
  onChangeStatus: any;
  selectedStatus: any;
  setPatternSearch: Dispatch<SetStateAction<string>>;
  patternSearch: string;
}
export interface TicketTypeList {
  label: string;
  value: string;
}

export type Sections =
  | "General"
  | "Sales"
  | "Purchase"
  | "Banks"
  | "Contacts"
  | "Reports"
  | "Materials, Machines, Actions"
  | "Settings";

export type SectionPages = {
  [key in Sections]: string[];
};
