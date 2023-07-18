import { atom } from "recoil";

export const sheetState = atom({
  key: "dstrState",
  default: { suppliers: [], selectedSupplier: "" },
});
