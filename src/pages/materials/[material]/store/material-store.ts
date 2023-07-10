import { atom } from "recoil";

export const materialsDataState = atom({
  key: "materialsState",
  default: { suppliers: [], selectedSupplier: "" },
});
