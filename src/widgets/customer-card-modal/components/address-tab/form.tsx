import { useStyle } from "./style";
import { RemoveIcon } from "@/components/icons/icons";
import { t } from "i18next";
import { useEffect, useState } from 'react';
import { fetchS3JsonContent } from "@/utils/S3Content";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { addressInputs1  , addressInputs2, addressInputs3  } from "../../inputs/address-inputs";
import { useCallback } from "react";
import { Stack } from "@mui/material";

interface IProps {
    address: {
        id?: string;
        addressID?: string;
        city?: string;
        street?: string;
        home?: string;
        entrance?: string;
        floor?: string;
        apartment?: string;
        postalcode?: number;
        po?: string;
        county?: string;
        remarks?: string;
        default?: boolean;
        index?: number;
    };
    onDelete: (value: number) => void;
    setAddress: any;
}

const AddressForm = ({ address, onDelete, setAddress }: IProps) => {

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
        if (key == "city") {
            setAddress({ ...address, city: value, street: value });
        } else {
            setAddress({ ...address, [key]: value });
        }
    }

    const addresses = useCallback(() => {
        const selectedCity = address?.city;
        const foundCity = cities.filter(city => city.Name == selectedCity);
        const filteredCityStreets = cityStreets.filter((street) => street.city_code == foundCity[0]?.Code);
        return addressInputs1(address, cities, filteredCityStreets)
    }, [address, cities, cityStreets]);




    return (
        <div>
            <Stack direction={'row'} marginTop={"24px"} marginBottom={"24px"} gap="20px">
                {
                    (cities && cities.length > 0 && cityStreets && cityStreets.length > 0) &&
                    addresses().map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
            <Stack direction={'row'} marginTop={"24px"} marginBottom={"24px"} gap="20px">
                {
                    addressInputs2(address).map(item =>
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
            <Stack direction={'row'} marginTop={"24px"} marginBottom={"24px"} gap="20px" width={"40%"}>
                {
                    addressInputs3(address).map(item =>
                        <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                }
            </Stack>
            <Stack direction={'row'}>
                <a style={{ display: "flex", justifyContent: 'flex-start' }} onClick={() => onDelete(address.index)} >
                    <RemoveIcon></RemoveIcon>
                    <button style={clasess.buttonsStyle} >{t("customers.buttons.remove")}</button>
                </a>
            </Stack>
        </div>
    );
};

export { AddressForm };