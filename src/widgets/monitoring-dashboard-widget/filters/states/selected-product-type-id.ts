import { atom } from "recoil";

const selectedProductTypesIdsState = atom({
  key: "selectedProductTypesIdsState",
  default: [],
});

export { selectedProductTypesIdsState };
