import { atom } from "recoil";

export const editPriceListState = atom({
  key: "editPriceListState",
  default: {
    isEdit: false,
  },
});
