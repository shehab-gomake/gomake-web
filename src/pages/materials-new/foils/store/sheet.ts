import { atom } from "recoil";

export const sheetState = atom({
  key: "foilsState",
  default: { suppliers: [], selectedSupplier: "" },
});
