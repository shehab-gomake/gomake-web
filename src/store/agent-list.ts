import { atom } from "recoil";

export const agentListsState = atom<{text: string, value: string}[]>({
  key: "agentListsState",
  default: [],
});
