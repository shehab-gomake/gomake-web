import { useTranslation } from "react-i18next";

import { useStyle } from "./style";

export interface SalesReportHeaderWidgetProps {
  onSelectDeliveryTimeDates: any;
  resetDatePicker: any;
  agent: any;
  agentsCategories: any[];
  handleAgentChange: any;
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
  detailedReport: boolean,
  onChangeDetailedReport: any;
}
const useSalesReportHeader = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation()
  return {
    clasess, t
  };
};

export { useSalesReportHeader };
