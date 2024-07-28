import { atom } from "recoil";

export const startGuideTourState = atom<boolean>({
  key: "startGuideTourState",
  default: false,
});
export const showTourModalState = atom<boolean>({
  key: "showTourModalState",
  default: false,
});
