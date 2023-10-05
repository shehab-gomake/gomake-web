import { atom } from "recoil";

export const templateGroupState = atom<any>({
  key: "templateGroupState",
  default: null,
});

export const groupModalState = atom<boolean>({
  key: "groupModalState",
  default: false,
});

export const allSMSTemplateGroupsState = atom<any>({
  key: "allSMSTemplateGroupsState",
  default: [],
});
