import { atom } from "recoil";

export const selectTestDataState = atom({
  key: "selectTestDataState",
  default: {
    unitPrice: 0,
  },
});
