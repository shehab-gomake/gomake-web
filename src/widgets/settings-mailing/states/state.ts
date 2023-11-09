import { atom } from "recoil";
import { ISMSTemplate } from "../messageTemplates/interfaces/interface";

export const initState: ISMSTemplate = {
  title: "<p>hello world!</p>",
  text: "",
  smsTemplatesGroupId: null,
  templateTypeId: null,
  templateType: "",
  attachment: null,
  sendFromAgent: false,
  mailReturnToAgent: false,
  sendFrom: "",
  emailPassword: "",
  sendMailCopy: false,
  sendMailCopyToAgent: false,
  bccMail: "",
  fileBase64: null,
};

export const smsTemplateState = atom<ISMSTemplate>({
  key: "smsTemplateState",
  default: initState,
});

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

export const templateVariablesState = atom<any>({
  key: "templateVariablesState",
  default: {},
});

export const smsSubjectState = atom<string>({
  key: "smsSubjectState",
  default: "",
});

export const smsBodyState = atom<string>({
  key: "smsBodyState",
  default: "",
});

export const allSmsTemplateState = atom<string[][]>({
  key: "allSmsTemplateState",
  default: [],
});