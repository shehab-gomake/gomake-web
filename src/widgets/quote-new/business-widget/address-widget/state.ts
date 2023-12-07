import { atom } from "recoil";

export const addressModalState = atom<boolean>({
  key: "addressModalState",
  default: false,
});