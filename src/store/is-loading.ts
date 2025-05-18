import { atom } from "recoil";

export const isLoadgingState = atom({
  key: "isLlosadingState",
  default: false,
});

export const isLoadingMaterialsState = atom({
  key: "isLoadingMaterialsState",
  default: false,
});
