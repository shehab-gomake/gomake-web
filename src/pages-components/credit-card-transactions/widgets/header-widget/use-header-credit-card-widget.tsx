export interface CreditCardTransactionsReportHeaderWidgetProps {
  onClickSearchFilter: any;
  onClickClearFilter: any;
  customer: any;
  receiptNumber: any;
  cardNumber: any;
  handleReceiptNumberChange: (value) => void;
  handleCardNumberChange: (value) => void;
  transactionAmount: any;
  handleTransactionAmountChange: (value) => void;
  renderOptions: () => any[];
  checkWhatRenderArray: (arg: any) => void;
  handleCustomerChange: any;
  // handleDateChange?: any;
  fromDate?: Date | null;
  toDate?: Date | null;
  isFetchingCustomers?: boolean;
  setToDate?: any;
  setFromDate?: any;
}
