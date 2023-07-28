import { atom } from "recoil";

export const sheetState = atom({
  key: "pmfrState",
  default: { suppliers: [], selectedSupplier: "" },
});
