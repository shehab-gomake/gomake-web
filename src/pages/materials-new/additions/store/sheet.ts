import { atom } from "recoil";

export const sheetState = atom({
  key: "additionalsState",
  default: { suppliers: [], selectedSupplier: "" },
});
