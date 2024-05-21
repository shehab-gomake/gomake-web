import { atom } from "recoil";

export const companyProfileState = atom<ICompanyProfile>({
  key: "companyProfileState",
  default: {} as ICompanyProfile,
});

export interface ICompanyProfile {
  vat: 17;
  address?: null | string;
  city?: string;
  street?: null | string;
  streetNumber?: null | string;
  zipCode?: null | string;
  po?: null | string;
  country?: string;
  telePhone?: null | string;
  phone1?: string;
  phone2?: null | string;
  email1?: string;
  email2?: null | string;
  erpApiAddress?: string;
  filesApiAddress?: string;
  materialsGoogleSheetsKey?: string;
  tW_WA_PhoneNumber?: null | string;
  cpaName?: null | string;
  cpaMail?: null | string;
  cpaTransmitDate?: null | string;
  paymeKey?: string;
  foldersCreationType?: number;
  accountCode?: string;
  depositBank?: string;
  depositBranch?: string;
  depositAccount?: string;
  bankReference?: string;
  depositor?: string;
  business_ID?: string;
  businessDays?: string;
  footerImage?: null | string;
  showContactInfo?: null | string;
  zCreditTerminalNumber?: string;
  zCreditPassword?: string;
  zCreditPinPadId?: string;
  creditClearanceCompany?: number;
  yaadPayMasof?: string;
  yaadPayPassP?: string;
  dashboardCode?: string;
  id?: string;
  name?: string;
  logo?: string;
  pdfLogo?: string;
  loginLogo?: string;
  systemCurrency?: string;
  isSendGridVerificated?: null | boolean;
  smsServiceTitle?: string;
}
