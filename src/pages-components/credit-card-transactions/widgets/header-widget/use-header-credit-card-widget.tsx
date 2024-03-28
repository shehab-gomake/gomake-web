
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
export interface CreditCardTransactionsReportHeaderWidgetProps {
  onSelectDeliveryTimeDates:any;
  resetDatePicker:any;
  onClickSearchFilter:any,
  onClickClearFilter:any,
  customerId:any;
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
}
const useCreditCardTransactionsReportHeader = () => {
  const { t }= useTranslation();
  const { classes } = useStyle();
  return {
    t,classes
  };
};

export { useCreditCardTransactionsReportHeader };
