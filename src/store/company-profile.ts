import { atom } from "recoil";

export const companyProfileState = atom<ICompanyProfile>({
  key: "companyProfileState",
  default: {} as ICompanyProfile,
});

export interface ICompanyProfile {
  vat: 17;
  address?: null | string;
  domain?: string;
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
  businessDays: {
    days: number[];
    startTime: Date;
    endTime: Date;
  };
  footerImage?: null | string;
  showContactInfo?: null | string;
  dashboardCode?: string;
  id?: string;
  name?: string;
  logo?: string;
  pdfLogo?: string;
  loginLogo?: string;
  systemCurrency?: string;
  isSendGridVerificated?: null | boolean;
  smsServiceTitle?: string;
  mailServiceEmail?: string;
  printnodeUsername?: string;
  printnodePassword?: string;
  packagingSlipPrinterId?: number;
  employeeWorkingHourCost?: string;
  unitType?: number;
  creditClearanceCompany?: CreditClearanceCompanies;
  terminalNumber?: string;
  terminalPassword?: string;
  isShowFinance?: boolean;
  isConnectedToStripe?: boolean;
  pinPads?: Array<{
    name: string;
    number: string;
  }>;
  paymentReminder?: number;
  checksSerialNumber?: number;
  mailingProviderType: any;
  appPassword?: string;
  bankAccounts?: Array<{
    id?: string;
    code?: string;
    name?: string;
    bankName?: string;
    bankBranch?: string;
    bankAccountNUM?: string;
  }>;
  languages?: string[];
}

export enum CreditClearanceCompanies {
  Z_CREDIT = 1,
  YAAD_PAY,
  Stripe,
}

export enum IMailProviders {
  SEND_GRID = 0,
  AMAZON,
  GMAIL,
  OUTLOOK,
  OUTLOOK_GRAPH_API,
}

export const mailProviderOptions = [
  { text: "profileSettings.sendGrid", value: IMailProviders.SEND_GRID },
  { text: "profileSettings.aws", value: IMailProviders.AMAZON },
  { text: "profileSettings.gmail", value: IMailProviders.GMAIL },
  { text: "profileSettings.outlook", value: IMailProviders.OUTLOOK },
  {
    text: "profileSettings.outlookApi",
    value: IMailProviders.OUTLOOK_GRAPH_API,
  },
];
