import { atom } from "recoil";

export const materialEnvelopeState = atom({
  key: "materialEnvelopeState",
  default: {
    openAddNewPlatModal: false,
  },
});
