import { useStyle } from "./style";
import { RemoveIcon } from "@/components/icons/icons";
import { t } from "i18next";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { fetchS3JsonContent } from "@/utils/S3Content";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { addressInputs1} from "../../inputs/address-inputs";
import { addressInputs2, addressInputs3} from "../../inputs/address-inputs-second";
import { useCallback } from "react";


const AddressForm = ({ address, onDelete, setAddress }: any) => {

    const { clasess } = useStyle();
    const [cities, setCities] = useState([]);
    const [cityStreets, setCityStreets] = useState([]);

    

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const data = await fetchS3JsonContent("cities.json")
                setCities(data);
                const data1 = await fetchS3JsonContent("streets.json")
                setCityStreets(data1);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);

    const onChangeInputs = (key, value) => {
        if (key =="city") {
           setAddress({ ...address, city: value, street: value });
        } else {
            setAddress({ ...address, [key]: value });
        }
    }

    const addresses = useCallback(() => {
    const selectedCity = address?.city;
    const foundCity = cities.filter(city => city.Name == selectedCity);
    const filteredCityStreets = cityStreets.filter((street) => street.city_code == foundCity[0]?.Code);
    return addressInputs1(address , cities , filteredCityStreets)

      }, [address ,cities , cityStreets ]);



      
    return (
        <div>
            <Row style={{ marginBottom: '24px', marginTop: '24px' }}>
                {
                     (cities && cities.length > 0 && cityStreets && cityStreets.length > 0) &&
                     addresses().map(item => <Col style={{ display: "flex", width: "220px", flexDirection: "column", alignItems: "flex-start", gap: "10px", }} >
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

