import { atom } from "recoil";

export enum ErpAccountType {
  TransferPayment = 0,
  ChecksPayment,
  CashPayment,
  CreditCardPayment,
  BalanceCancelAccount,
  TaxAccount,
  IncomAccount
}

export interface CheckData {
  dueDate: string;
  checkNumber: string;
  bankCode: string;
  branch: string;
  accountNum: string;
  checkSum: number;
}

export interface ERPAccountsData {
  balance: number;
  code: string;
  cpaAcount: string;
  isDefault: boolean;
  name: string;
}

export interface TransferTabData {
  transferAccount: any;
  transferSum: number;
  transferReference: string;
  transferDate: string;
}

export interface prevStateStateData {
  totalTransfer: number;
  transferState: any;
  totalCash: number;
  totalBit: number;
  totalChecks: number;
  totalCreditCard:number;
  checksReceipt: CheckData[];
  taxDeduction: number;
  checkAccountCode:any;
  cashAccountCode:any;
}

export const checksRowState = atom<CheckData[]>({
  key: "checksRowState",
  default: [
    {
      dueDate: new Date().toISOString().split('T')[0],
      checkNumber: "",
      bankCode: "",
      branch: "",
      accountNum: "",
      checkSum: 0,
    },
  ],
});

export const ERPAccountsState = atom<ERPAccountsData[]>({
  key: "ERPAccountsState",
  default: [],
});

export const transferTabState = atom<TransferTabData>({
  key: "transferTabState",
  default:
  {
    transferAccount: "",
    transferSum: 0,
    transferReference: "",
    transferDate: null,
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
    checkAccountCode:"",
    cashAccountCode:"",
    totalCash: 0,
    totalBit: 0,
    totalChecks: 0,
    totalCreditCard:0,
    checksReceipt: [
      {
        dueDate: new Date().toISOString().split('T')[0],
        checkNumber: "",
        bankCode: "",
        branch: "",
        accountNum: "",
        checkSum: 0,
      },
    ],
    taxDeduction: 0,
  },
});


export const checksAccountCodeState = atom<any>({
  key: "checksAccountCodeState",
  default: "",
});

export const cashAccountCodeState = atom<any>({
  key: "cashAccountCodeState",
  default: "",
});