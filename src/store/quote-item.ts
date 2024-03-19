import { atom } from "recoil";

export const quoteItemState = atom({
  key: "quoteItemState",
  default: [],
});


export const quoteConfirmationState = atom<any>({
  key: "quoteConfirmationState",
  default: undefined,
});
