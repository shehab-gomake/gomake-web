import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

export interface SalesReportHeaderWidgetProps {
  agent: any;
  agentsCategories: any[];
  handleAgentChange: any;
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
  displayByGroups: boolean;
  onChangeDisplayByGroups: any;
  documentsTypeList?: any;
  reportsTypeList?: any;
  handleDocumentTypeChange: any;
  documentType: any;
  fromDate?: Date | null;
  toDate?: Date | null;
  isFetchingCustomers?: boolean;
  isPurchaseReport?: boolean;
  supplierList?: any[];
  setToDate?: any;
  setFromDate?: any;
}
const useSalesReportHeader = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  return {
    classes,
    t,
  };
};

export { useSalesReportHeader };
