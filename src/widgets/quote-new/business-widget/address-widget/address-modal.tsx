import * as React from "react";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { addressInputs } from "./address-inputs";
import { useStyle } from "./style";
import { useAddressWidget } from "./use-address-widget";

interface IProps {
    isUpdate?: boolean;
}
const AddressModal = ({ isUpdate }: IProps) => {
    const { classes } = useStyle();
    const { t,
        onChangeInputs,
        addressState,
        openModal,
        setOpenModal,
        addressSelect,
        selectedAddress,
        isNewAddressState,
        onClickAddAddress,
        onClickAddNewAddress,
        updateClientAddress,
        setSelectedAddress } = useAddressWidget();
    const buttonLabel = isUpdate ? t("sales.quote.save") : t("sales.quote.add")

    const handleClick = () => {
        if (isNewAddressState) {
            onClickAddNewAddress(addressState, isUpdate);
        } else if (isUpdate) {
            updateClientAddress(addressState);
        } else {
            onClickAddAddress(addressState);
        }
    };

    return (
        <div>
            <GoMakeModal
                insideStyle={classes.insideStyle}
                openModal={openModal}
                onClose={() => { setOpenModal(false); }}
                withClose={false}
            >
                <Stack style={classes.stackStyle}>
                    <div style={classes.fieldContainer}>
                        <h3 style={classes.labelStyle}>{t("sales.quote.address")}</h3>
                        <div style={{padding: '6.5px 14px'}}>
                            <GoMakeAutoComplate
                                disableClearable={true}
                                options={addressSelect}
                                value={selectedAddress}
                                style={classes.autoComplateStyle}
                                placeholder={t("sales.quote.address")}
                                onChange={(e: any, value: any) => {
                                    setSelectedAddress(value);
                                }}
                            /></div>
                    </div>
                    {
                        addressInputs(addressState, isNewAddressState).map(item => <Stack width={"330px"}><FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    }
                    <SecondaryButton variant="contained" onClick={handleClick} style={classes.saveBtn}>{buttonLabel}</SecondaryButton>
                </Stack>
            </GoMakeModal>
        </div>
    );
};

export { AddressModal };