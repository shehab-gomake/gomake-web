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
  bankName: string;
  branch: string;
  account: string;
  sum: number;
}

export interface ERPAccountsData {
  balance: number;
  code: string;
  cpaAcount: string;
  isDefault: boolean;
  name: string;
}

export const checksRowState = atom<CheckData[]>({
  key: "checksRowState",
  default: [
    {
      dueDate: new Date().toISOString().split('T')[0],
      checkNumber: "",
      bankName: "",
      branch: "",
      account: "",
      sum: 0,
    },
  ],
});


export const ERPAccountsState = atom<ERPAccountsData[]>({
  key: "ERPAccountsState",
  default: [],
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

export const totalCashState = atom<number>({
  key: "totalCashState",
  default: 0,
});

export const totalBitState = atom<number>({
  key: "totalBitState",
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