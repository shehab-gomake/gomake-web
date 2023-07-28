import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { RemoveIcon } from "@/components/icons/icons";
import { t } from "i18next";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useCallback } from 'react';
import Switch from "../switch-component";



const AddressForm = ({ address, onDelete , setAddress}: any) => {

    const { clasess } = useStyle();
    const [cities, setCities] = useState([]);
    const [streets, setStreets] = useState([]);
    const [streets1, setStreets1] = useState([]);
    const [dooo, setdooo] = useState([]);

    const [selectedCity, setSelectedCity] = useState([]);


    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('/cities.json');
                const data = await response.json();
                setCities(data);
                const response1 = await fetch('/streets.json');
                const data1 = await response1.json();
                setStreets(data1);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }

        };
        fetchCities();
    }, []);

    const citiesNames = cities.map(city => ({
        label: city.Name,
        id: city.Code
    }));

    const handleCityChange = useCallback(async (e: any, value: any) => {
        const selectedCity = value?.label;
        const selectedCityaa = value?.id;
        setSelectedCity(selectedCity);
        const selectedCityStreets = streets.filter((street) => street.city_code == selectedCityaa);
        console.log(selectedCityStreets);

        if (selectedCityStreets) {
            console.log("noooooooooooooooooooo");
            setStreets1(selectedCityStreets);
        }
    }, []);

    const getCityStreets = useCallback(async () => {
        const streetsNames = streets1.map(street => ({
            label: street.name,
            id: street.id
        }));
        setdooo(streetsNames)
    }, []);

    useEffect(() => {
        getCityStreets();
    }, [selectedCity]);


    return (
        <div>
            <Row style={{ marginBottom: '24px', marginTop: '14px' }} >
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.addressId")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col >
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.city")}</h3>
                    <HeaderFilter setAllOptions={citiesNames} style={clasess.autoComplateStyle} value={selectedCity} onChange={handleCityChange} setPlaceholder="placeholder" ></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.street")}</h3>
                    <HeaderFilter setAllOptions={dooo} style={clasess.autoComplateStyle} setPlaceholder="placeholder" ></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.home")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.entrance")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col >
            </Row>
            <Row style={{ marginBottom: '24px' }}>
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.floor")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.apartment")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.postalCode")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.po")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
                <Col style={{ display: "flex", width: "180px", height: "68px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.country")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                </Col>
            </Row>
            <Row style={{ display: "flex", width: "33%"}}>
                <Col style={{ display: "flex", flexDirection: "column", gap: "5px" }} >
                    <h3 style={clasess.headerStyle} >{t("customers.modal.remarks")}</h3>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" />
                    <a style={{ display: "flex", flexDirection: "row", gap: "8px"}} >
                        <Switch  checked={false} />
                        <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.default")}</h3>
                    </a>
                </Col>
                <Col style={{ display: "flex", marginTop: "24px", justifyContent: 'flex-start' }} >
                    <a onClick={() => onDelete(address.index)} >
                        <RemoveIcon></RemoveIcon>
                        <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                    </a>
                </Col>
            </Row>
        </div>
    );
};

export { AddressForm };

