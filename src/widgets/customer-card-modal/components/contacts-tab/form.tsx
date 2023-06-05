import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { GomakePrimaryButton } from "@/components";
import { t } from "i18next";
import { Col, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";


const ContactForm = ({ contact, onDelete }: any) => {

    const { clasess } = useStyle();
    const { t } = useTranslation();
    const DocumentsOptions = React.useMemo(
        () => [t("customers.modal.quote"),
        t("customers.modal.order"),
        t("customers.modal.invoice"),
        t("customers.modal.receipt"),
        t("customers.modal.deliveryNote"),],
        []
    );

    return (
        <div style={{ width: "75%" ,marginBottom: '30px' }}>
            <Row  style={{  marginBottom: '8px'}}>
                <Col>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.firstName")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.lastName")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.title")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.role")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.address")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.phone1")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
            </Row>
            <Row >
                <Col>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.phone2")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.mobile")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.fax")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.email")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col>
                <Col>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.defaultInDocument")}</h3>
                    <HeaderFilter  setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle}></HeaderFilter>
                </Col>
                <Col>
                    <GomakePrimaryButton style={clasess.autoButtonStyle} onClick={() => onDelete(contact.index)}>{t("customers.buttons.delete")}</GomakePrimaryButton>
                </Col>
            </Row>
        </div>
    );
};

export { ContactForm };

