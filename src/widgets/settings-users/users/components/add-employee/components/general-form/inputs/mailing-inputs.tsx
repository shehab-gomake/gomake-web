import { IMailProviders, mailProviderOptions } from "@/store/company-profile";
import { AppPassInfoIcon } from "@/widgets/settings-profile-widget/components/profiles/sender-email-auth/app-pass-info-widget";
import { Employee } from "@/widgets/settings-users/users/interface/employee";

const mailingInputs = (state: Employee, mailingProviderType, t) => {
  return [
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
      value: mailingProviderType,
      machineInputType: "input",
      readonly: true,
    },
    (mailingProviderType === IMailProviders.GMAIL || mailingProviderType === IMailProviders.OUTLOOK) &&
      mailingProviderType && {
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

export { mailingInputs };
