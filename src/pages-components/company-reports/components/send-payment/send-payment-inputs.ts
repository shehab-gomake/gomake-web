import { SendPaymentState } from "../utils/interfaces";

const SendPaymentInputs = (state: SendPaymentState) => {
  return [
    {
      name: "Name",
      label: "Name",
      type: "text",
      placeholder: "Name",
      required: false,
      parameterKey: "contactName",
      value: state?.contactName,
      options: [],
      isValid: true,
    },
    {
      name: "mobile",
      label: "customers.modal.mobile",
      type: "phone",
      placeholder: "customers.modal.mobile",
      required: false,
      parameterKey: "contactPhone",
      options: [],
      value: state?.contactPhone,
      isValid: true,
    },
    {
      name: "Mail",
      label: "Mail",
      type: "text",
      placeholder: "Mail",
      required: false,
      parameterKey: "contactMail",
      value: state?.contactMail,
      options: [],
      isValid: true,
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      placeholder: "Amount",
      required: false,
      parameterKey: "amount",
      value: state?.amount,
      options: [],
      isValid: true,
    },
    {
      name: "isAuthorizeOnly",
      label: "Is authorize only",
      type: "primeSwitch",
      required: false,
      parameterKey: "isAuthorizeOnly",
      options: [],
      value: state?.isAuthorizeOnly,
      isValid: true,
      direction: "row",
    },
  ];
};

export { SendPaymentInputs };
