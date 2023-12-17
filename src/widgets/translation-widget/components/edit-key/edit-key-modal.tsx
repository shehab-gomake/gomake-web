import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeModal } from "@/components";
import { useState } from "react";
import { inputs } from "./inputs";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";

const TranslationModal = ({ openModal, setOpenModal, label, state, setState, handleEdit , data }: any) => {
    const { t } = useTranslation();
    const { classes } = useStyle()

    const onChangeInputs = (key, value) => {
        setState({ ...state, [key]: value })
    }

    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={() => { setOpenModal(false) }}
            modalTitle={t("Edit Translation")}>
            <Stack display={"flex"} direction={'column'} marginTop={"10px"} >
                <Stack display={"flex"} direction={'row'} gap={"25px"} flexWrap={"wrap"}  >
                    {
                        inputs(state).map(item => <Stack width={"180px"}  ><FormInput input={item as IInput} changeState={onChangeInputs} error={item.required && !item.value} readonly={!!item.readonly} /></Stack>)
                    }
                </Stack>
                <SecondaryButton variant="contained" onClick={() => handleEdit(data, state?.path, state?.key, state?.en)} style={classes.addBtnStyle}>{t("materials.buttons.add")}</SecondaryButton>
            </Stack>
        </GoMakeModal>

    );
};

export { TranslationModal };