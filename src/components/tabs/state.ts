import { atom } from "recoil";

export const selectedHorizontalTabState = atom<number>({
    key: "selectedHorizontalTabState",
    default: 0,
  });