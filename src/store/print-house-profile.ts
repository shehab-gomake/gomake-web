import { atom, selector } from "recoil";

const PRINT_NODE_FEATURE_ID = "5623506c-9e43-429b-89e1-b5f1d63df62b";
export const GOMAKE_MIS_FEATURE_ID = "c242bb4f-1221-4999-b3f3-5c8a8adb090f";
export const GOMAKE_AI_FEATURE_ID = "61bcac05-de33-45ed-ab01-bee49346e8de";
export const CUSTOMIZE_GOMAKE_AI_FEATURE_ID =
  "bee4c55f-fb7a-4c6b-81da-56cbc651eac5";

export const printHouseProfile = atom<IPrintHouseProfile>({
  key: "printHouseProfile",
  default: {} as IPrintHouseProfile,
});

export const printHouseUsePrintNode = selector<boolean>({
  key: "printHouseUsePrintNodeSelector",
  get: ({ get }) => {
    const profileState = get(printHouseProfile);
    return (
      profileState.allowedFeaturesId?.includes(PRINT_NODE_FEATURE_ID) ?? false
    );
  },
});

// Selector to check if print house has PrintNode feature AND packaging slip printer configured
export const printHouseHasPackagingSlipPrinter = selector<boolean>({
  key: "printHouseHasPackagingSlipPrinterSelector",
  get: ({ get }) => {
    const profileState = get(printHouseProfile);
    const hasPrintNodeFeature = profileState.allowedFeaturesId?.includes(PRINT_NODE_FEATURE_ID) ?? false;
    const hasPackagingSlipPrinter = profileState.packagingSlipPrinterId != null && profileState.packagingSlipPrinterId > 0;
    return hasPrintNodeFeature && hasPackagingSlipPrinter;
  },
});

// Selector to check if print house has Gomake MIS feature
export const printHouseHasMISFeature = selector<boolean>({
  key: "printHouseHasMISFeatureSelector",
  get: ({ get }) => {
    const profileState = get(printHouseProfile);
    return (
      profileState.allowedFeaturesId?.includes(GOMAKE_MIS_FEATURE_ID) ?? false
    );
  },
});

// Selector to check if print house has Gomake AI feature
export const printHouseHasAIFeature = selector<boolean>({
  key: "printHouseHasAIFeatureSelector",
  get: ({ get }) => {
    const profileState = get(printHouseProfile);
    return (
      profileState.allowedFeaturesId?.includes(GOMAKE_AI_FEATURE_ID) ?? false
    );
  },
});

// Selector to check if print house has Customize GomakeAI feature
export const printHouseHasCustomizeAIFeature = selector<boolean>({
  key: "printHouseHasCustomizeAIFeatureSelector",
  get: ({ get }) => {
    const profileState = get(printHouseProfile);
    return (
      profileState.allowedFeaturesId?.includes(
        CUSTOMIZE_GOMAKE_AI_FEATURE_ID
      ) ?? false
    );
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
  isTrial?: boolean;
  maxTrialDays?: number;
  remainingTrialDays?: number;
  trialFinished?: boolean;
  packagingSlipPrinterId?: number;
  localFilePathMapping?: string;
}
