import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { addressInputs } from "./address-inputs";
import { useStyle } from "./style";
import { useRecoilState, useRecoilValue } from "recoil";
import { addressModalState, isNewAddress } from "./state";
import { useQuoteNew } from "@/pages-components/quote-new/use-quote";
import { quoteItemState } from "@/store";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";

interface IProps {
    isUpdate?: boolean;
}
const AddressModal = ({ isUpdate }: IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const { updateClientAddress, onClickAddAddress, onClickAddNewAddress } = useQuoteNew();
    const { getAllClientAddress, clientAddressValue, addressSelect } = useQuoteGetData();
    const quoteStateValue = useRecoilValue<any>(quoteItemState);
    const [openModal, setOpenModal] = useRecoilState<boolean>(addressModalState);
    const [addressState, setAddressState] = useState<any>(quoteStateValue?.quoteAddresses[0]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [isNewAddressState, setIsNewAddressState] = useRecoilState<boolean>(isNewAddress);


    const onChangeInputs = (key, value) => {
        setAddressState({ ...addressState, [key]: value });
    }

    useEffect(() => {
        getAllClientAddress();
        if (quoteStateValue?.quoteAddresses.length > 0) {
            const addressId = quoteStateValue?.quoteAddresses[0]?.addressID;
            const city = quoteStateValue?.quoteAddresses[0]?.city;
            setSelectedAddress({ label: city, value: addressId })
        }
        else {
            setSelectedAddress(addressSelect[0])
        }

    }, [quoteStateValue, openModal]);

    useEffect(() => {
        if (selectedAddress?.label == "add new address") {
            setAddressState({ ...addressState, city: "", street: "", addressId: "", apartment: "", entry: "" })
            setIsNewAddressState(true);
        }
        else if (selectedAddress) {
            setIsNewAddressState(false);
           const address = clientAddressValue.find(x => x.id === selectedAddress.value);
           setAddressState(address)
        }
    }, [selectedAddress]);

    return (

        <div>
            <GoMakeModal
                insideStyle={classes.insideStyle}
                openModal={openModal}
                onClose={() => { setOpenModal(false); setAddressState(quoteStateValue?.quoteAddresses[0]); }}
                withClose={false}
            >
                <Stack display={"flex"} width={"330px"} gap={"12px"}>
                    <div style={classes.fieldContainer}>
                        <h3 style={classes.labelStyle}>{t("sales.quote.address")}</h3>
                        <GoMakeAutoComplate
                            disableClearable={true}
                            options={addressSelect}
                            value={selectedAddress}
                            style={classes.autoComplateStyle}
                            placeholder={t("sales.quote.address")}
                            onChange={(e: any, value: any) => {
                                setSelectedAddress(value);
                            }}
                        />
                    </div>
                    {
                        addressInputs(addressState, isNewAddressState).map(item => <Stack width={"330px"}><FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    }
                    <SecondaryButton variant="contained" onClick={() => isNewAddressState ? onClickAddNewAddress(addressState , isUpdate) : isUpdate ? updateClientAddress(addressState) : onClickAddAddress(addressState)} style={classes.saveBtn}>{isUpdate ? t("sales.quote.save") : t("sales.quote.add")}</SecondaryButton>
                </Stack>
            </GoMakeModal>
        </div>
    );
};

export { AddressModal };