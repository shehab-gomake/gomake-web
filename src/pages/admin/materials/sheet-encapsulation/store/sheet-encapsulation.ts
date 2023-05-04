import { atom } from "recoil";

export const materialSheetEncapsulationState = atom({
  key: "materialSheetEncapsulationState",
  default: {
    openAddNewPlatModal: false,
  },
});
