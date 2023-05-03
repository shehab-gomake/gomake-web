import { atom } from "recoil";

export const materialFrameState = atom({
  key: "materialFrameState",
  default: {
    openAddNewPlatModal: false,
  },
});
