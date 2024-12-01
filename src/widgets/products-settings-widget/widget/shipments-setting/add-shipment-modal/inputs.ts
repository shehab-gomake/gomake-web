const addShipmentModalInputs = (state: any, t) => {
  return [
    {
      name: "title",
      label: "shipmentTypes.title",
      type: "text",
      placeholder: "shipmentTypes.title",
      required: true,
      parameterKey: "title",
      options: [],
      value: state?.title,
      isValid: true,
    },
    {
      name: "initialPrice",
      label: "shipmentTypes.startingPrice",
      type: "number",
      placeholder: "shipmentTypes.startingPrice",
      required: true,
      parameterKey: "initialPrice",
      options: [],
      value: state?.initialPrice,
      isValid: true,
    },
    {
      name: "freeShipmentStartPrice",
      label: "shipmentTypes.freeShipping",
      type: "number",
      placeholder: "shipmentTypes.freeShipping",
      required: false,
      parameterKey: "freeShipmentStartPrice",
      options: [],
      value: state?.freeShipmentStartPrice,
      isValid: true,
    },
    {
      name: "isInternal",
      label: "customers.modal.shipmentType",
      type: "select",
      placeholder: "customers.modal.shipmentType",
      required: false,
      parameterKey: "isInternal",
      options: [
        { value: true, text: t("shipmentTypes.internalShipping") },
        { value: false, text: t("shipmentTypes.externalShipping") },
      ],
      value: state?.isInternal,
    },
  ];
};

export { addShipmentModalInputs };
