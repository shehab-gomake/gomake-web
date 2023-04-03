import * as React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";

const StyledAutocomplete: any = styled(Autocomplete)((props: any) => ({
  backgroundColor: "var(--light)",
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
  ">div>div>input": {
    marginTop: props?.style?.height ? -10 : 0,
  },
  icon: {
    fill: "red",
},
  "& .MuiOutlinedInput-root": {
    color: props?.error ? "red" : "",
    height: props?.style?.height || 40,
    fontFamily: "Lexend",
    fontStyle: "normal",
    fontWeight: 300,
    "& fieldset": {
      border: "transparent",
      boxSizing: "border-box",
      borderRadius: "4px",
    },
  },
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
  multiple = false
}: {
  value?: string;
  onChange?: any;
  style?: any;
  error?: any;
  options: any;
  autoHighlight?: any;
  getOptionLabel?: any;
  renderOption?: any;
  disableClearable?: any;
  placeholder?: string;
  defaultValue?: any;
  multiple?: any
}) => {
  console.log(defaultValue);
  const _renderOption = React.useCallback((op: string) => {
    switch (op) {
      case "admin":
        return "مشاهدة اضافة تعديل وحذف";
      case "write":
        return "مشاهدة اضافة";
      case "read":
        return "مشاهدة";

      default:
        return op;
    }
  }, []);
  return (
    <StyledAutocomplete
      value={value}
      onChange={onChange}
      style={style}
      options={options}
      renderInput={(params: any) => (
        <TextField
          {...params}
          placeholder={
            !multiple && (defaultValue?.name || _renderOption(defaultValue) || placeholder)
          }
        />
      )}
      autoHighlight={autoHighlight}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      error={error}
      disableClearable={disableClearable}
      placeholder="Enter"
      multiple={multiple}
      getOptionSelected={(option: any, value: any) => {
        return option.value === value.value
      }}
    />
  );
};

export { GoMakeAutoComplate };
