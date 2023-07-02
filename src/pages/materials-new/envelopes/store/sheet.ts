import { atom } from "recoil";

export const sheetState = atom({
  key: "envelopesState",
  default: { suppliers: [], selectedSupplier: "" },
});
