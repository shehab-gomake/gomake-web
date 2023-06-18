import { atom } from "recoil";

export const materialPackinUnitsState = atom({
  key: "materialPackinUnitsState",
  default: {
    openAddNewCanvasFramesModal: false,
  },
});
