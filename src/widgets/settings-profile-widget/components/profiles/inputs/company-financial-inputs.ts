import { ICompanyProfile } from "@/store/company-profile";

const companyFinancialInputs = (state: ICompanyProfile) => {
  const paymentDayReminder = Array.from({ length: 31 }, (_, index) => ({
    text: index + 1,
    value: index + 1,
  }));

  return [
    {
      name: "paymentReminder",
      label: "profileSettings.paymentReminder",
      type: "select",
      placeholder: "profileSettings.paymentReminder",
      required: true,
      parameterKey: "paymentReminder",
      options: paymentDayReminder,
      value: state.paymentReminder,
      machineInputType: "input",
      isValid: true,
    },
  ];
};

const bankAccountsInputs = (state: ICompanyProfile) => {
  return [
    {
      name: "",
      parameterKey: "bankAccounts",
      value: state?.bankAccounts || [],
      machineInputType: "multiArrayInput",
      isValid: true,
      inputs: [
        {
          name: "codeName",
          label: "profileSettings.accountCode",
          type: "text",
          placeholder: "profileSettings.accountCode",
          required: false,
          parameterKey: "codeName",
          options: [],
          isValid: true,
          readonly: true,
          isCombinedField: true,
          combinedFields: ["code", "name"],
        },
        {
          name: "bankName",
          label: "profileSettings.bankName",
          type: "text",
          placeholder: "profileSettings.bankName",
          required: false,
          parameterKey: "bankName",
          options: [],
          isValid: true,
        },
        {
          name: "bankBranch",
          label: "profileSettings.bankBranch",
          type: "text",
          placeholder: "profileSettings.bankBranch",
          required: false,
          parameterKey: "bankBranch",
          options: [],
          isValid: true,
        },
        {
          name: "bankAccountNUM",
          label: "profileSettings.bankAccountNUM",
          type: "text",
          placeholder: "profileSettings.bankAccountNUM",
          required: false,
          parameterKey: "bankAccountNUM",
          options: [],
          isValid: true,
        },
      ],
    },
  ];
};

export { companyFinancialInputs, bankAccountsInputs };
