import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { TransferInputs } from "./transfer-inputs";
import { usePaymentMethodsTabs } from "./use-payment-methods-tabs";
import { useRecoilState } from "recoil";

import { transferTabState } from "../../states";

// export const transferTabState = atom<any>({
//   key: 'transferTabState',
//   default: ({ totalTransfer, formattedOptions }) => {
//     const quoteItemValue = useRecoilValue(quoteItemState);
//     return {
//       quoteItemValue,
//       totalTransfer,
//       transferAccount: formattedOptions[0]?.value,
//     };
//   },
// });



const TransferTab = () => {
    const { formattedOptions , handleTotalTransferChange} = usePaymentMethodsTabs();
    const [state, setState] = useRecoilState(transferTabState);

    const onChangeTransferInputs = (key, value) => {
        if (key === "transferSum") {
          handleTotalTransferChange(value);
        }
        setState((prev) => ({
          ...prev,
          [key]: value,
        }));
      }

    
    return (
        <Stack direction="row">
            <Stack padding="0 5px" direction="column" alignItems="flex-start" gap="20px">
                {TransferInputs(state, formattedOptions).slice(0, 2).map((item) => (
                    <FormInput input={item as IInput} changeState={onChangeTransferInputs} error={false} readonly={!!item.readOnly} key={item.name} />
                ))}
            </Stack>
            <Stack padding="0 5px" direction="column" alignItems="flex-start" gap="20px">
                {TransferInputs(state, formattedOptions).slice(2).map((item) => (
                    <FormInput input={item as IInput} changeState={onChangeTransferInputs} error={false}  readonly={!!item.readOnly} key={item.name} />
                ))}
            </Stack>
        </Stack>
    );
}
export { TransferTab }