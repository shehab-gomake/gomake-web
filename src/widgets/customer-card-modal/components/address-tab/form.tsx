import * as React from "react";
import { useStyle } from "./style";
import { HeaderFilter } from "../../header-filter";
import { RemoveIcon } from "@/components/icons/icons";
import { t } from "i18next";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useCallback } from 'react';
import { SecondSwitch } from "@/components/switch/second";
import { GomakeTextInput } from "@/components/text-input/text-input";
import { fetchS3JsonContent } from "@/utils/S3Content";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { addressInputs1, addressInputs2, addressInputs3} from "../../inputs/address-inputs";

const AddressForm = ({ address, onDelete, setAddress }: any) => {

    const { clasess } = useStyle();
    const [cities, setCities] = useState([]);
    const [cityStreets, setCityStreets] = useState([]);
    // const [selectedCity, setSelectedCity] = useState(address?.city);
    // const [selectedStreet, setSelectedStreet] = useState(address?.street);

    const onChangeInputs = (key, value) => {
        setAddress({ ...address, [key]: value })
    }

    useEffect(() => {
        const fetchCities = async () => {
            try {
                let data = await fetchS3JsonContent("cities.json")
                setCities(data);
                let data1 = await fetchS3JsonContent("streets.json")
                setCityStreets(data1);

            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);
  

    // const handleCityChange = useCallback(async (e: any, value: any) => {
    //     const selectedCityLabel = value?.label;
    //     const selectedCityId = value?.id;
    //     const updatedAddress = { ...address, city: selectedCityLabel };
    //     setSelectedCity(selectedCityLabel);
    //     setAddress(updatedAddress);
    //     let data1 = await fetchS3JsonContent("streets.json")
    //     const selectedCityStreets = data1.filter((street) => street.city_code == selectedCityId);
    //     const streetsNames = selectedCityStreets.map(street => ({
    //         text: street.name,
    //         value: street.id
    //     }));
    //     setCityStreets(streetsNames);
    //     // street set by default to be the first option
    //     setSelectedStreet(streetsNames[0]?.text);
    //     const updatedAddressNew = { ...updatedAddress, street: streetsNames[0]?.text };
    //     setAddress(updatedAddressNew);
    // }, [address]);


    // const sss = useCallback(async (e: any, value: any) => {
    //     const selectedCityLabel = value?.label;
    //     const selectedCityId = value?.id;
    //     const updatedAddress = { ...address, city: selectedCityLabel };
    //     setSelectedCity(selectedCityLabel);
    //     setAddress(updatedAddress);
    //     let data1 = await fetchS3JsonContent("streets.json")
    //     const selectedCityStreets = data1.filter((street) => street.city_code == selectedCityId);
    //     const streetsNames = selectedCityStreets.map(street => ({
    //         text: street.name,
    //         value: street.id
    //     }));
    //     setCityStreets(streetsNames);
    //     // street set by default to be the first option
    //     setSelectedStreet(streetsNames[0]?.text);
    //     const updatedAddressNew = { ...updatedAddress, street: streetsNames[0]?.text };
    //     setAddress(updatedAddressNew);
    // }, [address]);


    // const handleStreetChange = useCallback(async (e: any, value: any) => {
    //     const selectedStreetLabel = value?.text;
    //     setSelectedStreet(selectedStreetLabel);
    //     setAddress({ ...address, street: selectedStreetLabel });
    // }, [address]); 



    
    return (
        <div>

            <Row style={{ marginBottom: '24px', marginTop: '24px' }}>
                {
                     ((cities && cities.length > 0) && (cityStreets && cityStreets.length > 0)) &&
                                     addressInputs1(address , cities , cityStreets).map(item => <Col style={{ display: "flex", width: "220px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
                }
            </Row>
            <Row style={{ marginBottom: '24px', marginTop: '24px' }}>
                {
                    addressInputs2(address).map(item => <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
                }
            </Row>

            <Row style={{ marginBottom: '24px', marginTop: '24px' , width: "40%"}}>
                {
                    addressInputs3(address).map(item => <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Col>)
                }
            </Row>

            {/* <Row style={{ marginBottom: '24px', marginTop: '24px' }} >
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.addressId")}</span>
                    <GomakeTextInput style={clasess.inputStyle} type="text" placeholder={t("customers.modal.addressId")} value={address.address1} onChange={(e) => setAddress({ ...address, address1: e.target.value })} />
                </Col >
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.city")}</span>
                    <HeaderFilter setAllOptions={citiesNames} style={clasess.autoComplateStyle} setPlaceholder={t("customers.modal.city")} val={selectedCity} onchange={handleCityChange} ></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.street")}</span>
                    <HeaderFilter setAllOptions={cityStreets} style={clasess.autoComplateStyle} setPlaceholder={t("customers.modal.street")} val={selectedStreet} onchange={handleStreetChange}></HeaderFilter>
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.home")}</span>
                    <GomakeTextInput style={clasess.inputStyle} type="text" placeholder={t("customers.modal.home")} value={address.homeNumber} onChange={(e) => setAddress({ ...address, homeNumber: e.target.value })} />
                </Col>
                <Col style={{ display: "flex", width: "180px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
                    <span style={clasess.headerStyle} >{t("customers.modal.entrance")}</span>
                    <GomakeTextInput style={clasess.inputStyle} type="text" placeholder={t("customers.modal.entrance")} value={address.entry} onChange={(e) => setAddress({ ...address, entry: e.target.value })} />
                </Col >
            </Row> */}

                <Col style={{ display: "flex", marginTop: "24px", justifyContent: 'flex-start' }} >
                    <a style={{ width: "102px" }} onClick={() => onDelete(address.index)} >
                        <RemoveIcon></RemoveIcon>
                        <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                    </a>
                </Col>


        </div>
    );
};

export { AddressForm };

