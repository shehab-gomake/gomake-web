import {
  ICompanyProfile,
  IMailProviders,
  mailProviderOptions,
} from "@/store/company-profile";
import { useTranslation } from "react-i18next";
import { AppPassInfoIcon } from "../sender-email-auth/app-pass-info-widget";

const companyCommunicationInputs = (state: ICompanyProfile) => {
  const { t } = useTranslation();
  return [
    {
      name: "smsServiceTitle",
      label: "profileSettings.smsServiceTitle",
      type: "text",
      placeholder: "profileSettings.smsServiceTitle",
      required: true,
      parameterKey: "smsServiceTitle",
      options: [],
      value: state.smsServiceTitle,
      machineInputType: "input",
      isValid: !!state.smsServiceTitle,
    },
    {
      name: "mailingProviderType",
      label: "profileSettings.mailProvider",
      type: "select",
      placeholder: "profileSettings.mailProvider",
      required: true,
      parameterKey: "mailingProviderType",
      options: mailProviderOptions.map((pro) => ({
        text: t(pro.text),
        value: pro.value,
      })),
      value: state.mailingProviderType,
      machineInputType: "input",
      isValid: !!state.mailingProviderType,
    },
    {
      name: "serviceEmail",
      label: "profileSettings.serviceEmail",
      type: "text",
      placeholder: "profileSettings.serviceEmail",
      required: true,
      parameterKey: "mailServiceEmail",
      options: [],
      value: state.mailServiceEmail,
      machineInputType: "input",
      isValid: !!state.mailServiceEmail,
    },
    state.mailingProviderType !== IMailProviders.AMAZON && {
      name: "appPassword",
      label: "profileSettings.appPassword",
      type: "password",
      placeholder: "profileSettings.appPassword",
      required: true,
      parameterKey: "appPassword",
      options: [],
      value: state.appPassword,
      machineInputType: "input",
      isValid: true,
      // iconElement: (
      //   <AppPassInfoIcon youtubeUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
      // ),
    },
  ].filter(Boolean);
};

export { companyCommunicationInputs };
