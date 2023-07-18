import { atom } from "recoil";

export const sheetState = atom({
  key: "hardboardsState",
  default: { suppliers: [], selectedSupplier: "" },
});
