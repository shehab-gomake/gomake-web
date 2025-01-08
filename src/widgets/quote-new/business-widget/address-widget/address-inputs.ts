const addressInputs = (state: any, isNewAddressState: boolean) => {
  const commonInputs = [
    {
      name: "city",
      label: "sales.quote.city",
      type: "text",
      placeholder: "sales.quote.city",
      parameterKey: "city",
      options: [],
      value: state?.city,
      required: true,
    },
    {
      name: "street",
      label: "sales.quote.street",
      type: "text",
      placeholder: "sales.quote.street",
      required: false,
      parameterKey: "street",
      options: [],
      value: state?.street,
    },
    {
      name: "entrance",
      label: "sales.quote.entrance",
      type: "text",
      placeholder: "sales.quote.entrance",
      required: false,
      parameterKey: "entry",
      options: [],
      value: state?.entry,
    },
    {
      name: "apartment",
      label: "sales.quote.apartment",
      type: "text",
      placeholder: "sales.quote.apartment",
      required: false,
      parameterKey: "apartment",
      options: [],
      value: state?.apartment,
    },
  ];

  if (isNewAddressState) {
    return [
      {
        name: "addressId",
        label: "sales.quote.addressId",
        type: "text",
        placeholder: "sales.quote.addressId",
        parameterKey: "addressId",
        options: [],
        value: state?.addressId,
        required: true,
      },
      ...commonInputs,
    ];
  }
  return commonInputs;
};

export { addressInputs };
