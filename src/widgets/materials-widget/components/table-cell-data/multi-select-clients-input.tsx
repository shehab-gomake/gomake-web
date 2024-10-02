import React from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate } from "@/components";
import { Stack } from "@mui/material";
import { Checkbox, Paper } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { useStyle } from "./style";
import { useCustomerDropDownList } from "@/hooks";

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
  const {
    renderOptions,
    checkWhatRenderArray,
  } = useCustomerDropDownList()


  const clientsOptions = renderOptions().map((client) => ({
    value: client.id,
    label: `${client.name} - ${client.code}`,
  }));

  const reorderedOptions = clientsOptions.sort((a, b) => {
    const isSelectedA = values.includes(a.value);
    const isSelectedB = values.includes(b.value);

    if (isSelectedA && !isSelectedB) {
      return -1;
    } else if (!isSelectedA && isSelectedB) {
      return 1;
    } else {
      return 0;
    }
  });

  const selectedLabels = values
    ?.map((selected) => reorderedOptions?.find((opt) => opt?.value === selected.ID)?.label || selected.Name)
    .filter((label) => label !== null && label !== undefined);

  const handleSelectCheck = (
    parameterKey: string,
    isChecked: boolean,
    option: any
  ) => {
    console.log("parameterKey", { parameterKey, isChecked, option });

    // Keep only the ID for handling the changes
    onChangeInputs(
      parameterKey,
      isChecked
        ? [...values, option?.value] // Add only the ID (option.value) when checked
        : values.filter((v) => v !== option?.value) // Remove only the ID when unchecked
    );
  };

  const transformValuesArray = (inputArray) => {
    return inputArray
      .map((item) => (typeof item === 'object' && item !== null ? item.ID : item)) // Extract ID if item is an object
      .filter((id) => id !== undefined); // Filter out any undefined values
  };

  const onChangeInputs = async (key, value) => {
    const values = transformValuesArray(value);
    await updateCellData(id, key, values);
  };




  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GoMakeAutoComplate
        multiple
        style={{
          ...classes.multiSelectStyle2,
          "& .MuiChip-deleteIcon": { display: "none" },
        }}
        onChangeTextField={parameterKey === "clients" ? checkWhatRenderArray : undefined}
        value={selectedLabels}
        disableClearable={true}
        placeholder={placeHolder}
        options={reorderedOptions}
        onChange={() => console.log("Not Work")}
        renderOption={(props: any, option: any) => {
          return (
            <Stack style={classes.multiSelectOption}>
              <div>
                <Checkbox
                  onChange={(e, checked) =>
                    handleSelectCheck(parameterKey, checked, option)
                  }
                  icon={<CheckboxIcon />}
                  checkedIcon={<CheckboxCheckedIcon />}
                  checked={values?.some(item => item.ID === option?.value)}
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
    </div>
  );
};

export { MultiSelectClientsInput };
