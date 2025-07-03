import { atom } from "recoil";

export const tokenExpiredState = atom({
  key: "tokenExpiredState ",
  default: false,
});
export const isLoggedInState = atom({
  key: "isLoggedInState ",
  default: false,
});