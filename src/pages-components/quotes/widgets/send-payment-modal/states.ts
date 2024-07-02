export interface StatePayment {
    SendBySms: boolean;
    sendByMail: boolean;
    percentageOfTotal: number;
    numberOfInstallments: number;
    documentId?: string;
    price: number;
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
    price: 200,
    maxPayments: 0,
    invoiceDateStr: "",
    contactName: "lama",
    contactPhone: "0545568623",
    contactMail: "lama@gomake.net",
    sendByWhatsapp: true
  };