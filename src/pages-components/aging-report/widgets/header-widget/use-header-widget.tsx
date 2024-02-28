import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { useStyle } from "./style";

export interface AgingReportHeaderWidgetProps {
  getAllCustomersCreateQuote: () => void;
  getAgentCategories: (arg: boolean) => void;
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
  setDetailedReport: any
  onChangeDetailedReport: any;
  onChangeByReferenceDate: any
}
const useAgingReportHeader = ({ getAllCustomersCreateQuote, getAgentCategories }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation()

  useEffect(() => {
    getAllCustomersCreateQuote();
    getAgentCategories(true);
  }, []);

  return {
    clasess, t
  };
};

export { useAgingReportHeader };
