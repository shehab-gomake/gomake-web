import { atom } from "recoil";

export const userQuoteState = atom<boolean>({
  key: "userQuoteState",
  default: null,
});
