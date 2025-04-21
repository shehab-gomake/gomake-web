import { atom } from "recoil";

export const reportsClientsState = atom<any[]>({
  key: "reportsClientsState",
  default: [],
});
