import { atom } from "recoil";

export const quoteItemState = atom({
  key: "quoteItemState",
  default: [],
});

export const selectedItemsState = atom({
  key: "selectedItemsState",
  default: [],
});


export const quoteConfirmationState = atom<any>({
  key: "quoteConfirmationState",
  default: undefined,
});

export const openReceiptCreationModalState = atom<boolean>({
  key: "openReceiptCreationModalState",
  default: false,
});

export const fileItemsState = atom<any>({
  key: "fileItemsState",
  default: [],
});

export const requestAbortControllerState = atom<AbortController | null>({
  key: "requestAbortControllerState",
  default: null,
});

export const selectedFirstMaterialState = atom<boolean>({
  key: "selectedFirstMaterialState",
  default: true,
});