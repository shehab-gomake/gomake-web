import { atom } from "recoil";

export const sheetState = atom({
  key: "pDState",
  default: { suppliers: [], selectedSupplier: "" },
});
