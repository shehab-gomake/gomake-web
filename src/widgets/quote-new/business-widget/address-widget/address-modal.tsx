import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { useCallback, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { addressInputs } from "./address-inputs";
import { useStyle } from "./style";
import { useRecoilState, useRecoilValue } from "recoil";
import { addressModalState } from "./state";
import { useQuoteNew } from "@/pages-components/quote-new/use-quote";
import { quoteItemState } from "@/store";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { fetchS3JsonContent } from "@/utils/S3Content";

interface IProps {
    isUpdate?: boolean;
}
const AddressModal = ({ isUpdate }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { updateClientAddress, onClickAddNewAddress } = useQuoteNew();
    const { getAllClientAddress, clientAddressValue } = useQuoteGetData();
    const quoteStateValue = useRecoilValue<any>(quoteItemState);
    const [cities, setCities] = useState([]);
    const [cityStreets, setCityStreets] = useState([]);
    const [openModal, setOpenModal] = useRecoilState<boolean>(addressModalState);
    const [addressState, setAddressState] = useState<any>(quoteStateValue?.quoteAddresses[0]);

    const optionsWithDefault = [
        { id: 'null', city: 'add new address', entry: "", apartment: "" },
        ...clientAddressValue,
    ];

    const onChangeInputs = (key, value) => {
        if (key == "city") {
            setAddressState({ ...addressState, city: value, street: "" });
        } else {
            setAddressState({ ...addressState, [key]: value });
        }
    }

    useEffect(() => {
        getAllClientAddress();
    }, [quoteStateValue]);

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

    const addresses = useCallback(() => {
        const selectedCity = addressState?.city;
        const foundCity = cities.filter(city => city.Name == selectedCity);
        const filteredCityStreets = cityStreets.filter((street) => street.city_code == foundCity[0]?.Code);
        return addressInputs(addressState, cities, filteredCityStreets)
    }, [addressState, cities, cityStreets]);

    return (
        <div>
            <GoMakeModal
                insideStyle={classes.insideStyle}
                openModal={openModal}
                onClose={() => { setOpenModal(false); setAddressState(quoteStateValue?.quoteAddresses[0]) }}
                withClose={false}
            >
                <Stack display={"flex"} width={"330px"} gap={"12px"}>
                    <div style={classes.fieldContainer}>
                        <h3 style={classes.labelStyle}>{t("sales.quote.address")}</h3>
                        <GoMakeAutoComplate
                            disableClearable={true}
                            options={optionsWithDefault}
                            value={optionsWithDefault.find(address => address.id === addressState?.addressID)}
                            style={classes.autoComplateStyle}
                            placeholder={t("sales.quote.address")}
                            getOptionLabel={(item) => item?.city}
                            onChange={(e: any, item: any) => {
                                const { clientId, ...newAddressState } = item;
                                setAddressState(newAddressState);
                            }}
                        />
                    </div>
                    {
                        (cities && cities.length > 0 && cityStreets && cityStreets.length > 0) &&
                        addresses().map(item => <Stack width={"330px"}><FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    }
                    <SecondaryButton variant="contained" onClick={() => isUpdate ? updateClientAddress(addressState) : onClickAddNewAddress(addressState)} style={classes.saveBtn}>{isUpdate ? t("sales.quote.save") : t("sales.quote.add")}</SecondaryButton>
                </Stack>
            </GoMakeModal>
        </div>
    );
};

export { AddressModal };