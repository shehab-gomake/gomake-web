export interface CreditCardTransactionsReportHeaderWidgetProps {
  onSelectDeliveryTimeDates:any;
  resetDatePicker:any;
  onClickSearchFilter:any,
  onClickClearFilter:any,
  customer: any;
  receiptNumber:any;
  handleReceiptNumberChange:  (value)=>void;
  transactionAmount:any;
  handleTransactionAmountChange: (value)=>void;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
}
