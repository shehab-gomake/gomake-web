import { atom } from "recoil";

export const navStatusState = atom({
  key: "navStatusState",
  default: {
    isClosed: true,
  },
});
export const pageTitleState = atom({
  key: "pageTitleState",
  default: "Gomake",
});
