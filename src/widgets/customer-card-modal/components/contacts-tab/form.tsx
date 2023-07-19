import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeaderFilter } from "../header-filter";


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
        <div >
            <Row style={{ marginBottom: '24px', marginTop: '14px' }}>
            <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.firstName")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.lastName")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.title")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.role")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.address")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }} >
            <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.phone1")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.phone2")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.mobile")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.fax")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{display: "flex" , width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.email")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }} >
                <Col md={3} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.defaultInDocument")}</h3>
                    <HeaderFilter setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col >
                    <a style={{ display: "flex", marginTop: "24px", justifyContent: 'flex-start' }} onClick={() => onDelete(contact.index)} >
                        <RemoveIcon></RemoveIcon>
                        <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                    </a>
                </Col>
            </Row >
        </div>
    );
};

export { ContactForm };

