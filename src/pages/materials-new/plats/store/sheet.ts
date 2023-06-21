import { atom } from "recoil";

export const sheetState = atom({
  key: "platsState",
  default: { suppliers: [], selectedSupplier: "" },
});
