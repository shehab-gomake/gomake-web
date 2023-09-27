import { atom } from "recoil";

export const documentsArrayState = atom<[]>({
  key: "documentsArrayState",
  default: [],
});