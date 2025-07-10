import { atom } from "recoil";

export const clientTypesCategoriesState = atom<any>({
  key: "clientTypesCategoriesState",
  default: [],
});

export const agentsCategoriesState = atom<[]>({
  key: "agentsCategoriesState",
  default: [],
});

export const isSelectedCLoseAsDeliveryNoteState = atom<boolean>({
  key: "isSelectedCLoseAsDeliveryNoteState",
  default: false,
});

export const closeAsInvoiceState = atom<boolean>({
  key: "closeAsInvoiceState",
  default: false,
});
