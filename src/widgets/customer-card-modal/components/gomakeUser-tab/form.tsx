import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
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
            <Stack direction={'row'} display={'flex'} marginTop={"24px"} alignItems={"center"} marginBottom={"24px"} gap="10px">
                {
                    userInputs(user).map(item => <Stack direction={'column'} display={"flex"} width="180px" alignItems="flex-start">
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                }
            </Stack>
            <Stack direction={'row'} display={'flex'} marginBottom={"24px"} >
                <Stack direction={'column'}>
                    <a style={{ display: "flex", justifyContent: 'flex-start' }} onClick={() => onDelete(user.index)} >
                        <RemoveIcon></RemoveIcon>
                        <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                    </a>
                </Stack>
            </Stack >
        </div>

    );
};

export { UserForm };

