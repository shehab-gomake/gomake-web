import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeModal } from "@/components";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currenciesState, materialHeadersState, materialsClientsState, materialsMachinesState, materialsParametersState, openAddRowModalState } from "../../state";
import { rowInputs } from "./inputs";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAddCategoryRow } from "./use-add-row";
import { useCustomerDropDownList, useGomakeAxios, useSnackBar } from "@/hooks";
import { GetParameterValuesByIdAi } from "@/services/api-service/parameters/parameters-outputs";
interface IAddRowModalProps {
    isAdmin: boolean;
}
const AddRowModal = (props: IAddRowModalProps) => {
    const { t } = useTranslation();
    const { classes } = useStyle()
    const [rowData, setRowData] = useState<any>({});
    const { alertFaultGetData, alertSuccessGetData } = useSnackBar();
    const { callApi } = useGomakeAxios();

    const { onAddCategoryRow } = useAddCategoryRow(props.isAdmin);
    const currencies = useRecoilValue(currenciesState);
    const machinesCategories = useRecoilValue<any>(materialsMachinesState);
    const [clientsCategories, setClientsCategories] = useRecoilState<any>(materialsClientsState);
    const [, setParameterCategories] = useRecoilState(materialsParametersState)
    const {
        renderOptions,
        checkWhatRenderArray,
    } = useCustomerDropDownList()
    useEffect(() => {
        if (renderOptions()?.length > 0)
            setClientsCategories(renderOptions())
    }, [renderOptions])

    const [openModal, setOpenModal] = useRecoilState<boolean>(openAddRowModalState);
    const materialHeaders = useRecoilValue<{ key: string, value: string, inputType: number, values: any[] }[]>(materialHeadersState);
    const notebookTypesObj = materialHeaders?.find((item) => item.key === "notebookTypes")

    const getParameterValuesById = async (data: any) => {
        const callBack = res => {
            if (res.success) {
                setParameterCategories(res?.data)
            } else {
                alertFaultGetData()

            }
        }
        await GetParameterValuesByIdAi(callApi, callBack, { Id: data?.parameterId });
    };

    useEffect(() => {
        if (notebookTypesObj) {
            getParameterValuesById(notebookTypesObj)
        }
    }, [notebookTypesObj]);

    const onChangeInputs = (key, value) => {
        setRowData({ ...rowData, [key]: value })
    }
    return (
        <GoMakeModal
            insideStyle={classes.insideStyle}
            openModal={openModal}
            onClose={() => { setOpenModal(false), setRowData("") }}
            modalTitle={t("materials.buttons.addNewRow")}
        >
            <Stack display={"flex"} direction={'column'} marginTop={"10px"} >
                <Stack style={classes.inputsDivStyle}>
                    {
                        rowInputs(rowData, materialHeaders, currencies, machinesCategories, clientsCategories).map(item => <Stack width={"47%"} ><FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} checkWhatRenderArray={checkWhatRenderArray} /></Stack>)
                    }
                </Stack>
                <SecondaryButton variant="contained" onClick={() => onAddCategoryRow(rowData)} style={classes.addBtnStyle}>{t("materials.buttons.add")}</SecondaryButton>
            </Stack>
        </GoMakeModal>
    );
};

export { AddRowModal };