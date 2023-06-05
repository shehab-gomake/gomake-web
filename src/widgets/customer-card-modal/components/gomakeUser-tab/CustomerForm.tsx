import * as React from "react";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { Switch } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";




const CustomerForm = ({user,onDelete}: any) => {

    const { clasess } = useStyle();
    const { t } = useTranslation();


    return (
        <div style={{ marginBottom: '30px', width: "65%" }} >
            <Row  style={{  marginBottom: '8px'}} >
                <Col >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.userName")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col >
                <Col >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.password")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.email")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col  style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.loginUsingEmailCode")}</h3>
                </Col>
                <Col >
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(user.index)}>{t("customers.buttons.delete")}</GomakePrimaryButton>
                </Col >
            </Row>
        </div>
    );
};

export { CustomerForm };

