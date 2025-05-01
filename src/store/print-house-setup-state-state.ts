import { atom } from "recoil";

export interface SetupStepItem {
  step: SetupStep;
  status: StepStatus;
}

export enum SetupStep {
  PRODUCTS_SETUPS = 1,
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
