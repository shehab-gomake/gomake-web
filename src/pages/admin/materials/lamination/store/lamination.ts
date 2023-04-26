import { atom } from "recoil";

export const materialLaminationsState = atom({
  key: "materialLaminationsState",
  default: {
    openAddLaminationModal: false,
  },
});
