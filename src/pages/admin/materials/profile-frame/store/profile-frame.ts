import { atom } from "recoil";

export const materialProfileFrameState = atom({
  key: "materialProfileFrameState",
  default: {
    openAddNewPlatModal: false,
  },
});
