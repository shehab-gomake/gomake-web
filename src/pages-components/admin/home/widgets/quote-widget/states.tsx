import { atom } from "recoil";

export const prevSelectedClientState = atom({
  key: "prevSelectedClientState",
  default: null,
});

export enum ProductCategoryType {
  PRODUCT="product",
  MATERIAL="material",
}