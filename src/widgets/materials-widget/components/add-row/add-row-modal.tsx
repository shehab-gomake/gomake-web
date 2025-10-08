import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { GoMakeModal } from "@/components";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currenciesState,
  materialHeadersState,
  materialsClientsState,
  materialsMachinesState,
  materialsParametersState,
  openAddRowModalState,
} from "../../state";
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
  const { classes } = useStyle();
  const { alertFaultGetData, alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();

  const { onAddCategoryRow, rowData, setRowData } = useAddCategoryRow(
    props.isAdmin
  );
  const currencies = useRecoilValue(currenciesState);
  const machinesCategories = useRecoilValue<any>(materialsMachinesState);
  const [clientsCategories, setClientsCategories] = useRecoilState<any>(
    materialsClientsState
  );
  const [, setParameterCategories] = useRecoilState(materialsParametersState);

  const { renderOptions, checkWhatRenderArray, isFetching, listClient } =
    useCustomerDropDownList({});

  useEffect(() => {
    const options = renderOptions();
    if (options?.length > 0) setClientsCategories(options);
  }, [listClient]);

  const [openModal, setOpenModal] =
    useRecoilState<boolean>(openAddRowModalState);
  const materialHeaders =
    useRecoilValue<
      { key: string; value: string; inputType: number; values: any[] }[]
    >(materialHeadersState);
  const notebookTypesObj = materialHeaders?.find(
    (item) => item.key === "notebookTypes"
  );
  const getParameterValuesById = async (data: any) => {
    const callBack = (res) => {
      if (res.success) {
        setParameterCategories(res?.data);
      } else {
        alertFaultGetData();
      }
    };
    await GetParameterValuesByIdAi(callApi, callBack, {
      Id: data?.parameterId,
    });
  };

  useEffect(() => {
    if (notebookTypesObj) {
      getParameterValuesById(notebookTypesObj);
    }
  }, [notebookTypesObj]);

  const onChangeInputs = (key, value) => {
    setRowData({ ...rowData, [key]: value as string });
  };
  const validateRequiredFields = (
    headers: any[],
    rowData: Record<string, any>
  ) => {
    let filterheaders = headers?.filter(
      (header) => (header.key !== "price Unit / ton"
        && header.key !== "price m^2 / Pack"
        && header.key !== "price Roll / M^2"
        && header.key !== "Price Staple / pack"
        && header.key !== "price"
        && header.key !== "Price Unit/pack"
        && header.key !== "Price unit / per meter"
        && header.key !== "Price Piercing / pack"
        && header.key !== "CostPerRollPerSquareMeterPerTon"
        && header.key !== "price unit / M^2"
        && header.key !== "price unit/pack"
        && header.inputType !== 2  // Exclude switch fields (type 2) from validation
      )
    );
    const missingFields: string[] = [];
    // Check each header
    filterheaders.forEach((header) => {
      // If field is required and either doesn't exist in rowData or is empty
      if (
        header.isRequired &&
        (!rowData.hasOwnProperty(header.key) ||
          rowData[header.key] === null ||
          rowData[header.key] === undefined ||
          rowData[header.key] === "")
      ) {
        missingFields.push(header.value);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  };
  const validateRequiredFieldsResult = validateRequiredFields(
    materialHeaders,
    rowData
  );
  return (
    <GoMakeModal
      insideStyle={classes.insideStyle}
      openModal={openModal}
      onClose={() => {
        setOpenModal(false), setRowData("");
      }}
      modalTitle={t("materials.buttons.addNewRow")}
    >
      <Stack display={"flex"} direction={"column"} marginTop={"10px"} gap={"10px"}>
        <Stack style={classes.inputsDivStyle} className="custom-scrollbar">
          {rowInputs(
            rowData,
            isFetching,
            materialHeaders,
            currencies,
            machinesCategories,
            clientsCategories
          ).map((item) => {
            return (
              <Stack width={"45%"}>
                <FormInput
                  input={item as IInput}
                  changeState={onChangeInputs}
                  error={false}
                  readonly={false}
                  checkWhatRenderArray={checkWhatRenderArray}
                  loading={item?.loading || false}
                  keyItem={"item"}
                />
              </Stack>
            );
          })}
        </Stack>
        <SecondaryButton
          variant="contained"
          onClick={() => {
            if (validateRequiredFieldsResult.isValid) {
              onAddCategoryRow(rowData, materialHeaders);
            } else {
              alertFault(
                `Cannot add until required parameters are filled: ${validateRequiredFieldsResult.missingFields.join(
                  ", "
                )}`
              );
            }
          }}
          style={classes.addBtnStyle}
        >
          {t("materials.buttons.add")}
        </SecondaryButton>
      </Stack>
    </GoMakeModal>
  );
};

export { AddRowModal };
