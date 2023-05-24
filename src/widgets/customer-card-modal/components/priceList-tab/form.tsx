import * as React from "react";
import { useStyle } from "./style";
import { Switch } from "@mui/material";
import { Container, Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


const PriceListForm = () => {

    const { clasess } = useStyle();

    return (
        <Container style={{ paddingTop : "20px"}}>
            <Row >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >Scodex price list</h3>
                </Col >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >Cutting price list</h3>
                </Col >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >Silk and printing on products price list</h3>
                </Col>
            </Row>
            <Row  >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >Digital price list</h3>
                </Col >
                <Col style={{ display: "flex", alignItems: "center" }}>
                    <Switch />
                    <h3 style={clasess.headersStyle} >Notebooks price list</h3>
                </Col>
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >shelf products</h3>
                </Col>
            </Row>
            <Row  >
                <Col style={{ display: "flex", alignItems: "center" }} >
                    <Switch />
                    <h3 style={clasess.headersStyle} >Cups price list</h3>
                </Col >
                <Col style={{ display: "flex", alignItems: "center" }}>
                    <Switch />
                    <h3 style={clasess.headersStyle} >Books price list</h3>
                </Col>
                <Col style={{ display: "flex", alignItems: "center" }}>
                    <Switch />
                    <h3 style={clasess.headersStyle} >Bid price list</h3>
                </Col>
            </Row>
        </Container>
    );
};

export { PriceListForm };

