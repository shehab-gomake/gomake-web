import { atom } from "recoil";

export const materialTubeState = atom({
  key: "materialTubeState",
  default: {
    openAddNewPlatModal: false,
  },
});
