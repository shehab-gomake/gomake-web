// store/reopen-order-modal-controller.ts
import { atom } from "recoil";

export const shouldReopenOrderModalState = atom<boolean>({
  key: "shouldReopenOrderModalState",
  default: false,
});

export const openOrderModalState = atom<boolean>({
  key: "openOrderModalState",
  default: false,
});
