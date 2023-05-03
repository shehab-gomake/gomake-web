import { atom } from "recoil";

export const materialSheetsState = atom({
  key: "materialSheetsState",
  default: {
    openAddSheetModal: false,
  },
});
