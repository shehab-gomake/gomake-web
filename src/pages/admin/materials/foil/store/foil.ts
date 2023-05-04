import { atom } from "recoil";

export const materialFoilState = atom({
  key: "materialFoilState",
  default: {
    openAddNewPlatModal: false,
  },
});
