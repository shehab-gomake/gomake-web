import { atom } from "recoil";

export const setupGuideOpenState = atom<boolean>({
  key: "setupGuideOpenState",
  default: false, // default hidden
});
