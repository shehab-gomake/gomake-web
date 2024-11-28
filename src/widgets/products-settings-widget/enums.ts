import { atom } from "recoil";

export enum EWidgetProductSettingsTabs {
  PRODUCT_MANAGMENT = 0,
  SHIPMENTS_SETTING = 1,
  PRICING_SETTING = 2,
  ADD_PRODUCT = 3,
}

export const selectedProductsTabState = atom<number>({
  key: "selectedProductsTabState",
  default: 0,
});
