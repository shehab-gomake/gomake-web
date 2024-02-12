import { SecondaryButton } from "@/components/button/secondary-button";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TransferInputs } from "./transfer-inputs";



const TransferTab= () => {
    const { t } = useTranslation();
    const options = [{ label: t("Cash"), value: "true" }];
    const [state, setState] = useState({});
    const onChangeInputs = (key, value) => {
        setState({ ...state, [key]: value })
        console.log(state)
    }
    return (
            <Stack padding={"0 5px"} direction={'column'} width={"180px"} alignItems={"flex-start"} gap={"20px"}>
                {
                    TransferInputs(state, options).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
    );
}
export { TransferTab }