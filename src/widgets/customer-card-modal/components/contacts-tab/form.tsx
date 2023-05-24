import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { GomakePrimaryButton } from "@/components";
import { t } from "i18next";
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const ContactForm = ({ contact, onDelete }: any) => {

    const { clasess } = useStyle();
    const DocumentsOptions = React.useMemo(
        () => [t("quote"),
        t("order"),
        t("invoice"),
        t("receipt"),
        t("delivery note"),],
        []
    );

    return (
        <div style={{ width: "75%" ,marginBottom: '30px' }}>
            <Row  style={{  marginBottom: '8px'}}>
                <Col>
                    <h3 style={clasess.headersStyle} >First name:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >Last Name:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >title:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >role:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >Address:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >Phone 1:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
            </Row>
            <Row >
                <Col>
                    <h3 style={clasess.headersStyle} >Phone 2:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >Mobile:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >fax:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >E-mail:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >Default in document:</h3>
                    <HeaderFilter  setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle}></HeaderFilter>
                </Col>
                <Col>
                    <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(contact.index)}>Delete</GomakePrimaryButton>
                </Col>
            </Row>
        </div>
    );
};

export { ContactForm };

