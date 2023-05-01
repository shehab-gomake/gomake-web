import { atom } from "recoil";

export const materialApplicationsState = atom({
  key: "materialApplicationsState",
  default: {
    openAddApplicationsModal: false,
  },
});
