import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "../../header-filter";
import { RemoveIcon } from "@/components/icons/icons";
import { t } from "i18next";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useCallback } from 'react';
import Switch from '@mui/material/Switch';

const AddressForm = ({ address, onDelete, setAddress }: any) => {

    const { clasess } = useStyle();
    const [cities, setCities] = useState([]);
    const [cityStreets, setCityStreets] = useState([]);
    const [selectedCity, setSelectedCity] = useState(address?.city);
    const [selectedStreet, setSelectedStreet] = useState(address?.street);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('/cities.json');
                const data = await response.json();
                setCities(data);
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
        const selectedCityLabel = value?.label;
        const selectedCityId = value?.id;
        const updatedAddress= {...address, city: selectedCityLabel};
        setSelectedCity(selectedCityLabel);
        setAddress(updatedAddress);
        const response1 = await fetch('/streets.json');
        const data1 = await response1.json();
        const selectedCityStreets = data1.filter((street) => street.city_code == selectedCityId);
        const streetsNames = selectedCityStreets.map(street => ({
            label: street.name,
            id: street.id
        }));
        setCityStreets(streetsNames);
        // street set by default to be the first option
        setSelectedStreet(streetsNames[0]?.label);
        const updatedAddressNew = {...updatedAddress, street: streetsNames[0]?.label };
        setAddress(updatedAddressNew);
    }, [address]);

    const handleStreetChange = useCallback(async (e: any, value: any) => {
        const selectedStreetLabel = value?.label;
        setSelectedStreet(selectedStreetLabel);
        setAddress({ ...address, street: selectedStreetLabel });
    }, [address]);

    return (
        <div>
            <Row style={{ marginBottom: '24px', marginTop: '24px' }} >
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.addressId")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.address1} onChange={(e) => setAddress({ ...address, address1: e.target.value })} />
                </Col >
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.city")}</span>
                    <HeaderFilter setAllOptions={citiesNames} style={clasess.autoComplateStyle} setPlaceholder="placeholder" val={selectedCity} onchange={handleCityChange} ></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.street")}</span>
                    <HeaderFilter setAllOptions={cityStreets} style={clasess.autoComplateStyle} setPlaceholder="placeholder" val={selectedStreet} onchange={handleStreetChange}></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.home")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.homeNumber} onChange={(e) => setAddress({ ...address, homeNumber: e.target.value })} />
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.entrance")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.entry} onChange={(e) => setAddress({ ...address, entry: e.target.value })} />
                </Col >
            </Row>
            <Row style={{ marginBottom: '24px' }}>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.floor")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.floor} onChange={(e) => setAddress({ ...address, floor: e.target.value })} />
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.apartment")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.apartment} onChange={(e) => setAddress({ ...address, apartment: e.target.value })} />
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.postalCode")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.po")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.postbox} onChange={(e) => setAddress({ ...address, postbox: e.target.value })} />
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.country")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.county} onChange={(e) => setAddress({ ...address, county: e.target.value })} />
                </Col>
            </Row>
            <Row style={{ display: "flex", width: "33%", flexWrap: "nowrap" }}>
                <Col style={{ display: "flex", flexDirection: "column", gap: "5px" }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.remarks")}</span>
                    <input style={clasess.inputStyle} type="text" placeholder="placeholder" value={address.notes} onChange={(e) => setAddress({ ...address, notes: e.target.value })} />
                    <a >
                        <Switch checked={address?.isDefault} size="small" onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })} />
                        <span style={clasess.switchHeaderStyle} >{t("customers.modal.default")}</span>
                    </a>
                </Col>
                <Col style={{ display: "flex", marginTop: "24px", justifyContent: 'flex-start' }} >
                    <a style={{ width: "102px" }} onClick={() => onDelete(address.index)} >
                        <RemoveIcon></RemoveIcon>
                        <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                    </a>
                </Col>
            </Row>
        </div>
    );
};

export { AddressForm };

