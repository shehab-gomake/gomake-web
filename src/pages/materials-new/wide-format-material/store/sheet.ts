import { atom } from "recoil";

export const sheetState = atom({
  key: "wideFormatMaterialState",
  default: { suppliers: [], selectedSupplier: "" },
});
