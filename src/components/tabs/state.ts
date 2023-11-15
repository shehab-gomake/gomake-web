import { atom } from "recoil";

export const selectedTabState = atom<number>({
    key: "selectedTabState",
    default: 0,
  });