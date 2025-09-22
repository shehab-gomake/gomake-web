import { atom, selector } from "recoil";

const PRINT_NODE_FEATURE_ID = "5623506c-9e43-429b-89e1-b5f1d63df62b";
export const printHouseProfile = atom<IPrintHouseProfile>({
  key: "printHouseProfile",
  default: {} as IPrintHouseProfile,
});

export const printHouseUsePrintNode = selector<boolean>({
  key: "printHouseUsePrintNodeSelector",
  get: ({ get }) => {
    const profileState = get(printHouseProfile);
    return profileState.allowedFeaturesId.includes(PRINT_NODE_FEATURE_ID);
  },
});

export const isUsPrintHouseState = atom<boolean>({
  key: "isUsPrintHouseState",
  default: false,
});

export interface IPrintHouseProfile {
  id: string;
  name: string;
  logo: string | null;
  pdfLogo: string | null;
  loginLogo: string | null;
  country: string;
  filesApiAddress?: string;
  allowedFeaturesId: string[];
  domain?: string;
  isShowOnBoardingMenu?: boolean;
  mailingProviderType?: number;
  stripeCustomerId?: string;
}
