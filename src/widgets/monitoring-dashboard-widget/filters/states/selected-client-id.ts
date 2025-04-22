import { atom } from "recoil";

const selectedDashClientState = atom<any>({
  key: "selectedDashClientState",
  default: null,
});

export { selectedDashClientState };
