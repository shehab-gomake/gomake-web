import { atom } from "recoil";

export interface SetupStepItem {
  step: SetupStep;
  status: StepStatus;
}

export enum SetupStep {
  WELCOME_MESSAGE = 0,
  RESET_PASSWORD,
  SETUP_YOUR_MACHINES,
  SETUP_YOUR_MATERIALS,
  COMPANY_PROFILE_LOGO,
  COMPANY_PROFILE_HOURS,
  COMPANY_PROFILE_STRIPE,
  COMPANY_PROFILE_ADDRESSES,
  COMPANY_PROFILE_MAILING,
  CONTACTS_CLIENTS,
  CONTACTS_SUPPLIERS,
  HELP_CENTER_BASIC_WALKTHROUGH,
  HELP_CENTER_CREATE_A_QUOTE,
  FILE_SERVICE_CONFIGS,
  HELP_CENTER_KNOWLEDGE_BASE,
  HELP_CENTER_CUSTOMER_SERVICE,
}

export enum StepStatus {
  NOT_YET = 0,
  IN_PROGRESS = 1,
  DONE = 2,
}

export const printHouseSetupStepsState = atom<SetupStepItem[]>({
  key: "printHouseSetupStepsState",
  default: [],
});

export const printHouseWelcomeModalState = atom<boolean>({
  key: "printHouseWelcomeModalState",
  default: false,
});

export const setupGuideExpandedState = atom<boolean>({
  key: "setupGuideExpandedState",
  default: false,
});

export const printHouseResetPasswordModalState = atom<boolean>({
  key: "printHouseResetPasswordModalState",
  default: false,
});
