import * as React from "react";
import { useStyle } from "./style";
import { Switch } from "@mui/material";
import { Container, Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";


const PriceListForm = () => {

    const { clasess } = useStyle();
    const { t } = useTranslation();


    return (
        <Container style={{ paddingTop : "20px"}}>
            <Row >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.scodexPriceList")}</h3>
                </Col >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.digitalPriceList")}</h3>
                </Col >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.cupsPriceList")}</h3>
                </Col>
            </Row>
            <Row  >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.cuttingPriceList")}</h3>
                </Col >
                <Col style={{ display: "flex", alignItems: "center" }}>
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.notebooksPriceList")}</h3>
                </Col>
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.booksPriceList")}</h3>
                </Col>
            </Row>
            <Row  >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.silkAndPrintingOnProductPriceList")}</h3>
                </Col >
                <Col style={{ display: "flex", alignItems: "center" }}>
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.shelfPriceList")}</h3>
                </Col>
                <Col style={{ display: "flex", alignItems: "center" }}>
                    <Switch />
                    <h3 style={clasess.headersStyle} >{t("customers.modal.bidPriceList")}</h3>
                </Col>
            </Row>
        </Container>
    );
};

export { PriceListForm };

