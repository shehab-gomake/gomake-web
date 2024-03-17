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

export const QuoteIfExistState = atom({
  key: "QuoteIfExistState",
  default: "", 
});

interface ReportItem {
  key: string;
  value: string;
}

export const homeReportsState = atom<ReportItem[]>({
  key: "homeReportsState",
  default: null,
});