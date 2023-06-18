import { atom } from "recoil";

export const sheetState = atom({
  key: "sheetState",
  default: { suppliers: [] },
});
