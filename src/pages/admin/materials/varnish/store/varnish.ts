import { atom } from "recoil";

export const materialVarnishState = atom({
  key: "materialVarnishState",
  default: {
    openVarnishsModal: false,
  },
});
