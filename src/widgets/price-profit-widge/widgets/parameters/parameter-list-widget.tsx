
import { GoMakeMenu } from "@/components/menu/menu";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

const ParameterListWidget = ({
  parameter,
  index,
  colorStyle,
  displayValue,
  updateDropdownValue,
  updateDropdownMaterialValue,
  updateTextInputValue,
  updateProfitProfileProductParameter
}: {
  parameter: any,
  index: number,
  colorStyle: any,
  displayValue: string,
  updateDropdownValue: (value: any, index: number) => void,
  updateDropdownMaterialValue: (value: any, index: number) => void,
  updateTextInputValue: (value: string, index: number) => void,
  updateProfitProfileProductParameter: (data: any, value: any) => void
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [value, setValue] = useState(parameter?.defaultValue);
  return (
    <>
      <span
        key={index}
        onClick={handleOpen}
        style={{
          ...classes.parameterItem,
          color: colorStyle.color,
          border: `1px solid ${colorStyle.border}`,
          backgroundColor: colorStyle.backgroundColor,
        }}
      >
        {`${t(parameter.parameterName)}: ${displayValue}`}
      </span>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        style={parameter?.parameterType === 1 ? {
          marginTop: 10,
          marginLeft: 100,
        } : {}}
      >
        <div style={classes.menuContainer}>
          {parameter?.parameterType === 0 ? (
            <GoMakeAutoComplate
              options={parameter?.values}
              onChange={(e: any, value: any) => {
                updateDropdownValue(value, index);
                handleClose();

              }}
              value={parameter?.values?.find((value: any) => value.isDefault)?.label}
              placeholder={`Select ${t(parameter.parameterName)}`}
              style={{
                width: 170,
                height: 34,
                border: "none",
              }}
            />
          ) : parameter?.parameterType === 5 ?
            <GoMakeAutoComplate
              options={parameter?.materialValues}
              onChange={(e: any, value: any) => {
                updateDropdownMaterialValue(value, index);
                updateProfitProfileProductParameter(parameter, value);
                handleClose();

              }}
              getOptionLabel={(option: any) => option.value}
              value={parameter?.materialValues?.find((value: any) => value.valueId === parameter?.defaultValue)}
              placeholder={`Select ${t(parameter.parameterName)}`}
              style={{
                width: 170,
                height: 34,
                border: "none",
              }}
            /> : parameter?.parameterType === 1 || parameter?.parameterType === 2 ? (
              <GomakeTextInput
                defaultValue={parameter?.defaultValue}
                placeholder={`Enter ${t(parameter.parameterName)}`}
                onChange={(e: any) => {
                  setValue(e.target.value);
                }}
                onBlur={(e: any) => {
                  updateTextInputValue(e.target.value, index);
                  updateProfitProfileProductParameter(parameter, e.target.value);
                  handleClose();

                }}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    updateTextInputValue(e.target.value, index);
                    handleClose();
                  }
                }}
                value={value}
                style={{
                  width: 170,
                  height: 34,
                  borderRadius: 8,
                }}
              />
            ) : null}
        </div>
      </GoMakeMenu>
    </>

  );
};
export { ParameterListWidget };
