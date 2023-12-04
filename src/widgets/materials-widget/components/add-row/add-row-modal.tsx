import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeModal } from "@/components";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currenciesState, materialsMachinesState, openAddRowModalState } from "../../state";
import { rowInputs } from "./inputs";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAddCategoryRow } from "./use-add-row";

const AddRowModal = () => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const [rowData, setRowData] = useState<any>({});
    const { onAddCategoryRow } = useAddCategoryRow();
    const currencies = useRecoilValue(currenciesState);
    const machinesCategories =useRecoilValue<any>(materialsMachinesState);
    const [openModal, setOpenModal] = useRecoilState<boolean>(openAddRowModalState);

    const onChangeInputs = (key, value) => {
        setRowData({ ...rowData, [key]: value })
    }

    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={() => { setOpenModal(false), setRowData("") }}
            modalTitle={t("materials.buttons.addNewRow")}>
            <Stack display={"flex"} direction={'column'} marginTop={"10px"} >
                <Stack style={classes.inputsDivStyle}>
                    {
                        rowInputs(rowData, currencies, machinesCategories).map(item => <Stack width={"180px"} ><FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false}/></Stack>)
                    }
                </Stack>
                <SecondaryButton variant="contained" onClick={() => onAddCategoryRow(rowData)} style={classes.addBtnStyle}>{t("materials.buttons.add")}</SecondaryButton>
            </Stack>
        </GoMakeModal>
    );
};

export { AddRowModal };