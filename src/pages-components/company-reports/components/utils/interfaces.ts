export interface IPrintHouse {
  calculationsCount: number;
  creationDate: string;
  domain: string;
  id: string;
  lastActivity: string;
  mail: string | null;
  numberOfClients: number;
  numberOfEmployees: number;
  numberOfSuppliers: number;
  orderCount: number;
  orderItemsCount: number;
  phone: string | null;
  printHouseName: string;
  quoteItemsCount: number;
  quotesCount: number;
  status: string;
  successRate: number;
  printHouseCreditCardDetails?: IPrintHouseCreditCardDetails;
}

export interface IPrintHouseCreditCardDetails {
  cardNumber: string;
  cvv: string;
  expDate_MMYY: string;
  transactionSum: number;
  customerEmail: string;
  phoneNumber: string;
  holderID: string;
  customerName: string;
  creditType: number;
  currencyType: number;
}

export interface PaymentDetails {
  printHouseId: string;
  cardNumber: string;
  cvv: string;
  expDate_MMYY: string;
  transactionSum: number;
  customerEmail: string;
  phoneNumber: string;
  holderID: string;
  customerName: string;
  dayOfPayment: number;
  isMonthlyPayment: boolean;
}

export interface SendPaymentState {
  contactName?: string;
  contactPhone?: string;
  contactMail?: string;
  amount?: number;
  isAuthorizeOnly?: boolean;
}

export const initSendPaymentState: SendPaymentState = {
  contactName: "",
  contactPhone: "",
  contactMail: "",
  amount: 0,
  isAuthorizeOnly: false,
};

export enum PrintHousePayStatus {
  NoPaymentDetails,
  NeedToPay,
  Payed,
}
