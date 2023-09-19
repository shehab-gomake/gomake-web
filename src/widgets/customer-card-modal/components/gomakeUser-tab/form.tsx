import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { userInputs } from "../../inputs/user-inputs";
import { Stack } from "@mui/material";

const UserForm = ({ user, onDelete, setUser }: any) => {

    const { clasess } = useStyle();
    const { t } = useTranslation();
    const onChangeInputs = (key, value) => {
        setUser({ ...user, [key]: value })
    }

    return (
        <div >
            <Stack direction={'row'} marginTop={"24px"} marginBottom={"24px"} gap="20px">
                {
                    userInputs(user).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
            <Stack direction={'row'} >
                <a style={{ display: "flex", justifyContent: 'flex-start' }} onClick={() => onDelete(user.index)} >
                    <RemoveIcon></RemoveIcon>
                    <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                </a>
            </Stack >
        </div>
    );
};

export { UserForm };