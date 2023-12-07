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
import { addressModalState } from "./state";
import { useQuoteNew } from "@/pages-components/quote-new/use-quote";
import { quoteItemState } from "@/store";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";


interface IProps {
    label?: string;
    isUpdate? :boolean;
}
const AddressModalNew = ({isUpdate} : IProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const [openModal, setOpenModal] = useRecoilState<boolean>(addressModalState);
    const quoteStateValue = useRecoilValue<any>(quoteItemState);
    const { getAllClientAddress, clientAddressValue } = useQuoteGetData();
    const { updateClientAddress , onClickAddNewAddress} = useQuoteNew();
    const cities = [{ Name: "1" }, { Name: "2" }];
    const streets = [{ name: "3" }, { name: "4" }];
    const [addressState, setAddressState] = useState<any>(quoteStateValue?.quoteAddresses[0]);

    const onChangeInputs = (key, value) => {
        setAddressState({ ...addressState, [key]: value });
    }

    useEffect(() => {
        getAllClientAddress();
    }, [quoteStateValue]);
 
    return ( 
        <div>
            <GoMakeModal
                insideStyle={classes.insideStyle}
                openModal={openModal}
                onClose={() => { setOpenModal(false)}}
                withClose={false}
            >
                <Stack display={"flex"} width={"330px"} gap={"12px"}>
                    <div style={classes.fieldContainer}>
                        <div style={classes.labelStyle}>{t("Address")}</div>
                        <GoMakeAutoComplate
                            options={clientAddressValue}
                            value={clientAddressValue.find(address => address.id === addressState?.id)}
                            style={classes.autoComplateStyle}
                            placeholder={t("address")}
                            getOptionLabel={(item) => item?.city}
                            onChange={(e: any, item: any) => { const { clientId, ...newAddressState } = item;
                            setAddressState(newAddressState);}}
                        />
                    </div>
                    {
                        addressInputs(addressState, cities, streets).map(item => <Stack width={"330px"}><FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    }
                    <SecondaryButton variant="contained" onClick={() => isUpdate ? updateClientAddress("test") : onClickAddNewAddress(addressState) } style={classes.saveBtn}>{isUpdate ? t("sales.quote.save"): t("add")}</SecondaryButton>
                </Stack>
            </GoMakeModal>
        </div>
    );
};

export { AddressModalNew };