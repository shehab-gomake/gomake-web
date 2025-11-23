import { atom } from "recoil";

export const clientTypesCategoriesState = atom<any>({
  key: "clientTypesCategoriesState",
  default: [],
});

export const clientGroupsCategoriesState = atom<any>({
  key: "clientGroupsCategoriesState",
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

export const isSelectedCLoseAsProformaInvoiceState = atom<boolean>({
  key: "isSelectedCLoseAsProformaInvoiceState",
  default: false,
});

export const closeOrderAsInvoiceOrDeliveryNoteState = atom<boolean>({
  key: "closeOrderAsInvoiceOrDeliveryNoteState",
  default: false,
});
