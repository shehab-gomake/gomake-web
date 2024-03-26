
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { t } from "i18next";

export interface CreditCardTransactionsReportHeaderWidgetProps {
  onSelectDeliveryTimeDates:any;
  resetDatePicker:any;
  onClickSearchFilter:any,
  onClickClearFilter:any,
  agent: any;
  agentsCategories: any[];
  handleAgentChange: any;
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
}
const useCreditCardTransactionsReportHeader = () => {
  const { classes } = useStyle();
  const { t }= useTranslation();
  return {
    classes,
    t

  };
};

export { useCreditCardTransactionsReportHeader };
