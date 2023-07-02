import { atom } from "recoil";

export const sheetState = atom({
  key: "packingsState",
  default: { suppliers: [], selectedSupplier: "" },
});
