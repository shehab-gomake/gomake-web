import { atom } from "recoil";

export interface StatePayment {
    SendBySms: boolean;
    sendByMail: boolean;
    percentageOfTotal: number;
    numberOfInstallments: number;
    documentId?: string;
    totalPayment: number;
    maxPayments: number;
    invoiceDateStr: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    sendByWhatsapp: boolean;
  }

export const initialState: StatePayment = {
  SendBySms: true,
  sendByMail: true,
  percentageOfTotal: 100,
  numberOfInstallments: 1,
  totalPayment: 0,
  maxPayments: 0,
  invoiceDateStr: "",
  contactName: "lama",
  contactPhone: "0545568623",
  contactMail: "lama@gomake.net",
  sendByWhatsapp: true
};

export const sendPaymentState = atom<StatePayment>({
  key: "sendPaymentState",
  default: initialState,
});