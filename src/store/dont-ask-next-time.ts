import { atom } from "recoil";

export const dontAskNextTimeState = atom({
  key: "dontAskNextTimeState",
  default: false, 
});
