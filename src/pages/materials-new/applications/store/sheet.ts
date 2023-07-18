import { atom } from "recoil";

export const sheetState = atom({
  key: "applicationsState",
  default: { suppliers: [], selectedSupplier: "" },
});
