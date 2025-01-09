import { atom } from "recoil";

export const doNotAskNextTimeState = atom({
  key: "doNotAskNextTimeState",
  default: false,
});
