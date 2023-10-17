import { atom } from "recoil";

export const templateGroupState = atom<any>({
  key: "templateGroupState",
  default: null,
});

export const groupModalState = atom<boolean>({
  key: "groupModalState",
  default: false,
});

export const editModalState = atom<boolean>({
  key: "editModalState",
  default: false,
});

export const allSMSTemplateGroupsState = atom<any>({
  key: "allSMSTemplateGroupsState",
  default: [],
});

export const documentState = atom<any>({
  key: "documentState",
  default: [],
});

type HTMLContent = string;
export const textState = atom<string>({
  key: "textState",
  default: "<p><b>GoMake</b> template</p>" , 
});


