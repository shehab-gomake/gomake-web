import { atom } from "recoil";

export const materialPackingsState = atom({
  key: "materialPackingsState",
  default: {
    openAddNewPackingsModal: false,
  },
});
