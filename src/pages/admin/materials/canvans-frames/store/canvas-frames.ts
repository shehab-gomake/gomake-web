import { atom } from "recoil";

export const materialCanvasFramesState = atom({
  key: "materialCanvasFramesState",
  default: {
    openAddNewCanvasFramesModal: false,
  },
});
