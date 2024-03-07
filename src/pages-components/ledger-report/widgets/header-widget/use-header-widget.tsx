import { useTranslation } from "react-i18next";

import { useStyle } from "./style";

export interface AgingReportHeaderWidgetProps {
  onSelectDeliveryTimeDates: any;
  resetDatePicker: any;
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
  isExtended: boolean,
  onChangeIsExtended: any;

}
const useAgingReportHeader = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation()
  return {
    clasess, t
  };
};

export { useAgingReportHeader };
