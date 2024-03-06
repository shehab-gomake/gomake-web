import { atom } from "recoil";

export const startGuideTourState = atom<boolean>({
  key: "startGuideTourState",
  default: false,
});
