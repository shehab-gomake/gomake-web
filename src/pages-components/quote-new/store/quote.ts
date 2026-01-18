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

export const hasTableCellUpdatesState = atom({
  key: "hasTableCellUpdatesState",
  default: false,
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

export enum ClientChangeSource {
  REGULAR_CHANGE = 1,
  SAVE_AND_START_NEW_DOC = 2,
  SAVE_AND_CHANGE_CLIENT = 3,
}
