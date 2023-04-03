import { atom } from "recoil";

export const canAccessState = atom({
  key: "canAccessState",
  default: false,
});
