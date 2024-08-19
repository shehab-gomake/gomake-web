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
  displayByGroups: boolean,
  onChangeDisplayByGroups: any;
  documentsTypeList: any,
  handleDocumentTypeChange: any,
  documentType: any,
}
const useSalesReportHeader = () => {
  const { classes } = useStyle();
  const { t } = useTranslation()
  return {
    classes, t
  };
};

export { useSalesReportHeader };
