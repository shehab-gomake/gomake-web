import { atom } from "recoil";

export const sheetState = atom({
  key: "rollEncapsulationsState",
  default: { suppliers: [], selectedSupplier: "" },
});
