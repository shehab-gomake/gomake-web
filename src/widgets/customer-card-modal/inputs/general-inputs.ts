import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { emailRegex } from "@/utils/regex";

enum DiscountType {
  NONE = 1,
  byProduct,
  bySku,
}

const generalInputs = (
  typeClient,
  state,
  languagesOptions,
  t,
  ShipmentTypesList
) => {
  const { CheckPreferenceValue } = usePrintHousePreferences();

  const DiscountTypesList: { value: number; text: string }[] = [
    {
      value: DiscountType.byProduct,
      text: t(`customers.modal.${DiscountType[DiscountType.byProduct]}`),
    },
    {
      value: DiscountType.bySku,
      text: t(`customers.modal.${DiscountType[DiscountType.bySku]}`),
    },
  ];

  return [
    {
      name: "phone1",
      label: "customers.modal.phone",
      type: "phone",
      placeholder: "customers.modal.phone",
      required: false,
      parameterKey: "tel1",
      options: [],
      value: state?.tel1,
      isValid: true,
    },
    {
      name: "mainContactName",
      label: "customers.modal.mainContactName",
      type: "text",
      placeholder: "customers.modal.mainContactName",
      required: false,
      parameterKey: "mainContactName",
      options: [],
      value: state?.mainContactName,
      isValid: true,
    },
    {
      name: "mobile",
      label: "customers.modal.mobile",
      type: "phone",
      placeholder: "customers.modal.mobile",
      required: false,
      parameterKey: "phone",
      options: [],
      value: state?.phone,
      isValid: true,
    },
    {
      name: "clientLang",
      label: "customers.modal.language",
      type: "select",
      placeholder: "customers.modal.language",
      required: false,
      parameterKey: "clientLang",
      options: languagesOptions,
      value: state?.clientLang,
      isValid: true,
    },
    {
      name: "mail",
      label: "customers.modal.email",
      type: "text",
      placeholder: "customers.modal.email",
      required: false,
      parameterKey: "mail",
      options: [],
      value: state?.mail,
      isValid: !!state?.mail,
      regex: emailRegex,
    },
    // {
    //   name: "fax",
    //   label: "customers.modal.fax",
    //   type: "text",
    //   placeholder: "customers.modal.fax",
    //   required: false,
    //   parameterKey: "fax",
    //   options: [],
    //   value: state?.fax,
    //   isValid: true,
    // },
    {
      name: "agent",
      label: "customers.modal.agent",
      type: "select",
      placeholder: "customers.modal.agent",
      required: CheckPreferenceValue(
        EPreferences.IS_AGENT_REQUIRED_IN_CUSTOMERS
      ),
      parameterKey: "agentId",
      options: [],
      optionsUrl: "/v1/employee/get-all-agents",
      value: state?.agentId,
      isValid: true,
    },
    {
      name: "defaultDelivery",
      label: "customers.modal.defaultDelivery",
      type: "select",
      placeholder: "customers.modal.defaultDelivery",
      required: false,
      parameterKey: "shipmentTypeId",
      options: ShipmentTypesList,
      value: state?.shipmentTypeId,
      isValid: true,
    },
    {
      name: "default discount type",
      label: "customers.modal.defaultDiscountType",
      type: "select",
      placeholder: "customers.modal.defaultDiscountType",
      required: false,
      parameterKey: "discountType",
      options: DiscountTypesList,
      value: state?.discountType,
      isValid: true,
    },
    {
      name: "isActive",
      label: "customers.modal.active",
      type: "switch",
      placeholder: "customers.modal.active",
      required: false,
      parameterKey: "isActive",
      options: [],
      value: state?.isActive,
      isValid: true,
    },
    {
      name: "isOccasional",
      label: "customers.modal.anOccasionalCustomer",
      type: "switch",
      placeholder: "customers.modal.anOccasionalCustomer",
      required: false,
      parameterKey: "isOccasional",
      options: [],
      value: state?.isOccasional,
      isValid: true,
      disabled: typeClient == "S" ? true : false,
    },
    {
      name: "clientNotReceiveMessages",
      label: "customers.modal.clientNotReceiveMessages",
      type: "switch",
      placeholder: "customers.modal.clientNotReceiveMessages",
      required: false,
      parameterKey: "clientNotReceiveMessages",
      options: [],
      value: state?.clientNotReceiveMessages,
      isValid: true,
    },
  ];
};

const lastOrderInputs = (state) => {
  return [
    {
      name: "lastOrderContactName",
      label: "customers.modal.name",
      type: "text",
      placeholder: "customers.modal.name",
      required: false,
      parameterKey: "lastOrderContactName",
      options: [],
      value: state?.lastOrderContactName,
      isValid: true,
      readonly: true,
    },
    {
      name: "lastOrderContactPhone",
      label: "customers.modal.phone",
      type: "text",
      placeholder: "customers.modal.phone",
      required: false,
      parameterKey: "lastOrderContactPhone",
      options: [],
      value: state?.lastOrderContactPhone,
      isValid: true,
      readonly: true,
    },
    {
      name: "lastOrderContactMail",
      label: "customers.modal.email",
      type: "text",
      placeholder: "customers.modal.email",
      required: false,
      parameterKey: "lastOrderContactMail",
      options: [],
      value: state?.lastOrderContactMail,
      isValid: true,
      readonly: true,
    },
    {
      name: "lastOrderContactAddress",
      label: "customers.modal.address",
      type: "text",
      placeholder: "customers.modal.address",
      required: false,
      parameterKey: "lastOrderContactAddress",
      options: [],
      value: state?.lastOrderContactAddress,
      isValid: true,
      readonly: true,
    },
  ];
};

export { generalInputs, lastOrderInputs };
