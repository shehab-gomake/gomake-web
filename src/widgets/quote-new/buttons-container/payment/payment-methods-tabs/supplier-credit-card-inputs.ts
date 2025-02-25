const SupplierCreditCardInputs = (state, formattedOptions) => {
  return [
    {
      name: "creditCardAccount",
      label: "payment.accountCode",
      type: "select",
      required: false,
      placeholder: "payment.accountCode",
      parameterKey: "creditCardAccount",
      options: formattedOptions,
      value: state?.creditCardAccount,
      isValid: true,
      readOnly: false,
    },
    {
      name: "creditCardDate",
      label: "payment.creditCardDate",
      type: "date",
      placeholder: "payment.creditCardDate",
      required: false,
      parameterKey: "creditCardDate",
      value: state?.creditCardDate,
      options: [],
      isValid: true,
    },
    {
      name: "creditCardReference",
      label: "payment.creditCardReference",
      type: "text",
      placeholder: "payment.creditCardReference",
      required: false,
      parameterKey: "creditCardReference",
      value: state?.creditCardReference,
      options: [],
      isValid: true,
    },
    {
      name: "creditCardTotal",
      label: "payment.creditCardTotal",
      type: "number",
      placeholder: "payment.creditCardTotal",
      required: false,
      parameterKey: "creditCardTotal",
      value: state?.creditCardTotal,
      options: [],
      isValid: true,
    },
  ];
};

export { SupplierCreditCardInputs };
