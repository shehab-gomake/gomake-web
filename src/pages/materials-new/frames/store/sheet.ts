import { atom } from "recoil";

export const sheetState = atom({
  key: "framesState",
  default: { suppliers: [], selectedSupplier: "" },
});
