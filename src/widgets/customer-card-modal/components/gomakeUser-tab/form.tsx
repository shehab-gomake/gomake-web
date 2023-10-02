import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { userInputs } from "../../inputs/user-inputs";
import { Stack } from "@mui/material";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { GoMakeModal } from "@/components";
import Button from "@mui/material/Button";
import { ChangePasswordComponent } from "../../change-password/change-password-component";
import { resetPassModalState } from "../../change-password/state";

interface IProps {
    user: {
        id?: string;
        username?: string;
        password?: string;
        email?: string;
        userIPAddress?: string;
        isCanLoginWithCode?: boolean;
        index?: number;
    };
    onDelete: (value: number) => void;
    setUser: any;
}

const UserForm = ({ user, onDelete, setUser }: IProps) => {

    const [openModal, setOpenModal] = useRecoilState<boolean>(resetPassModalState);
    const { clasess } = useStyle();
    const { t } = useTranslation();

    const showPass= user.id? true : false ; 

    const onChangeInputs = (key, value) => {
        if (key == "email") {
            setUser({ ...user, email: value, username: value });
        } else {
            setUser({ ...user, [key]: value });
        }
    }

    return (
        <div >
            <Stack direction={'row'} marginTop={"24px"} marginBottom={"24px"} gap="20px">
                {
                    userInputs(user , showPass).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={item.required && !item.value} readonly={false} />)
                }
            </Stack>
            <Stack direction={'row'} marginTop={"24px"} marginBottom={"24px"} gap="55px">
                {showPass && <Button style={clasess.changePassBtnStyle} onClick={() => setOpenModal(true)} variant={'contained'}>{t('customers.buttons.changePass')}</Button>}
            </Stack>
            <Stack direction={'row'} >
                <a style={{ display: "flex", justifyContent: 'flex-start', gap: "7px" }} onClick={() => onDelete(user.index)} >
                    <RemoveIcon></RemoveIcon>
                    <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                </a>
            </Stack >
            <GoMakeModal
                insideStyle={{ paddingLeft: 0, paddingRight: 0, height: 'fit-content', width: 380 }}
                headerPadding={20}
                openModal={openModal}
                onClose={() => setOpenModal(false)}
                modalTitle={t('customers.buttons.changePass')}
            >
                <ChangePasswordComponent userId={user.id} />
            </GoMakeModal>
        </div>


    );
};

export { UserForm };