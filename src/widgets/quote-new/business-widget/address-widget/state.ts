import { atom } from "recoil";

export const addressModalState = atom<boolean>({
  key: "addressModalState",
  default: false,
});

export const addressTypeState = atom<EAddressType>({
  key: "addressTypeState",
  default: null,
});

export const isNewAddress = atom<boolean>({
  key: "isNewAddress",
  default: false,
});

export enum EAddressType {
  DELIVERY = 0,
  BILLING = 1,
}
