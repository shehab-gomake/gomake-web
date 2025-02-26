import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { useRecoilState } from "recoil";
import { supplierCreditCardTabState } from "../../states";
import { useEffect, useState } from "react";
import { SupplierCreditCardInputs } from "./supplier-credit-card-inputs";

const SupplierCreditCardTab = () => {
  const { creditCardAccountsOptions, handleTotalSupplierCreditCardChange } =
    usePaymentMethodsTabs();
  const [state, setState] = useRecoilState(supplierCreditCardTabState);
  const [renderInputs, setRenderInputs] = useState(false);

  const onChangeSuppCreditCardInputs = (key, value) => {
    if (key === "creditCardTotal") {
      handleTotalSupplierCreditCardChange(value);
    }
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (creditCardAccountsOptions?.length > 0 && !state?.creditCardAccount) {
      const defaultOption = creditCardAccountsOptions?.find(
        (option) => option.isSelected
      ).value;

      setState((prev) => ({
        ...prev,
        transferAccount: defaultOption
          ? defaultOption
          : creditCardAccountsOptions[0]?.value,
      }));
    }
    setRenderInputs(true);
  }, [creditCardAccountsOptions, state]);

  return (
    <Stack direction="row">
      <Stack
        padding="0 5px"
        direction="column"
        alignItems="flex-start"
        gap="20px"
      >
        {renderInputs &&
          SupplierCreditCardInputs(state, creditCardAccountsOptions)
            .slice(0, 2)
            .map((item) => (
              <FormInput
                input={item as IInput}
                changeState={onChangeSuppCreditCardInputs}
                error={false}
                readonly={!!item.readOnly}
                key={item.name}
              />
            ))}
      </Stack>
      <Stack
        padding="0 5px"
        direction="column"
        alignItems="flex-start"
        gap="20px"
      >
        {renderInputs &&
          SupplierCreditCardInputs(state, creditCardAccountsOptions)
            .slice(2)
            .map((item) => (
              <FormInput
                input={item as IInput}
                changeState={onChangeSuppCreditCardInputs}
                error={false}
                readonly={!!item.readOnly}
                key={item.name}
              />
            ))}
      </Stack>
    </Stack>
  );
};
export { SupplierCreditCardTab };
