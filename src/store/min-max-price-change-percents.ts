import { atom } from "recoil";

export const priceChangePercentsState = atom({
  key: "priceChangePercentsState",
  default: {
    minPercent: 0,
    maxPercent: 0,
  },
});
