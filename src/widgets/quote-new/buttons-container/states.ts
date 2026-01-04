import { atom } from "recoil";

export enum ErpAccountType {
  TransferPayment = 0,
  ChecksPayment,
  CashPayment,
  CreditCardPayment,
  BalanceCancelAccount,
  TaxAccount,
  IncomAccount,
}

export interface CheckData {
  dueDate: string;
  checkNumber: number;
  bankCode: string;
  branch: string;
  accountNum: string;
  checkSum: number;
}

export interface transactionOptionsData {
  id: string;
  text: string;
  transactionSum: number;
}

export interface TransferTabData {
  transferAccount: any;
  transferSum: number;
  transferReference: string;
  transferDate: string | Date;
}

export interface creditCardTabData {
  creditCardAccount: any;
  creditCardTotal: number;
  creditCardReference: string;
  creditCardTransactionDate: string | Date;
}

export interface prevStateStateData {
  totalTransfer: number;
  transferState: any;
  creditCardState: any;
  secondCreditCard: any;
  totalCash: number;
  totalBit: number;
  totalChecks: number;
  totalCreditCard: number;
  checksReceipt: CheckData[];
  taxDeduction: number;
  checkAccountCode: any;
  cashAccountCode: any;
  cardWidget: number;
  selectedCreditTransaction: transactionOptionsData;
  totalSupplierCreditCard?: number;
  supplierCreditCardState?: any;
}

export interface CreditCardData {
  cardNumber: string;
  expDate_MMYY: string;
  cvv: string;
  transactionSum: number;
  holderID?: string;
  customerName?: string;
  lastName?: string;
  phoneNumber?: string;
  customerEmail?: string;
  transactionType?: any;
  numberOfPayments?: number;
  pinPadId?: number;
  notes?: string;
}

export interface ReceiptCreditCardData {
  id?: string;
  receiptId?: string;
  creditCardSum?: number;
  creditCardToken?: string;
  creditCardNum?: string;
  creditCardExpDate?: string;
  creditCardVoucherNumber?: string;
  creditCardTransactionID?: string;
  installments?: number;
  firstPaymentSum?: number;
  additionalPaymentSum?: number;
  isManual?: boolean;
  depositId?: string;
}

export const creditCardState = atom<CreditCardData>({
  key: "creditCardState",
  default: {
    cardNumber: "",
    expDate_MMYY: "",
    cvv: "",
    transactionSum: 0,
    holderID: "",
    customerName: "",
    lastName: "",
    phoneNumber: "",
    customerEmail: "",
    transactionType: 1,
    numberOfPayments: 0,
  },
});

export const receiptCreditCardState = atom<ReceiptCreditCardData>({
  key: "receiptCreditCardState",
  default: {},
});

export const checksRowState = atom<CheckData[]>({
  key: "checksRowState",
  default: [
    {
      dueDate: new Date().toISOString().split("T")[0],
      checkNumber: 0,
      bankCode: "",
      branch: "",
      accountNum: "",
      checkSum: 0,
    },
  ],
});

export const transferTabState = atom<TransferTabData>({
  key: "transferTabState",
  default: {
    transferAccount: "",
    transferSum: 0,
    transferReference: "",
    transferDate: new Date().toISOString().split("T")[0],
  },
});

export const supplierCreditCardTabState = atom<creditCardTabData>({
  key: "supplierCreditCardTabState",
  default: {
    creditCardAccount: "",
    creditCardTotal: 0,
    creditCardReference: "",
    creditCardTransactionDate: new Date().toISOString().split("T")[0],
  },
});

export const totalDocumentsState = atom<number>({
  key: "totalDocumentsState",
  default: 0,
});

export const totalPaymentState = atom<number>({
  key: "totalPaymentState",
  default: 0,
});

export const finalTotalPaymentState = atom<number>({
  key: "finalTotalPaymentState",
  default: 0,
});

export const totalTransferState = atom<number>({
  key: "totalTransferState",
  default: 0,
});

export const totalSupplierCreditCardState = atom<number>({
  key: "totalSupplierCreditCardState",
  default: 0,
});

export const totalChecksState = atom<number>({
  key: "totalChecksState",
  default: 0,
});

export const totalCashState = atom<number>({
  key: "totalCashState",
  default: 0,
});

export const totalCreditCardState = atom<number>({
  key: "totalCreditCardState",
  default: 0,
});

export const totalBitState = atom<number>({
  key: "totalBitState",
  default: 0,
});

export const taxDeductionState = atom<number>({
  key: "taxDeductionState",
  default: 0,
});

export const checkedItemsIdsState = atom<string[]>({
  key: "checkedItemsIdsState",
  default: [],
});

export const prevStateState = atom<prevStateStateData>({
  key: "prevStateState",
  default: {
    totalTransfer: 0,
    transferState: {},
    creditCardState: {},
    secondCreditCard: {},
    totalSupplierCreditCard: 0,
    supplierCreditCardState: {},
    checkAccountCode: "",
    cashAccountCode: "",
    totalCash: 0,
    totalBit: 0,
    totalChecks: 0,
    totalCreditCard: 0,
    checksReceipt: [
      {
        dueDate: new Date().toISOString().split("T")[0],
        checkNumber: 0,
        bankCode: "",
        branch: "",
        accountNum: "",
        checkSum: 0,
      },
    ],
    taxDeduction: 0,
    cardWidget: 3,
    selectedCreditTransaction: null,
  },
});

export const checksAccountCodeState = atom<string>({
  key: "checksAccountCodeState",
  default: "",
});

export const cashAccountCodeState = atom<string>({
  key: "cashAccountCodeState",
  default: "",
});

export const creditTransactionsState = atom<transactionOptionsData[]>({
  key: "creditTransactionsState",
  default: [],
});
export const selectedCreditTransactionState = atom<transactionOptionsData>({
  key: "selectedCreditTransactionState",
  default: null,
});

export const allocatedSumsState = atom<Record<string, number>>({
  key: "allocatedSumsState",
  default: {},
});

export const totalAllocatedDocumentsState = atom<number>({
  key: "totalAllocatedDocumentsState",
  default: 0,
});
