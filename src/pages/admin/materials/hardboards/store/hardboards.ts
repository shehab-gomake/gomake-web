import { atom } from "recoil";

export const materialHardboardsState = atom({
  key: "materialHardboardsState",
  default: {
    openAddHardboardsModal: false,
  },
});
