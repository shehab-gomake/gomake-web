import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";

const customerInputs = (typeClient, state, isEditMode) => {
  const { CheckPreferenceValue } = usePrintHousePreferences();
  const { CheckPermission } = useUserPermission();

  return [
    isEditMode && {
      name: "code",
      label: "customers.modal.code",
      type: "text",
      placeholder: isEditMode ? "" : "customers.modal.code",
      required: false,
      parameterKey: "code",
      options: [],
      value: state?.code,
      isValid: true,
      readonly: true,
    },
    {
      name: "name",
      label:
        typeClient === "C"
          ? "customers.modal.customerName"
          : "suppliers.supplierName",
      type: "text",
      placeholder:
        typeClient === "C"
          ? "customers.modal.customerName"
          : "suppliers.supplierName",
      required: true,
      parameterKey: "name",
      options: [],
      value: state?.name,
      isValid: true,
    },
    {
      name: "buisnessNumber",
      label: "customers.modal.vatNO",
      type: "text",
      placeholder: "customers.modal.vatNO",
      required: CheckPreferenceValue(
        EPreferences.IS_BUSINESS_NUMBER_REQUIRED_IN_CUSTOMERS
      ),
      parameterKey: "buisnessNumber",
      options: [],
      value: state?.buisnessNumber,
      isValid: true,
    },

    {
      name: "Currency",
      label: "customers.modal.currency",
      type: "select",
      placeholder: "customers.modal.currency",
      required: false,
      parameterKey: "currency",
      options: [],
      optionsUrl: "/v1/enum/get-enums/currency",
      value: state?.currency,
      isValid: true,
    },
    CheckPermission(Permissions.SHOW_CPA_CODE) && {
      name: "cpaClientCode",
      label: "customers.modal.CPAcode",
      type: "text",
      placeholder: "customers.modal.CPAcode",
      required: false,
      parameterKey: "cpaClientCode",
      options: [],
      value: state?.cpaClientCode,
      isValid: true,
    },
  ].filter(Boolean); // Remove any null/undefined values
};

export { customerInputs };
