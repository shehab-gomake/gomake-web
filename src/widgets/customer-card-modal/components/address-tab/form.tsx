import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { GomakePrimaryButton } from "@/components";
import { t } from "i18next";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';



const AddressForm = ({ address, onDelete }: any) => {

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
        <div style={{ marginBottom: '30px', width: "75%" }} >
            <Row  style={{  marginBottom: '8px'}} >
                <Col sm>
                    <h3 style={clasess.headersStyle} >Address ID:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col >
                <Col sm >
                    <h3 style={clasess.headersStyle} >City:</h3>
                    <HeaderFilter setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle}></HeaderFilter>
                </Col>
                <Col sm>
                    <h3 style={clasess.headersStyle} >Street:</h3>
                    <HeaderFilter setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle}></HeaderFilter>
                </Col>
                <Col sm>
                    <h3 style={clasess.headersStyle} >Home:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm>

                    <h3 style={clasess.headersStyle} >Entrance:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col >
                <Col sm >
                    <h3 style={clasess.headersStyle} >Phone 1:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
            </Row>
            <Row  >
                <Col sm={2}>
                    <h3 style={clasess.headersStyle} >Apartment:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm={2} >
                    <h3 style={clasess.headersStyle} >Postal Code:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm={2} >
                    <h3 style={clasess.headersStyle} >Country:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm={2}>
                    <h3 style={clasess.headersStyle} >E-mail:</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm={4} >
                    <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(address.index)}>Delete</GomakePrimaryButton>
                </Col>
            </Row>
        </div>
    );
};

export { AddressForm };

