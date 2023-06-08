import { atom } from "recoil";

export const materialMagnetState = atom({
  key: "materialMagnetState",
  default: {
    openMagnetsModal: false,
  },
});
