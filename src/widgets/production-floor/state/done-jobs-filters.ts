import { atom } from "recoil";

export const doneJobsCustomerState = atom<any>({
  key: "doneJobsCustomerState",
  default: null,
});

export const doneJobsAgentState = atom<any>({
  key: "doneJobsAgentState",
  default: null,
});

export const doneJobsProductionStatusState = atom<any>({
  key: "doneJobsProductionStatusState",
  default: null,
});

export const doneJobsOrderStatusState = atom<any>({
  key: "doneJobsOrderStatusState",
  default: null,
});

export const doneJobsProofTypesState = atom<any[]>({
  key: "doneJobsProofTypesState",
  default: [],
});

export const doneJobsIsPrintedState = atom<boolean | null>({
  key: "doneJobsIsPrintedState",
  default: null,
});

export const doneJobsProductIdsState = atom<string[]>({
  key: "doneJobsProductIdsState",
  default: [],
});

export const doneJobsFromDateState = atom<Date | null>({
  key: "doneJobsFromDateState",
  default: null,
});

export const doneJobsToDateState = atom<Date | null>({
  key: "doneJobsToDateState",
  default: null,
});

export const doneJobsFromDueDateState = atom<Date | null>({
  key: "doneJobsFromDueDateState",
  default: null,
});

export const doneJobsToDueDateState = atom<Date | null>({
  key: "doneJobsToDueDateState",
  default: null,
});

export const doneJobsFromReadyDateState = atom<Date | null>({
  key: "doneJobsFromReadyDateState",
  default: null,
});

export const doneJobsToReadyDateState = atom<Date | null>({
  key: "doneJobsToReadyDateState",
  default: null,
});
