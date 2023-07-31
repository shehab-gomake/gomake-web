import { atom } from "recoil";

export const materialGluesState = atom({
  key: "materialGluesState",
  default: {
    openMagnetsModal: false,
  },
});
