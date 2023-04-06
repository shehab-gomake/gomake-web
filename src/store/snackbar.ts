import { atom } from "recoil";

export const snackbarState = atom({
  key: "snackbarState",
  default: {
    state: false,
    message: "",
    type: "error",
  },
});
