import { atom } from "recoil";

export const isChangePriceForEditState = atom({
  key: "isChangePriceForEditState",
  default: false,
});

export const isActionEmployeeUpdatedState = atom({
  key: "isActionEmployeeUpdatedState",
  default: false,
});
