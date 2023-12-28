import { atom } from "recoil";

export const translationsModal= atom<boolean>({
    key: "translationsModal",
    default: false,
  });

  export const translationsBlockModal = atom<boolean>({
    key: "translationsBlockModal",
    default: false,
  });