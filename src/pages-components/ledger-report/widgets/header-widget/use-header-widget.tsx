import { useTranslation } from "react-i18next";

import { useStyle } from "./style";

export interface AgingReportHeaderWidgetProps {
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
  isExtended: boolean;
  onChangeIsExtended: any;
  handleDateChange?: (arg: any) => void;
  fromDate?: Date | null;
  toDate?: Date | null;
  customerId?: string;
  isFetchingCustomers?: boolean;
  isPurchaseReport?: boolean;
  supplierList?: any[];
  setToDate?: any;
  setFromDate?: any;
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
