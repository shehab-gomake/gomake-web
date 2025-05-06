import { atom } from "recoil";

const selectedProductsIdsState = atom({
  key: "selectedProductsIdsState",
  default: [],
});

export { selectedProductsIdsState };
