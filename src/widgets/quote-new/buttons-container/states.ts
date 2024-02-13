import { atom } from "recoil";

export const totalDocumentsState = atom<number>({
    key: "totalDocumentsState",
    default: 0,
  });