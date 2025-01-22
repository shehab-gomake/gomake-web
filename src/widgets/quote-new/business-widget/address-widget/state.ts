import { atom } from "recoil";

export const addressModalState = atom<boolean>({
  key: "addressModalState",
  default: false,
});

export const isNewAddress = atom<boolean>({
  key: "isNewAddress",
  default: false,
});

export enum EAddressType {
  DELIVERY = 0,
  BILLING = 1,
}
