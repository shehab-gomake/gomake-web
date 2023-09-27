import { atom } from "recoil";

export const documentsArrayState = atom<[]>({
  key: "documentsArrayState",
  default: [],
});

export const documentState = atom<{}>({
  key: "documentState",
  default: {},
});

export const editOpenModalState = atom<boolean>({
  key: "editOpenModalState",
  default: false,
});

