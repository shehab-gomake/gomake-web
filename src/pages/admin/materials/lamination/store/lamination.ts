import { atom } from "recoil";

export const materialLaminationState = atom({
  key: "materialLaminationState",
  default: {
    openAddSheetModal: false,
  },
});
