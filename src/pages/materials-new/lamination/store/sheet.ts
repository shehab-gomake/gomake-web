import { atom } from "recoil";

export const sheetState = atom({
  key: "laminationState",
  default: { suppliers: [], selectedSupplier: "" },
});
