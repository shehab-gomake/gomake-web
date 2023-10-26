import { atom } from "recoil";

export const quoteState = atom({
  key: "quoteState",
  default: {
    openAddAdditionsModal: false,
  },
});


export const QuoteNumberState = atom({
  key: "QuoteNumberState",
  default: "",
});
