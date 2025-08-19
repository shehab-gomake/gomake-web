import React, { useState } from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { Stack } from "@mui/material";
import { Checkbox, Paper } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { useStyle } from "./style";
import { useCustomerDropDownList } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { materialCategorySuppliersState } from "../../state";
import { ModalType } from "@/enums";

interface IProps {
  parameterKey: string;
  values: any[];
  id: string;
  isAdmin: boolean;
  options: { label: string; value: string }[];
  placeHolder?: string;
}

const MultiSelectClientsInput = ({
  values,
  parameterKey,
  id,
  isAdmin,
  options,
  placeHolder,
}: IProps) => {
  const { classes } = useStyle();
  const { updateCellData } = useTableCellData(isAdmin);
  const { renderOptions, checkWhatRenderArray } = useCustomerDropDownList({});
  const { t } = useTranslation();
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState);
  const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1;
  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] =
    useState<boolean>(false);
  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };

  const onClickOpenDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(true);
  };
  const [selectedChecked, setChecked] = useState(false);
  const [selectedOption, setOption] = useState<any>();
  const clientsOptions = renderOptions().map((client) => ({
    value: client.id,
    label: `${client.name} - ${client.code}`,
  }));

  // Helper function to normalize values array to simple IDs
  const normalizeValues = (vals: any[]): string[] => {
    return vals
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          return item.ID || item.id;
        }
        return item;
      })
      .filter((id) => id !== undefined && id !== null);
  };

  const normalizedValues = normalizeValues(values);

  const reorderedOptions = clientsOptions.sort((a, b) => {
    const isSelectedA = normalizedValues.includes(a.value);
    const isSelectedB = normalizedValues.includes(b.value);

    if (isSelectedA && !isSelectedB) {
      return -1;
    } else if (!isSelectedA && isSelectedB) {
      return 1;
    } else {
      return 0;
    }
  });

  const selectedLabels = normalizedValues
    ?.map(
      (selectedId) =>
        reorderedOptions?.find((opt) => opt?.value === selectedId)?.label
    )
    .filter((label) => label !== null && label !== undefined);

  const handleSelectCheck = (
    parameterKey: string,
    isChecked: boolean,
    option: any
  ) => {
    if (isHaveMorethanMaterialSuppliers) {
      onClickOpenDeleteTableRowModal();
    } else {
      const updatedValues = isChecked
        ? [...normalizedValues, option?.value]
        : normalizedValues.filter((v) => v !== option?.value);

      onChangeInputs(parameterKey, updatedValues);
    }
  };

  const onChangeInputs = async (key, value) => {
    // The value is already normalized, so we can pass it directly
    await updateCellData(id, key, value);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GoMakeAutoComplate
        multiple
        style={{
          ...classes.multiSelectStyle2,
          "& .MuiChip-deleteIcon": { display: "none" },
          minWidth: 180,
        }}
        onChangeTextField={
          parameterKey === "clients" ? checkWhatRenderArray : undefined
        }
        value={selectedLabels}
        disableClearable={true}
        placeholder={placeHolder}
        options={reorderedOptions}
        onChange={() => console.log("Not Work")}
        renderOption={(props: any, option: any) => {
          const isChecked = normalizedValues.includes(option?.value);

          return (
            <Stack style={classes.multiSelectOption}>
              <div>
                <Checkbox
                  onChange={(e, checked) => {
                    handleSelectCheck(parameterKey, checked, option);
                    setOption(option);
                    setChecked(checked);
                  }}
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon />}
                  checked={isChecked}
                />
              </div>
              <div>{option.label}</div>
            </Stack>
          );
        }}
        PaperComponent={(props: any) => (
          <Paper style={{ width: "100%" }} {...props}>
            {props?.children}
          </Paper>
        )}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        openModal={openDeleteTableRowModal}
        onClose={onClickCloseDeleteTableRowModal}
        hideIcon
        title={t("materials.modals.updateModalTitle")}
        yesBtn={t("documentingSettings.update")}
        onClickDelete={() => {
          const updatedValues = selectedChecked
            ? [...normalizedValues, selectedOption?.value]
            : normalizedValues.filter((v) => v !== selectedOption?.value);

          onChangeInputs(parameterKey, updatedValues);
        }}
      />
    </div>
  );
};

export { MultiSelectClientsInput };