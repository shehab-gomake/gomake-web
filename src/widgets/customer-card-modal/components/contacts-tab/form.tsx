import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeaderFilter } from "../header-filter";
import IContact from "@/types/IContact";

interface IProps{
    contact:IContact,
    onDelete:any,
    setContact: any,
}
const ContactForm = ({contact , onDelete , setContact }:IProps) => {

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
            <Row style={{ marginBottom: '24px', marginTop: '24px' }}>
            <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.firstName")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })}/>
                </Col>
                <Col style={{display: "flex" , width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.lastName")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })}/>
                </Col>
                <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.title")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.title} onChange={(e) => setContact({ ...contact, title: e.target.value })} />
                </Col>
                <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.role")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.position} onChange={(e) => setContact({ ...contact, position: e.target.value })}/>
                </Col>
                <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.address")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })}/>
                </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }} >
            <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.phone1")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.tel1} onChange={(e) => setContact({ ...contact, tel1: e.target.value })}/>
                </Col>
                <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.phone2")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.tel2} onChange={(e) => setContact({ ...contact, tel2: e.target.value })}/>
                </Col>
                <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.mobile")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })}/>
                </Col>
                <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.fax")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.fax} onChange={(e) => setContact({ ...contact, fax: e.target.value })}/>
                </Col>
                <Col style={{display: "flex" , width: "180px",  flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.email")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={contact.mail} onChange={(e) => setContact({ ...contact, mail: e.target.value })}/>
                </Col>
            </Row>
            <Row style={{ marginBottom: '24px' }} >
                <Col md={3}  style={{display: "none"}}>
                    <span style={clasess.headerStyle} >{t("customers.modal.defaultInDocument")}</span>
                    <HeaderFilter setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder" ></HeaderFilter>
                </Col>
                <Col>
                    <a style={{ display: "flex", justifyContent: 'flex-start' }} onClick={() => onDelete(contact.index)} >
                        <RemoveIcon></RemoveIcon>
                        <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                    </a>
                </Col>
            </Row >
        </div>
    );
};

export { ContactForm };

