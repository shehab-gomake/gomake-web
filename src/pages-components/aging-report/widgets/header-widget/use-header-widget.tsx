import { useTranslation } from "react-i18next";

import { useStyle } from "./style";

export interface AgingReportHeaderWidgetProps {
  onSelectDeliveryTimeDates: any;
  resetDatePicker: any;
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
  detailedReport: boolean,
  onChangeDetailedReport: any;
  onChangeByReferenceDate: any
}
const useAgingReportHeader = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation()
  return {
    clasess, t
  };
};

export { useAgingReportHeader };
