import { atom } from "recoil";

export const sheetState = atom({
  key: "canvasFramesState",
  default: { suppliers: [], selectedSupplier: "" },
});
