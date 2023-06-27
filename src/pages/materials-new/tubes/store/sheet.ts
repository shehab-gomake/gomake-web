import { atom } from "recoil";

export const sheetState = atom({
  key: "tubesState",
  default: { suppliers: [], selectedSupplier: "" },
});
