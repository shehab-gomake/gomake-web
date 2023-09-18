import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { RemoveIcon } from "@/components/icons/icons";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeaderFilter } from "../header-filter";
import IContact from "@/types/IContact";
import { contactInputs1, contactInputs2 } from "../../inputs/contact-inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";


interface IProps {
    contact: IContact,
    onDelete: any,
    setContact: any,
}
const ContactForm = ({ contact, onDelete, setContact }: IProps) => {

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

    const onChangeInputs = (key, value) => {
        setContact({ ...contact, [key]: value })
    }

    return (
        <div >
            <Row style={{ marginBottom: '24px', marginTop: '24px' }}>
                {
                    contactInputs1(contact).map(item => <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
                }
            </Row>
            <Row style={{ marginBottom: '24px', marginTop: '24px' }}>
                {
                    contactInputs2(contact).map(item => <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
                }
            </Row>
            <Row style={{ marginBottom: '24px' }} >
                <Col md={3} style={{ display: "none" }}>
                    <span style={clasess.headerStyle} >{t("customers.modal.defaultInDocument")}</span>
                    <HeaderFilter setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle} setPlaceholder={t("customers.modal.defaultInDocument")} ></HeaderFilter>
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

