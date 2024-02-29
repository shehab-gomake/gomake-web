
import { useRecoilState } from "recoil";
import { depositState } from "@/pages-components/deposits/components/states";
import { Stack } from "@mui/material";
import { DepositInputs } from "./deposit-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { DEPOSIT_ACTIONS } from "../enums";

interface IFiltersSection {
    actionType: DEPOSIT_ACTIONS;
}

const DepositFilterSection = ({ actionType }: IFiltersSection) => {

    const [deposit, setDeposit] = useRecoilState<any>(depositState);
    
    const onChangeDepositInputs = (key, value) => {
        setDeposit((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    return (
        <Stack direction="column" gap="10px">
            <Stack direction="row" gap="10px">
                {DepositInputs(deposit).slice(0, 2).map((item) => (
                    <FormInput input={item as IInput} changeState={onChangeDepositInputs} error={false} key={item.name} readonly={actionType === DEPOSIT_ACTIONS.Show} />
                ))}
            </Stack>
            <Stack display="flex" flexWrap="wrap" direction="row" gap="10px">
                {DepositInputs(deposit).slice(2, 8).map((item) => (
                    <FormInput input={item as IInput} changeState={onChangeDepositInputs} error={false} key={item.name} readonly={actionType === DEPOSIT_ACTIONS.Show} />
                ))}
            </Stack>
        </Stack>
    )
}
export { DepositFilterSection }