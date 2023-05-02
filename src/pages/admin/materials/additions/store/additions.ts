import { atom } from "recoil";

export const materialAdditionsState = atom({
  key: "materialAdditionsState",
  default: {
    openAddAdditionsModal: false,
  },
});
