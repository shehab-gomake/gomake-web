import {
  CreditClearanceCompanies,
  ICompanyProfile,
} from "@/store/company-profile";

const companyCreditCardsInputs = (state: ICompanyProfile) => {
  const clearanceCompanies = [
    { value: CreditClearanceCompanies.PAYME, text: "PAYME" },
    { value: CreditClearanceCompanies.Z_CREDIT, text: "Z-credit" },
    { value: CreditClearanceCompanies.YAAD_PAY, text: "Yaad pay" },
  ];

  return [
    {
      name: "creditClearanceCompany",
      label: "profileSettings.clearanceCompany",
      type: "select",
      placeholder: "profileSettings.clearanceCompany",
      required: false,
      parameterKey: "creditClearanceCompany",
      value: state?.creditClearanceCompany,
      options: clearanceCompanies,
      isValid: true,
      readOnly: false,
    },

    {
      name: "terminalNumber",
      label: "profileSettings.terminalNumber",
      type: "text",
      placeholder: "profileSettings.terminalNumber",
      required: false,
      parameterKey: "terminalNumber",
      options: [],
      value: state?.terminalNumber,
      machineInputType: "input",
      isValid: !!state?.terminalNumber,
    },
    {
      name: "terminalPassword",
      label: "profileSettings.terminalPassword",
      type: "password",
      placeholder: "profileSettings.terminalPassword",
      required: false,
      parameterKey: "terminalPassword",
      options: [],
      value: state?.terminalPassword,
      machineInputType: "input",
      isValid: !!state?.terminalPassword,
    },
  ];
};

const pinPadsInputs = (state: ICompanyProfile) => {
  return [
    {
      name: "",
      parameterKey: "pinPads",
      value: state?.pinPads || [],
      machineInputType: "multiArrayInput",
      isValid: true,
      inputs: [
        {
          name: "name",
          label: "profileSettings.name",
          type: "text",
          placeholder: "profileSettings.name",
          required: false,
          parameterKey: "name",
          options: [],
          readonly: true,
          isValid: true,
        },
        {
          name: "number",
          label: "machineAttributes.number",
          type: "text",
          placeholder: "machineAttributes.number",
          required: false,
          parameterKey: "number",
          options: [],
          readonly: true,
          isValid: true,
        },
      ],
    },
  ];
};

export { companyCreditCardsInputs, pinPadsInputs };
