import { atom } from "recoil";

export const navStatusState = atom({
  key: "navStatusState",
  default: {
    isClosed: false,
  },
});
