import { atom } from "recoil";

export const navStatusState = atom({
  key: "navStatusState",
  default: {
    isClosed: true,
  },
});

// HP Client theme specific sidebar state (boolean: true = closed, false = open)
export const hpSidebarStatusState = atom<boolean>({
  key: "hpSidebarStatusState",
  default: false,
});

export const pageTitleState = atom({
  key: "pageTitleState",
  default: "Gomake",
});
