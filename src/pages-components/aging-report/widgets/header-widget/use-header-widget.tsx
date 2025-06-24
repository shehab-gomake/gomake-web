import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { CLIENT_TYPE } from "@/pages/customers/enums";

export interface AgingReportHeaderWidgetProps {
  handleClickSelectDate: () => void;
  selectDate: string | null;
  setSelectDate: (date: string) => void;
  dateRef: React.RefObject<HTMLInputElement>;
  agent: any;
  agentsCategories: any[];
  handleAgentChange: any;
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
  detailedReport: boolean;
  onChangeDetailedReport: any;
  onChangeByReferenceDate: any;
  handleDateChange?: any;
  fromDate?: Date | null;
  toDate?: Date | null;
  isFetchingCustomers?: boolean;
  supplierList?: any[];
  isPurchaseReport?: boolean;
  setFromDate?: any;
  setToDate?: any;
}
const useAgingReportHeader = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  return {
    classes,
    t,
  };
};

export { useAgingReportHeader };
