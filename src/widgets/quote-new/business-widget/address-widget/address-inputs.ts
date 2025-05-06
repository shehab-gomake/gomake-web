import { countriesWithCodes } from "@/hooks/use-company-profile";
import { usStates } from "@/utils/constants/us-states";

const addressInputs = (state: any, isUsAddress: boolean) => {
  if (isUsAddress) {
    const usInputs = [
      {
        name: "country",
        label: "customers.modal.country",
        type: "select",
        placeholder: "customers.modal.country",
        required: false,
        parameterKey: "country",
        options: countriesWithCodes,
        value: state?.country,
      },
      {
        name: "address2",
        label: "customers.modal.address2",
        type: "text",
        placeholder: "customers.modal.address2",
        required: false,
        parameterKey: "address2",
        options: [],
        value: state?.address2,
      },
      {
        name: "address3",
        label: "customers.modal.address3",
        type: "text",
        placeholder: "customers.modal.address3",
        required: false,
        parameterKey: "address3",
        options: [],
        value: state?.address3,
      },
      {
        name: "city",
        label: "sales.quote.city",
        type: "text",
        placeholder: "sales.quote.city",
        required: true,
        parameterKey: "city",
        options: [],
        value: state?.city,
      },
      state?.country === "US" && {
        name: "state",
        label: "customers.modal.state",
        type: "select",
        placeholder: "customers.modal.state",
        required: false,
        parameterKey: "state",
        options: usStates.map(({ name }) => ({ text: name, value: name })),
        value: state?.state,
      },
      {
        name: "zipCode",
        label: "customers.modal.zipCode",
        type: "text",
        placeholder: "customers.modal.zipCode",
        required: false,
        parameterKey: "zipCode",
        options: [],
        value: state?.zipCode,
      },
    ];
    return usInputs.filter(Boolean);
  } else {
    const intlInputs = [
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
      {
        name: "floor",
        label: "customers.modal.floor",
        type: "text",
        placeholder: "customers.modal.floor",
        required: false,
        parameterKey: "floor",
        options: [],
        value: state?.floor,
      },
      {
        name: "zipCode",
        label: "customers.modal.zipCode",
        type: "text",
        placeholder: "customers.modal.zipCode",
        required: false,
        parameterKey: "zipCode",
        options: [],
        value: state?.zipCode,
      },
      {
        name: "postbox",
        label: "customers.modal.po",
        type: "text",
        placeholder: "customers.modal.po",
        required: false,
        parameterKey: "postbox",
        options: [],
        value: state?.postbox,
      },
    ];

    return intlInputs;
  }
};

export { addressInputs };
