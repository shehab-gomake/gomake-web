import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeaderFilter } from "./header-filter";
import { SecondSwitch } from "@/components";

const BookKeepingForm = () => {

    const { clasess } = useStyle();
    const { t } = useTranslation();
    const testOptions = React.useMemo(
        () => ["option1", "option2", "option3"],
        []
    );

    return (
        <div style={{ display: "flex", width: "779px", height: "160px" , flexDirection: "column", alignItems: "flex-start", gap: "24px", marginTop: "16px" }}>
            <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", }}>
                <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" , width: "180px" , height: "68px"}}>
                    <h3 style={clasess.headerStyle} >{t("customers.modal.termsOfPayment")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" , width: "180px" , height: "68px"}}>
                    <h3 style={clasess.headerStyle  } >{t("customers.modal.paymentConsolidation")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" , width: "180px" , height: "68px"}}>
                    <h3 style={clasess.headerStyle} >{t("customers.modal.vatStatus")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" , width: "191px" , height: "68px"}}>
                <SecondSwitch checked={false} ></SecondSwitch>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.holdingTax")}</h3>
                </Col>
            </Row>
            <Row style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", }}>
            <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" , width: "180px" , height: "68px"}}>
                    <h3 style={clasess.headerStyle} >{t("customers.modal.closingInvoice")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" , width: "180px" , height: "68px"}}>
                    <h3 style={clasess.headerStyle} >{t("customers.modal.closingDocument")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" , width: "180px" , height: "68px"}}>
                    <h3 style={clasess.headerStyle} >{t("customers.modal.laminationOfLiability")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" , width: "180px" , height: "68px"}}>
                    <h3 style={clasess.headerStyle} >{t("customers.modal.balanceManagement")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
            </Row>
        </div>
    );
};

export { BookKeepingForm };

