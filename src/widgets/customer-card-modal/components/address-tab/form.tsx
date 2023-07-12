import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { t } from "i18next";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useCallback } from 'react';


const AddressForm = ({ address, onDelete }: any) => {

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
        <div style={{ marginBottom: '30px', width: "75%" }} >
            <Row style={{ marginBottom: '8px' }} >
                <Col sm>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.addressId")}</h3>
                    <input style={clasess.inputStyle} type="text" />
                </Col >
                <Col>
                    <GoMakeAutoComplate
                        options={citiesNames}
                        style={clasess.autoComplateStyle}
                        placeholder={t("customers.selectAgent")}
                        onChange={handleCityChange}
                        value={selectedCity}
                    /></Col>

                <Col>
                    <GoMakeAutoComplate
                        options={dooo}
                        style={clasess.autoComplateStyle}
                        placeholder={t("tjrbeee")}
                    /></Col>
                <Col sm >
                    <h3 style={clasess.headersStyle} >{t("customers.modal.city")}</h3>
                    <HeaderFilter setAllOptions={citiesNames}
                        style={clasess.autoComplateStyle} value={selectedCity} onChange={handleCityChange} ></HeaderFilter>
                </Col>
                <Col sm>
                    <h3 style={clasess.headersStyle} >{t("customers.modal.street")}</h3>
                    <HeaderFilter setAllOptions={dooo} style={clasess.autoComplateStyle}></HeaderFilter>
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

