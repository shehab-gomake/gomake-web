import { atom } from "recoil";

export const sheetState = atom({
  key: "magnetsState",
  default: { suppliers: [], selectedSupplier: "" },
});
