import { atom } from "recoil";

export const materialRollEncapsulationState = atom({
  key: "materialRollEncapsulationState",
  default: {
    openAddSheetModal: false,
  },
});
