import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { SecondSwitch } from "@/components/switch/second";
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

<Stack  direction={'row'} display={'flex'}  marginTop={"24px"} alignItems={"center"} justifyContent={"center"}>

                            {
                userInputs(user).map(item => <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
            }
            </Stack>
            <Row style={{ marginTop: "24px", marginBottom: '24px' }} >

                <Col>
                    <a style={{ display: "flex", justifyContent: 'flex-start' }} onClick={() => onDelete(user.index)} >
                        <RemoveIcon></RemoveIcon>
                        <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                    </a>
                </Col>
            </Row >
        </div>

    );
};

export { UserForm };

