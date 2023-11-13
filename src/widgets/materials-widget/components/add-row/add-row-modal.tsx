import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeModal } from "@/components";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { openAddRowModalState } from "../../state";
import { rowInputs } from "./inputs";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";

const AddRowModal = () => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const [row, setRow] = useState([]);
    const [openModal, setOpenModal] = useRecoilState<any>(openAddRowModalState);


    const onChangeInputs = (key, value) => {
        setRow({ ...row, [key]: value })
    }

    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={() => setOpenModal(false)}
            modalTitle={t("Add row")}>
            <Stack direction={'column'} marginBottom={"15px"} marginTop={"15px"}  gap={"20px"} >
                {
                    rowInputs(row).map(item => <Stack direction={'row'} width={"180px"} > <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                }
                <SecondaryButton variant="contained" onClick={() => alert("update button ")} style={classes.addBtnStyle}>Update</SecondaryButton>
            </Stack>
        </GoMakeModal>

    );
};

export { AddRowModal };