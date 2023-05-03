import { atom } from "recoil";

export const materialPlatsState = atom({
  key: "materialPlatsState",
  default: {
    openAddNewPlatModal: false,
  },
});
