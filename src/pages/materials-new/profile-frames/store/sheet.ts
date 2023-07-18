import { atom } from "recoil";

export const sheetState = atom({
  key: "profileFramesState",
  default: { suppliers: [], selectedSupplier: "" },
});
