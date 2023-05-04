import { atom } from "recoil";

export const materialPackinDrumState = atom({
  key: "materialPackinDrumState",
  default: {
    openAddNewPlatModal: false,
  },
});
