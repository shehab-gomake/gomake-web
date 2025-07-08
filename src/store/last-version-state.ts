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

export enum ChangeType {
  BugFix = 1,
  Improvement = 2,
  Feature = 3,
}

export const lastVersionState = atom<ILastVersionState | null>({
  key: "lastVersionState",
  default: null,
});
