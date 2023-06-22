import { atom } from "recoil";

export const sheetState = atom({
  key: "varnishsState",
  default: { suppliers: [], selectedSupplier: "" },
});
