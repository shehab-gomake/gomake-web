import { atom } from "recoil";

export const sheetState = atom({
  key: "sheetEncapsulationState",
  default: { suppliers: [], selectedSupplier: "" },
});
