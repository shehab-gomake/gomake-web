import { atom } from "recoil";

export const materialColorState = atom({
  key: "materialColorState",
  default: {
    openMagnetsModal: false,
  },
});
