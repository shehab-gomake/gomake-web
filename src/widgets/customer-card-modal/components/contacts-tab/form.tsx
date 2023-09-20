import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { contactInputs1, contactInputs2 } from "../../inputs/contact-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { Stack } from "@mui/material";

interface IProps {
    contact: {
        id?: string;
        firstName?: string;
        lastName?: string;
        title?: string;
        position?: string;
        address?: string;
        tel1?: number;
        tel2?: number;
        phone?: number;
        fax?: string;
        mail?: string;
        index?: number;
    };
    onDelete: (value: number) => void;
    setContact: any;
}

const ContactForm = ({ contact, onDelete, setContact }: IProps) => {

    const { clasess } = useStyle();
    const { t } = useTranslation();
    const onChangeInputs = (key, value) => {
        setContact({ ...contact, [key]: value })
    }

    return (
        <div >
            <Stack direction={'row'} marginTop={"24px"} marginBottom={"24px"} gap={"20px"}  >
                {
                    contactInputs1(contact).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
            <Stack direction={'row'} marginBottom={"24px"} gap={"20px"}>
                {
                    contactInputs2(contact).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
            <Stack direction={'row'} >
                <a style={{ display: "flex", justifyContent: 'flex-start' }} onClick={() => onDelete(contact.index)} >
                    <RemoveIcon></RemoveIcon>
                    <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                </a>
            </Stack >
        </div>
    );
};

export { ContactForm };