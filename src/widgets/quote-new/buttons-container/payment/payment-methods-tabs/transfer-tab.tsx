import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { useState } from "react";
import { TransferInputs } from "./transfer-inputs";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";

const TransferTab = () => {
    const { mapERPAccountsOptions , handleTotalTransferChange, totalTransfer} = usePaymentMethodsTabs();
    const [state, setState] = useState({ totalTransfer: totalTransfer});

    const onChangeTransferInputs = (key, value) => {
        if(key==="totalTransfer") 
        {
            handleTotalTransferChange(value);
        }
        setState({ ...state, [key]: value })
    }

    return (
        <Stack direction="row">
            <Stack padding="0 5px" direction="column" alignItems="flex-start" gap="20px">
                {TransferInputs(state, mapERPAccountsOptions).slice(0, 2).map((item) => (
                    <FormInput input={item as IInput} changeState={onChangeTransferInputs} error={false} readonly={!!item.readOnly} key={item.name} />
                ))}
            </Stack>
            <Stack padding="0 5px" direction="column" alignItems="flex-start" gap="20px">
                {TransferInputs(state, mapERPAccountsOptions).slice(2).map((item) => (
                    <FormInput input={item as IInput} changeState={onChangeTransferInputs} error={false}  readonly={!!item.readOnly} key={item.name} />
                ))}
            </Stack>
        </Stack>
    );
}
export { TransferTab }