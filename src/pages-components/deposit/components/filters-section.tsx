import { useRecoilState, useRecoilValue } from "recoil";
import { depositState, newDepositState } from "@/pages-components/deposits/components/states";
import { Stack } from "@mui/material";
import { DepositInputs, newDepositInputs } from "./deposit-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { DEPOSIT_ACTIONS } from "../enums";

interface IFiltersSection {
    actionType: DEPOSIT_ACTIONS;
    accountsOptions?: any;
}

const DepositFilterSection = ({ actionType, accountsOptions }: IFiltersSection) => {

    const deposit = useRecoilValue<any>(depositState);
    const [newDeposit, setNewDeposit] = useRecoilState<any>(newDepositState);

    const onChangeDepositInputs = (key, value) => {
        setNewDeposit((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    return (
        <Stack direction="column" gap="10px">
            <Stack direction="row" gap="10px">
                {(actionType === DEPOSIT_ACTIONS.Create ? newDepositInputs(newDeposit, accountsOptions) : DepositInputs(deposit)).slice(0, 2).map((item) => (
                    <FormInput
                        input={item as IInput}
                        changeState={onChangeDepositInputs}
                        error={false}
                        key={item.name}
                        readonly={actionType === DEPOSIT_ACTIONS.Show}
                    />
                ))}
            </Stack>
            <Stack display="flex" flexWrap="wrap" direction="row" gap="10px">
                {(actionType === DEPOSIT_ACTIONS.Create ? newDepositInputs(newDeposit, accountsOptions) : DepositInputs(deposit)).slice(2, 9).map((item) => (
                    <FormInput input={item as IInput} changeState={onChangeDepositInputs} error={false} key={item.name} readonly={!!item.readOnly} />
                ))}
            </Stack>
        </Stack>
    )
}
export { DepositFilterSection }