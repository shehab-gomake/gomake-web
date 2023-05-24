import * as React from "react";
import { useStyle } from "./style";
import { GomakePrimaryButton } from "@/components";
import { t } from "i18next";
import { Switch } from "@mui/material";

import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';



const CustomerForm = ({user,onDelete}: any) => {

    const { clasess } = useStyle();
    return (
        <div style={{ marginBottom: '30px', width: "65%" }} >
            <Row  style={{  marginBottom: '8px'}} >
                <Col >
                    <h3 style={clasess.headersStyle} >Username:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col >
                <Col >
                    <h3 style={clasess.headersStyle} >Password:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >Email:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col  style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >Log in using an email code</h3>
                </Col>
                <Col >
                <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(user.index)}>Delete</GomakePrimaryButton>
                </Col >
            </Row>
        </div>
    );
};

export { CustomerForm };

