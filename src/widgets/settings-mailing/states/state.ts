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

export const smsTemplateState = atom<any>({
  key: "smsTemplateState",
  default: {},
});

export const subjectTextState = atom<string>({
  key: "subjectTextState",
  default: "<p><b>GoMake</b> template</p>" , 
});

export const templateVariablesState = atom<any>({
  key: "templateVariablesState",
  default: {},
});


// export const initState: ISmsTemplate = {
//   type: "",
//   subject: "",
//   body: "",
//   attachment:"",
//   variables: [],
// };
// export const smsTemplateState = atom<ISmsTemplate>({
//   key: "smsTemplateState",
//   default: initState,
// });