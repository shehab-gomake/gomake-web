import { atom } from "recoil";

export const profitsState = atom({
  key: "profitsState",
  default: {
    openAddAdditionsModal: false,
  },
});
