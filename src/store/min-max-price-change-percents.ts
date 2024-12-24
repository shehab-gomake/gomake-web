import { atom } from "recoil";

//!here
export const priceChangePercentsState = atom({
  key: "priceChangePercentsState",
  default: {
    minPercent: 0,
    maxPercent: 0,
  },
});
