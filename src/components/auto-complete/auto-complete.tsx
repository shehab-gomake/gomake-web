import * as React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import { ArrowDownIcon } from "@/icons/arrow-down";

const StyledAutocomplete: any = styled(Autocomplete)((props: any) => ({
  boxSizing: "border-box",
  borderRadius: "4px",
  height: props?.style?.height || 40,
  fontFamily: "Lexend",
  fontStyle: "normal",
  fontWeight: 300,
  fontSize: 14,
  lineHeight: "21px",
  display: "flex",
  alignItems: "center",
  color: props?.error ? "red" : "#B9B9D9",
  border: props?.error ? "1px solid red" : "1px solid #9E9E9E",
  boxShadow: "0px 1px 60px rgba(0, 0, 0, 0.08)",
  "& .MuiOutlinedInput-root": {
    color: props?.error ? "red" : "",
    height: props?.style?.height || 40,
    fontFamily: "Lexend",
    fontStyle: "normal",
    fontWeight: 300,
    ...props?.style,
    "& fieldset": {
      border: "transparent",
      boxSizing: "border-box",
      borderRadius: "4px",
    },
    "& .MuiAutocomplete-input": {
      padding: 0,
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    top: "calc(50% - 12px)",
  },
  ...props?.style,
}));

const GoMakeAutoComplate = ({
  value,
  onChange,
  style,
  error,
  options,
  autoHighlight,
  getOptionLabel,
  renderOption,
  disableClearable,
  placeholder,
  defaultValue,
  disabled,
  multiple = false,
  arrowColor,
  onChangeTextField,
}: {
  value?: string | string[];
  onChange?: any;
  style?: any;
  error?: any;
  options: any;
  autoHighlight?: any;
  getOptionLabel?: any;
  renderOption?: any;
  disableClearable?: any;
  placeholder?: any;
  defaultValue?: any;
  multiple?: any;
  disabled?: any;
  arrowColor?: any;
  onChangeTextField?: any;
}) => {
  return (
    <StyledAutocomplete
      {...(value && { value })}
      onChange={onChange}
      style={style}
      options={options}
      disabled={disabled}
      popupIcon={<ArrowDownIcon fill={arrowColor} />}
      renderInput={(params: any) => (
        <TextField
          {...params}
          placeholder={!multiple && (defaultValue?.label || placeholder)}
          onChange={onChangeTextField || params.onChange}
        />
      )}
      defaultValue={defaultValue}
      autoHighlight={autoHighlight}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      error={error}
      disableClearable={disableClearable}
      placeholder="Enter"
      multiple={multiple}
      isOptionEqualToValue={(option: any, value: any) =>
        option?.id === value?.id
      }
      getOptionSelected={(option: any, value: any) => {
        return option?.id === value?.id;
      }}
    />
  );
};

export { GoMakeAutoComplate };
