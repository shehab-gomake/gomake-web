import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import Switch from "../switch-component";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const UserForm = ({ user, onDelete }: any) => {

    const { clasess } = useStyle();
    const { t } = useTranslation();

    return (
        <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "24px"}} >
            <Col style={{ display: "flex" , width: '180px' ,flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                <span style={clasess.headerStyle}>{t("customers.modal.userName")}</span>
                <input style={clasess.inputStyle} placeholder="placeholder" type="text" value={user?.username} />
            </Col >
            <Col style={{ display: "flex" , width: '180px' ,flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                <span style={clasess.headerStyle}>{t("customers.modal.password")}</span>
                <input style={clasess.inputStyle} placeholder="placeholder" type="text" value={user?.password} />
            </Col>
            <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", width: "180px" }}>
                <span style={clasess.headerStyle}>{t("customers.modal.email")}</span>
                <input style={clasess.inputStyle} placeholder="placeholder" type="text" value={user?.email}/>
                <a style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }} >
                    <Col style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </Col>
                    <span style={clasess.switchHeaderStyle} >{t("customers.modal.loginUsingEmailCode")}</span>
                </a>
            </Col>
            <Col style={{ display: "flex" , width: '180px' ,flexDirection: "column", alignItems: "flex-start", gap: "10px" , marginBottom: "24px"}}>
                <span style={clasess.headerStyle}>{t("customers.modal.IPaddress")}</span>
                <input style={clasess.inputStyle} placeholder="placeholder" type="text" value={user?.userIPAddress} />
            </Col>
            <Col style={{ width: '102px' }}>
                <a style={{ display: "flex", justifyContent: 'flex-start' }} onClick={() => onDelete(user.index)} >
                    <RemoveIcon></RemoveIcon>
                    <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                </a>
            </Col>
        </Row>
    );
};

export { UserForm };

