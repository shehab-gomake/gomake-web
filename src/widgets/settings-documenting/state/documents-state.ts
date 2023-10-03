import { atom } from "recoil";

export const documentsArrayState = atom<[]>({
  key: "documentsArrayState",
  default: [],
});
export const documentTypeState = atom<[]>({
  key: 'documentTypeState',
  default: [],
});
export const documentDesignState = atom<[]>({
  key: 'documentDesignState',
  default: [],
});
