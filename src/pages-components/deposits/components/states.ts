import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { atom } from "recoil";

export const depositState = atom<any>({
  key: "depositState",
  default: {},
});

export const newDepositState = atom<any>({
  key: "newDepositState",
  default: {},
});


export const depositsPageState = atom<number>({
  key: "depositsPageState",
  default: 1,
});

export const depositsPageCountState = atom<number>({
  key: "depositsPageCountState",
  default: 0,
});

export const depositsPageSizeState = atom<number>({
  key: "depositsPageSizeState",
  default: DEFAULT_VALUES.PageSize,
});

export const depositsFromDateState = atom<Date>({
  key: "depositsFromDateState",
  default: null
});

export const depositsToDateState = atom<Date>({
  key: "depositsToDateState",
  default: null
});

export const allDepositsState = atom<any>({
  key: "allDepositsState",
  default: []
});

export const depositPaymentTypeSate = atom<any>({
  key: "depositPaymentTypeSate",
  default: null
});
