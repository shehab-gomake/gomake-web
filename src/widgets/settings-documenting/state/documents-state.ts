import { atom } from "recoil";

export const documentsArrayState = atom<[]>({
  key: "documentsArrayState",
  default: [],
});

export const documentState = atom<{}>({
  key: "documentState",
  default: {},
});

export const openModalState = atom<boolean>({
  key: "openModalState",
  default: false,
});

