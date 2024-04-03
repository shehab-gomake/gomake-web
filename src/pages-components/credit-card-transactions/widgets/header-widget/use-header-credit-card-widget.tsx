export interface CreditCardTransactionsReportHeaderWidgetProps {
  onSelectDeliveryTimeDates:any;
  resetDatePicker:any;
  onClickSearchFilter:any,
  onClickClearFilter:any,
  customer: any;
  receiptNumber:any;
  handleReceiptNumberChange:  (e,value)=>void;
  transactionAmount:any;
  handleTransactionAmountChange: (e,value)=>void;

  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
}
