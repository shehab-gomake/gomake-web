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
        () => [t("aa")],
        []
    );

    return (
        <div style={{ marginBottom: '30px', width: "75%" }} >
            <Row  style={{  marginBottom: '8px'}} >
                <Col sm>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.addressId")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col >
                <Col sm >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.city")}</h3>
                    <HeaderFilter setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle}></HeaderFilter>
                </Col>
                <Col sm>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.street")}</h3>
                    <HeaderFilter setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle}></HeaderFilter>
                </Col>
                <Col sm>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.home")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm>

                    <h3 style={clasess.headersStyle} >{t("customers.modal.entrance")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col >
                <Col sm >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.phone1")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
            </Row>
            <Row  >
                <Col sm={2}>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.apartment")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm={2} >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.postalCode")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm={2} >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.country")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm={2}>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.email")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col sm={4} >
                    <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(address.index)}>{t("customers.buttons.delete")}</GomakePrimaryButton>
                </Col>
            </Row>
        </div>
    );
};

export { AddressForm };

