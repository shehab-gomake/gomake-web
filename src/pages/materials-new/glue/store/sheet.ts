import { atom } from "recoil";

export const sheetState = atom({
  key: "gluesState",
  default: { suppliers: [], selectedSupplier: "" },
});
