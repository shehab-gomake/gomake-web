import { atom } from "recoil";

export const sheetState = atom({
  key: "packinUnitsState",
  default: { suppliers: [], selectedSupplier: "" },
});
