import { atom } from "recoil";

export const mailTestModalOpenState = atom<boolean>({
  key: "mailTestModalOpenState",
  default: false,
});

export const mailTestModalContentState = atom<string>({
  key: "mailTestModalContentState",
  default: "",
});


