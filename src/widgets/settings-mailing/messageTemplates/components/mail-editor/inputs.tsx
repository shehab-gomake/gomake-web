import { IMailProviders, mailProviderOptions } from "@/store/company-profile";
import { AppPassInfoIcon } from "@/widgets/settings-profile-widget/components/profiles/sender-email-auth/app-pass-info-widget";
import { ISMSTemplate } from "../../interfaces/interface";

const mailInputs = (state) => {
  return [
    {
      name: "sendEmailTo",
      label: "mailingSettings.sendEmailTo",
      type: "text",
      required: false,
      placeholder: "mailingSettings.sendEmailTo",
      parameterKey: "sendTo",
      options: [],
      value: state?.sendTo,
      isValid: true,
    },
    {
      name: "send to agent",
      label: "mailingSettings.sendToAgent",
      type: "primeSwitch",
      placeholder: "mailingSettings.sendToAgent",
      required: false,
      parameterKey: "isToAgent",
      options: [],
      value: state?.isToAgent,
      isValid: true,
      direction: "row",
    },
  ];
};

const mailInputs1 = (state: ISMSTemplate, mailingProviderType, t) => {
  return [
    {
      name: "mailingProviderType",
      label: "profileSettings.mailProvider",
      type: "select",
      placeholder: "profileSettings.mailProvider",
      required: false,
      parameterKey: "mailingProviderType",
      options: mailProviderOptions.map((pro) => ({
        text: t(pro.text),
        value: pro.value,
      })),
      value: mailingProviderType,
      machineInputType: "input",
      readonly: true,
    },
    {
      name: "sendFrom",
      label: "mailingSettings.sendFrom",
      type: "text",
      required: false,
      placeholder: "mailingSettings.enterEmail",
      parameterKey: "sendFrom",
      options: [],
      value: state?.sendFrom,
      isValid: true,
    },
    (mailingProviderType === IMailProviders.GMAIL ||
      mailingProviderType === IMailProviders.OUTLOOK) &&
      mailingProviderType && {
        name: "appPassword",
        label: "profileSettings.appPassword",
        type: "password",
        placeholder: "profileSettings.appPassword",
        required: true,
        parameterKey: "emailPassword",
        options: [],
        value: state.emailPassword,
        machineInputType: "input",
        isValid: true,
        // iconElement: (
        //   <AppPassInfoIcon youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
        // ),
      },
  ].filter(Boolean);
};

const mailInputs2 = (state) => {
  return [
    {
      name: "sendCopyToMainMail",
      label: "mailingSettings.sendCopyToMainMail",
      type: "switch",
      placeholder: "mailingSettings.sendCopyToMainMail",
      required: false,
      parameterKey: "sendMailCopy",
      options: [],
      value: state?.sendMailCopy,
      isValid: true,
      direction: "row",
    },
    {
      name: "fromAgentMail",
      label: "mailingSettings.fromAgentMail",
      type: "switch",
      placeholder: "mailingSettings.fromAgentMail",
      required: false,
      parameterKey: "sendFromAgent",
      options: [],
      value: state?.sendFromAgent,
      isValid: true,
      direction: "row",
    },
  ];
};

const mailInputs3 = (state) => {
  return [
    {
      name: "bccMail",
      type: "text",
      required: false,
      parameterKey: "bccMail",
      placeholder: "mailingSettings.enterEmail",
      options: [],
      value: state?.bccMail,
      isValid: true,
      disabled: !state?.sendMailCopy,
    },
    {
      name: "sendCopyToAgentMail",
      label: "mailingSettings.sendCopyToAgentMail",
      type: "switch",
      placeholder: "mailingSettings.sendCopyToAgentMail",
      required: false,
      parameterKey: "sendMailCopyToAgent",
      options: [],
      value: state?.sendMailCopyToAgent,
      isValid: true,
      direction: "row",
      disabled: !state?.sendMailCopy,
    },
  ];
};

export { mailInputs, mailInputs1, mailInputs2, mailInputs3 };
