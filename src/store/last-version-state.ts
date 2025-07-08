import { atom } from "recoil";

export interface IChange {
  id: string;
  title: string;
  name: string;
  type: number;
}

export interface ILastVersionState {
  id: string;
  versionNumber: string;
  creationDate: string;
  changes: IChange[];
  isShowWhatsNewBadge: boolean;
  whatsNewBadgeCount: number;
}

export const lastVersionState = atom<ILastVersionState | null>({
  key: "lastVersionState",
  default: null,
});
