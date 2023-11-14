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
import { useAddCategoryRow } from "./use-add-row";

const AddRowModal = () => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const [rowData, setRowData] = useState<any>({});
    const [openModal, setOpenModal] = useRecoilState<boolean>(openAddRowModalState);
    const {onAddCategoryRow} = useAddCategoryRow();

    const onChangeInputs = (key, value) => {
        setRowData({ ...rowData, [key]: value })
    }

    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={() => setOpenModal(false)}
            modalTitle={t("Add row")}>
            <Stack direction={'column'} marginBottom={"15px"} marginTop={"15px"} gap={"20px"} >
                {
                    rowInputs(rowData).map(item => <Stack direction={'row'} width={"180px"} > <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} /></Stack>)
                }
                <SecondaryButton variant="contained" onClick={() => onAddCategoryRow(rowData)} style={classes.addBtnStyle}>{t("materials.buttons.add")}</SecondaryButton>
            </Stack>
        </GoMakeModal>

    );
};

export { AddRowModal };