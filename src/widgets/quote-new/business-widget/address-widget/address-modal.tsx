import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeModal } from "@/components";
import { useState } from "react";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { addressInputs } from "./address-inputs";
import { useStyle } from "./style";
import { useRecoilState } from "recoil";
import { addressModalState } from "./state";
import { useQuoteNew } from "@/pages-components/quote-new/use-quote";

const AddressModal = () => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const [state, setState] = useState<any>({});
    const [openModal, setOpenModal] = useRecoilState<boolean>(addressModalState);
    const {updateClientAddress} = useQuoteNew();
    const cities = [{ Name: "1" }, { Name: "2" }];
    const streets = [{ name: "3" }, { name: "4" }];

    const onChangeInputs = (key, value) => {
        if (key == "city") {
            setState({ ...state, city: value, street: "" });
        } else {
            setState({ ...state, [key]: value });
        }
    }
    return (
        <div>
            <GoMakeModal
                insideStyle={classes.insideStyle}
                openModal={openModal}
                onClose={() => { setOpenModal(false), setState(null) }}
                withClose={false}
            >
                <Stack display={"flex"} width={"330px"} gap={"12px"}>
                    {
                        addressInputs(state, cities, streets).map(item => <Stack width={"330px"}><FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                    }
                    <SecondaryButton variant="contained" onClick={()=>updateClientAddress(state)} style={classes.saveBtn}>{t("sales.quote.save")}</SecondaryButton>
                </Stack>
            </GoMakeModal>
        </div>
    );
};

export { AddressModal };