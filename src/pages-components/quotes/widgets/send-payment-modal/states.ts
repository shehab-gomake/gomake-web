import { atom } from "recoil";

export interface StatePayment {
    sendBySms: boolean;
    sendByMail: boolean;
    percentageOfTotal: number;
    numberOfInstallments: number;
    documentId?: string;
    totalPayment: number;
    maxPayments: number;
    invoiceDate?: Date;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    sendByWhatsapp: boolean;
    documentContacts:any[];
    selectedContactIndex: number;
    currency:string;
  }

export const initialState: StatePayment = {
  sendBySms: true,
  sendByMail: true,
  percentageOfTotal: 100,
  numberOfInstallments: 1,
  totalPayment: 0,
  maxPayments: 0,
  contactName: "",
  contactPhone: "",
  contactMail: "",
  currency:"$",
  sendByWhatsapp: true,
  documentContacts:[],
  selectedContactIndex: 0
};

export const sendPaymentState = atom<StatePayment>({
  key: "sendPaymentState",
  default: initialState,
});