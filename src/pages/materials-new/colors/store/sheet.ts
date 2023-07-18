import { atom } from "recoil";

export const sheetState = atom({
  key: "colorsState",
  default: { suppliers: [], selectedSupplier: "" },
});
