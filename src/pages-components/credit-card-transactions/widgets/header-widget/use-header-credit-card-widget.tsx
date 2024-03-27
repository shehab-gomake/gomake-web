
import { useStyle } from "./style";


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

  return {
    classes,
    

  };
};

export { useCreditCardTransactionsReportHeader };
