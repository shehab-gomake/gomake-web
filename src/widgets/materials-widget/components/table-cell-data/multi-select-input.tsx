import React from "react";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { GoMakeAutoComplate } from "@/components";
import { Stack } from "@mui/material";
import { Checkbox, Paper } from "@mui/material";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { useStyle } from "./style";

interface IProps {
  parameterKey: string;
  placeholder?: string;
  values?: string[];
  id: string;
  isAdmin: boolean;
  options?: Array<{ value: string; label: string }>;
  checkWhatRenderArray?:any;
}

const MultiSelectInput = ({ values=[], parameterKey, id, isAdmin , options=[] , placeholder , checkWhatRenderArray}: IProps) => {
  const { classes } = useStyle();
  const { updateCellData } = useTableCellData(isAdmin);

  // const reorderedOptions = options?.sort((a, b) => {
  //   const isSelectedA = values.includes(a.value);
  //   const isSelectedB = values.includes(b.value);

  //   if (isSelectedA && !isSelectedB) {
  //     return -1;
  //   } else if (!isSelectedA && isSelectedB) {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  // });

  const selectedLabels = values
    .map((selectedId) => options.find((opt) => opt.value === selectedId)?.label)
    .filter((label) => label !== null && label !== undefined);

  const handleSelectCheck = (
    parameterKey: string,
    isChecked: boolean,
    option: any
  ) => {
    onChangeInputs(
      parameterKey,
      isChecked
        ? [...values, option?.value]
        : values.filter((v) => v !== option?.value)
    );
  };

  const onChangeInputs = async (key, value) => {
    await updateCellData(id, key, value);
  };

  return (
    <div style={{ width: "100%", minWidth: 300 }}>
      <GoMakeAutoComplate
        onChangeTextField={checkWhatRenderArray}
        multiple
        style={classes.multiSelectStyle2}
        value={selectedLabels}
        disableClearable={true}
        placeholder={placeholder}
        options={options}
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
                  checked={values?.includes(option?.value)}
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

export { MultiSelectInput };
