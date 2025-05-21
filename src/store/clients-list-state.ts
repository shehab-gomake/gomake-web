import { atom } from "recoil";

export const clientListState = atom<any[]>({
  key: "clientListState",
  default: [],
});
