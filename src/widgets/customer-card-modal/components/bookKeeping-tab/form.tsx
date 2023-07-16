import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HeaderFilter } from "./header-filter";
import { AntSwitch } from "../switch-component";

const BookKeepingForm = () => {

    const { clasess } = useStyle();
    const { t } = useTranslation();
    const testOptions = React.useMemo(
        () => ["option1", "option2", "option3"],
        []
    );

    return (
        <div >
            <Row style={{ display: "flex", width: "795px", height: "68px", justifyContent: "center", marginTop: "24px",marginBottom: "24px",gap: "16px" }}>
                <Col >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.termsOfPayment")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col  >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.paymentConsolidation")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col  >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.vatStatus")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", flexDirection: "row", gap: "8px" }} >
                    <AntSwitch inputProps={{ 'aria-label': 'ant design' }} />
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.holdingTax")}</h3>
                </Col>
            </Row>
            <Row style={{ display: "flex", width: "790px", height: "68px", justifyContent: "center",  gap: "16px" }} >
                <Col>
                    <h3 style={clasess.headerStyle} >{t("customers.modal.closingInvoice")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col>
                    <h3 style={clasess.headerStyle} >{t("customers.modal.closingDocument")}</h3>
                    <HeaderFilter setAllOptions={testOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
                </Col>
                <Col >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.laminationOfLiability")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.balanceManagement")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
            </Row>
        </div>
    );
};

export { BookKeepingForm };

