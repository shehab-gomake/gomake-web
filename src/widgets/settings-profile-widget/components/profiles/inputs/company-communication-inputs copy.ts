import { ICompanyProfile } from "@/store/company-profile";

const companyCommunicationInputs = (state: ICompanyProfile) => {
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
      name: "serviceEmail",
      label: "profileSettings.serviceEmail",
      type: "text",
      placeholder: "profileSettings.serviceEmail",
      required: true,
      parameterKey: "email2",
      options: [],
      value: state.email2,
      machineInputType: "input",
      isValid: !!state.email2,
    },
  ];
};

export { companyCommunicationInputs };
