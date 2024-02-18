import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { useState } from "react";
import { TransferInputs } from "./transfer-inputs";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { useRecoilState } from "recoil";
import { quoteItemState } from "@/store";

const TransferTab = () => {
    const { mapERPAccountsOptions , handleTotalTransferChange, totalTransfer} = usePaymentMethodsTabs();
    const [quoteItemValue , setQuoteItemValue] = useRecoilState<any>(quoteItemState);
    const [state, setState] = useState({...quoteItemValue , transferTotal: totalTransfer});

    const onChangeTransferInputs = (key, value) => {
        if(key==="transferTotal") 
        {
            handleTotalTransferChange(value);
        }
        else {
            setQuoteItemValue((prev: any) => ({
                ...prev,
                [key]:value
            }));
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